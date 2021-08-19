import React from 'react';
import Layout from '../../components/layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllGameUuids, getGame } from '../../utils/db';
import { IGame } from '../../utils/interfaces';
import { Button, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utilStyles.module.scss';

interface Props {
    gameData: IGame;
}

const deleteGame = async ( uuid: string ) => {
    const res = await fetch( `/api/game/${uuid}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'DELETE',
    } );

    if ( res.status == 204 ) {
        return;
    } else {
        throw Error( await res.text() );
    }
};

const Game: React.FC<Props> = ( { gameData } ) => {
    const router = useRouter();

    const handleDelete = () => {
        deleteGame( gameData.uuid )
            .then( () => router.push( '/' ) );
    };

    return (
        <Layout
            toolbar={(
                <>
                    <Typography variant="h6" color="inherit" className={utilStyles.appBarTitle}>
                        {gameData.name}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleDelete}
                        color="secondary"
                    >
                        Delete Game
                    </Button>
                </>
            )}
        >
            <Head>
                <title>{gameData.name} - Team Bingo</title>
            </Head>
            <article>
                <h1></h1>
                <div>
                    <p>ID: {gameData.id}</p>
                </div>
            </article>
        </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const uuids = await getAllGameUuids();
    return {
        paths: uuids.map( item => ({
            params: {
                id: item,
            },
        }) ),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ( { params } ) => {
    if ( !params ) {
        return {
            props: {
                gameData: {},
            },
        };
    }
    const gameData = await getGame( params.id );
    return {
        props: {
            gameData,
        },
    };
};

export default Game;
