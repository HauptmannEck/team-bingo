import React, {useState} from 'react';
import styles from '../index.module.scss';
import Layout from '../../components/layout';
import {Button, TextField} from '@material-ui/core';
import {useRouter} from 'next/router';

const sendNewGame = async (name: string, adminCode: string) => {
    const res = await fetch('api/create-game', {
        body: JSON.stringify({
            name,
            adminCode,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    })

    if (res.status == 201) {
        return await res.json();
    } else {
        throw Error(await res.text());
    }
}

const Home: React.FC = () => {
    const router = useRouter()
    const [name, setName] = useState('');
    const [adminCode, setAdminCode] = useState('');

    const handleCreate = () => {
        sendNewGame(name, adminCode)
            .then((row) => router.push(`/game/${row.uuid}`));
    }

    return (
        <Layout>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Create a new Game
                </h1>

                <p className={styles.description}>
                    Select the name of the new game and the admin code. Do not share your admin code as that gives full control of the game.
                </p>

                <TextField
                    value={name}
                    label="Name"
                    onChange={(event) => setName(event.target.value)}
                />
                <TextField
                    value={adminCode}
                    label="Admin Code"
                    onChange={(event) => setAdminCode(event.target.value)}
                />
                <Button
                    disabled={!name || !adminCode}
                    onClick={handleCreate}
                >
                    Create
                </Button>
            </main>
        </Layout>
    );
};

export default Home;
