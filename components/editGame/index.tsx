import React, {useState} from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField,
} from '@material-ui/core';
import type {IGame} from '../../utils/interfaces';
import {useRouter} from 'next/router';

interface Props {
    game: IGame;
}

const deleteGame = async (uuid: string) => {
    const res = await fetch(`/api/game/${uuid}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'DELETE',
    });

    if (res.status == 204) {
        return;
    } else {
        throw Error(await res.text());
    }
};

const editGame = async (uuid: string, updates: Partial<IGame>) => {
    const res = await fetch(`/api/game/${uuid}`, {
        body: JSON.stringify(updates),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });

    if (res.status == 204) {
        return;
    } else {
        throw Error(await res.text());
    }
};

const EditGame: React.FC<Props> = ({game}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(game.name);
    const [desc, setDesc] = useState(game.desc);

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        deleteGame(game.uuid)
            .then(() => router.push('/'));
    };

    const handleSave = () => {
        editGame(game.uuid, {
            name,
            desc,
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