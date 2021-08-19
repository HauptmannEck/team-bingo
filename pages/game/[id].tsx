import React from 'react';
import Layout from '../../components/layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllGameUuids, getGame } from '../../utils/db';
import { IGame } from '../../utils/interfaces';
import { Button, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utilStyles.module.scss';
import styles from './index.module.scss';
import Words from '../../components/words';
import ErrorPage from 'next/error';

interface Props {
    gameData: IGame | null;
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

    if (router.isFallback) {
        return <div>Building Game...</div>
    } else if (gameData === null) {
        return <ErrorPage statusCode={404}/>;
    }

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
            <div className={styles.main}>
                <div className={styles.details}>
                    <p>ID: {gameData.id}</p>
                </div>
                <div className={styles.words}>
                    <Words gameUuid={gameData.uuid} />
                </div>
            </div>
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
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ( { params } ) => {
    if ( !params ) {
        return {
            props: {
                gameData: null,
            },
        };
    }
    const gameData = await getGame( params.id );
    return {
        props: {
            gameData,
        },
        revalidate: 15,
    };
};

export default Game;
