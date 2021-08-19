import React, {useState} from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField,
} from '@material-ui/core';
import {IGame} from '../../utils/interfaces';
import {useRouter} from 'next/router';

interface Props {
    game: IGame;
}

const createBoard = async (uuid: string, name: string, email: string) => {
    const res = await fetch(`/api/game/${uuid}`, {
        body: JSON.stringify({
            name,
            email,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });

    if (res.status == 204) {
        return await res.json();
    } else {
        throw Error(await res.text());
    }
};

const CreateBoard: React.FC<Props> = ({game}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        createBoard(game.uuid, name, email)
            .then(({id}) => router.push(`/game/${game.uuid}/board/${id}`));
    };

    return (
        <>
            <Button variant="text" color="secondary" onClick={() => setOpen(true)} fullWidth>
                Create a Bingo Sheet
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create a New Bingo Sheet</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a personal Bingo Sheet for the {game.name} Game
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Board Name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email (optional)"
                        value={email}
                        type="email"
                        onChange={event => setEmail(event.target.value)}
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
            </Dialog>
        </>
    );
};

export default CreateBoard;