import React, {useState} from 'react';
import Layout from '../../../components/layout';
import {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import {getAllGameUuids, getGame} from '../../../utils/db';
import type {IGame} from '../../../utils/interfaces';
import {Typography} from '@material-ui/core';
import {useRouter} from 'next/router';
import utilStyles from '../../../styles/utilStyles.module.scss';
import styles from './index.module.scss';
import Words from '../../../components/words';
import ErrorPage from 'next/error';
import EditGame from '../../../components/editGame';
import CreateBoard from '../../../components/createBoard';
import GameKeyCheck from '../../../components/gameKeyCheck';
import AdminContext from '../../../components/adminCheck/adminContext';
import AdminCheck from '../../../components/adminCheck';

interface Props {
    gameData: IGame | null;
}

const Game: React.FC<Props> = ({gameData}) => {
    const router = useRouter();
    const [loaded, setLoaded] = useState(!gameData?.passKey);
    const [admin, setAdmin] = useState<string| null>(null);

    if (router.isFallback) {
        return <div>Building Game...</div>;
    } else if (gameData === null) {
        return <ErrorPage statusCode={404}/>;
    }

    return (
        <AdminContext.Provider value={admin}>
            <Layout
                toolbar={(
                    <>
                        <Typography variant="h6" component="h1" color="inherit" className={utilStyles.appBarTitle}>
                            {gameData.name}
                        </Typography>
                        {admin ? (
                            <EditGame game={gameData}/>
                        ) : (
                            <AdminCheck game={gameData} onVerify={key => setAdmin(key)}/>
                        )}
                    </>
                )}
            >
                <Head>
                    <title>{gameData.name} - Team Bingo</title>
                </Head>
                {loaded ? (
                    <div className={styles.main}>
                        <div className={styles.details}>
                            <Typography>{gameData.desc ?? ''}</Typography>
                            <CreateBoard game={gameData}/>
                        </div>
                        <div className={styles.words}>
                            <Words gameUuid={gameData.uuid}/>
                        </div>
                    </div>
                ) : (
                    <GameKeyCheck game={gameData} onVerified={() => setLoaded(true)}/>
                )}
            </Layout>
        </AdminContext.Provider>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const uuids = await getAllGameUuids();
    return {
        paths: uuids.map(item => ({
            params: {
                gameUuid: item,
            },
        })),
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<any, { gameUuid: string }> = async ({params}) => {
    if (!params) {
        return {
            props: {
                gameData: null,
            },
        };
    }
    const gameData = await getGame(params.gameUuid);
    return {
        props: {
            gameData,
        },
        revalidate: 15,
    };
};

export default Game;
