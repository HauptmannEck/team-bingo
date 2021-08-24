import React, {useEffect, useState} from 'react';
import {
    Button,TextField,
    Typography,
} from '@material-ui/core';
import {IGame} from '../../utils/interfaces';

interface Props {
    game: IGame;
    onVerified: () => void;
}

const checkKey = async (uuid: string, key: string): Promise<boolean> => {
    const res = await fetch(`/api/game/${uuid}/verify`, {
        body: JSON.stringify({
            key,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });

    if (res.status == 200) {
        const json = await res.json();
        return json.matches;
    } else {
        throw Error(await res.text());
    }
};

export const storageKey = (uuid: string) => `team-bingo:pass-key:${uuid}`;

const GameKeyCheck: React.FC<Props> = ({game, onVerified}) => {
    const [key, setKey] = useState('');
    const [unmatched, setUnmatched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedKey = window.localStorage.getItem(storageKey(game.uuid));
        if (savedKey) {
            setLoading(true);
            checkKey(game.uuid, savedKey)
                .then(matches => {
                    if (matches) {
                        onVerified();
                    } else {
                        setLoading(false);
                    }
                });
        }
    }, [game.uuid, onVerified]);

    if (loading) {
        return <div>Loading Game...</div>;
    }

    const handleCheck = (event: React.FormEvent) => {
        event.preventDefault();
        setUnmatched(false);
        checkKey(game.uuid, key)
            .then(matches => {
                if (matches) {
                    window.localStorage.setItem(storageKey(game.uuid), key);
                    onVerified();
                } else {
                    setUnmatched(true);
                }
            });
    };

    return (
        <>
            <Typography variant="h3" component="h1">Access Key Required</Typography>
            <Typography variant="body1">
                This Game is protected by an access key, please enter the key setup by the admin to proceed.
            </Typography>
            <form style={{width: '100%'}} onSubmit={handleCheck}>
                <TextField
                    label="Pass Key"
                    value={key}
                    onChange={event => setKey(event.target.value)}
                    error={unmatched}
                    helperText={unmatched ? 'Access Key does not match' : undefined}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={key.trim().length === 0}
                    type="submit"
                >Access</Button>
            </form>
        </>
    );
};

export default GameKeyCheck;