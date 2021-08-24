import React, { useState } from 'react';
import Layout from '../../components/layout';
import {Button, TextField, Typography} from '@material-ui/core';
import { useRouter } from 'next/router';

const sendNewGame = async ( name: string, adminCode: string ) => {
    const res = await fetch( 'api/game', {
        body: JSON.stringify( {
            name,
            adminCode,
        } ),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    } );

    if ( res.status == 201 ) {
        return await res.json();
    } else {
        throw Error( await res.text() );
    }
};

const Home: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState( '' );
    const [adminCode, setAdminCode] = useState( '' );
    const [passKey, setPassKey] = useState( '' );

    const handleCreate = () => {
        sendNewGame( name, adminCode )
            .then( ( row ) => router.push( `/game/${row.uuid}` ) );
    };

    return (
        <Layout>
            <main>
                <Typography variant="h2" component="h1">
                    Create a new Game
                </Typography>

                <Typography variant="subtitle1">
                    Select the name of the new game and the admin code. Do not share your admin code as that gives full
                    control of the game.
                </Typography>

                <TextField
                    value={name}
                    label="Name"
                    onChange={( event ) => setName( event.target.value )}
                    fullWidth
                />
                <TextField
                    value={adminCode}
                    label="Admin Code"
                    onChange={( event ) => setAdminCode( event.target.value )}
                    helperText="Keep this secure as this is required to edit the game"
                    fullWidth
                />
                <TextField
                    value={passKey}
                    label="Access Key (optional)"
                    onChange={( event ) => setPassKey( event.target.value )}
                    helperText="If you set an Access Key, all users will need it to view the game and create new boards."
                    fullWidth
                />

                <Button
                    style={{marginTop: 10}}
                    variant="contained"
                    color="primary"
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
