import React, {useContext, useEffect, useState} from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField,
} from '@material-ui/core';
import type {IGame} from '../../utils/interfaces';
import {useRouter} from 'next/router';
import adminContext from './../adminCheck/adminContext';

interface Props {
    game: IGame;
}

const deleteGame = async (uuid: string, key: string) => {
    const res = await fetch(`/api/game/${uuid}`, {
        headers: {
            'Content-Type': 'application/json',
            'admin-key': key,
        },
        method: 'DELETE',
    });

    if (res.ok) {
        return;
    } else {
        throw Error(await res.text());
    }
};

interface IEdit {
    name: string;
    desc: string | null;
    passKey: string | null;
}

const editGame = async (uuid: string, key: string, updates: Partial<IEdit>) => {
    const res = await fetch(`/api/game/${uuid}`, {
        body: JSON.stringify(updates),
        headers: {
            'Content-Type': 'application/json',
            'admin-key': key,
        },
        method: 'PUT',
    });

    if (res.ok) {
        return;
    } else {
        throw Error(await res.text());
    }
};

const getKey = async (uuid: string, adminKey: string): Promise<{passKey: string | null}> => {
    const res = await fetch(`/api/game/${uuid}/pass-key`, {
        headers: {
            'Content-Type': 'application/json',
            'admin-key': adminKey,
        },
        method: 'GET',
    });

    if (res.ok) {
        return await res.json();
    } else {
        throw Error(await res.text());
    }
};

const EditGame: React.FC<Props> = ({game}) => {
    const router = useRouter();
    const admin = useContext(adminContext);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(game.name);
    const [desc, setDesc] = useState(game.desc);
    const [passKey, setPassKey] = useState<string | null>( null );

    useEffect(() => {
        if(!admin || !open){
            return;
        }
        getKey(game.uuid, admin)
            .then(json => setPassKey(json.passKey ?? ''));
    }, [open, game.uuid, admin]);

    if(!admin){
        return null;
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        deleteGame(game.uuid, admin)
            .then(() => router.push('/'));
    };

    const handleSave = () => {
        editGame(game.uuid, admin,{
            name,
            desc: desc?.trim() || null,
            passKey: passKey?.trim() || null,
        }).then(() => setOpen(false));
    };

    return (
        <>
            <Button variant="text" color="secondary" onClick={() => setOpen(true)}>
                Edit Game
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Game Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Game Name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="desc"
                        label="Description"
                        value={desc}
                        onChange={event => setDesc(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="pass"
                        label="Access Key (optional)"
                        value={passKey ?? ''}
                        onChange={event => setPassKey(event.target.value)}
                        fullWidth
                        disabled={passKey === null}
                        helperText="If you set an Access Key, all users will need it to view the game and create new boards."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={name.trim().length === 0} onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
                <DialogContent>
                    <DialogContentText>
                        Danger Area: This cannot be undone, so be sure you want to do this.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditGame;