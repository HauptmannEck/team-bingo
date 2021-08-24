import React, {useState} from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField,
} from '@material-ui/core';
import type {IGame} from '../../utils/interfaces';

interface Props {
    game: IGame;
    onVerify: (key: string) => void;
}

const verifyKey = async (uuid: string, adminKey: string): Promise<{matches: boolean}> => {
    const res = await fetch(`/api/game/${uuid}/verify-admin`, {
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

const AdminCheck: React.FC<Props> = ({game, onVerify}) => {
    const [open, setOpen] = useState(false);
    const [unmatched, setUnmatched] = useState(false);
    const [adminKey, setAdminKey] = useState<string>( '' );

    const handleClose = () => {
        setOpen(false);
    };

    const handleCheck = (event: React.FormEvent) => {
        event.preventDefault();
        setUnmatched(false);
        verifyKey(game.uuid, adminKey)
            .then(({matches}) => {
                if(matches){
                    onVerify(adminKey);
                    handleClose();
                } else {
                    setUnmatched(true);
                }
            });
    };

    return (
        <>
            <Button variant="text" color="secondary" onClick={() => setOpen(true)}>
                Login as Admin
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Admin Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the Admin code set when creating the game. To log back out just refresh your browser. If it is lost a new game will have to be created.
                    </DialogContentText>
                    <form id="admin-check-form" style={{width: '100%'}} onSubmit={handleCheck}>
                        <TextField
                            autoFocus
                            label="Admin Key"
                            value={adminKey}
                            onChange={event => setAdminKey(event.target.value)}
                            error={unmatched}
                            helperText={unmatched ? 'Admin Key does not match' : undefined}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={adminKey.trim().length === 0}
                        type="submit"
                        form="admin-check-form"
                    >
                        Access
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminCheck;