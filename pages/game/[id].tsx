import React from "react";
import Layout from "../../components/layout";
import {GetStaticPaths, GetStaticProps} from "next";
import Head from "next/head";
import {getAllGameUuids, getGame} from '../../utils/db';
import {IGame} from '../../utils/interfaces';

interface Props {
    gameData: IGame;
}

const Game: React.FC<Props> = ({gameData}) => (
    <Layout>
        <Head>
            <title>{gameData.name}</title>
        </Head>
        <article>
            <h1>{gameData.name}</h1>
            <div>
                <p>ID: {gameData.id}</p>
            </div>
        </article>
    </Layout>
);

export const getStaticPaths: GetStaticPaths = async () => {
    const uuids = await getAllGameUuids()
    return {
        paths: uuids.map(item => ({
            params: {
                id: item,
            },
        })),
        fallback: false
    }
};

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({params}) => {
    if(!params){
        return{
            props: {
                gameData: {},
            }
        };
    }
    const gameData = await getGame(params.id)
    return {
        props: {
            gameData
        }
    }
}

export default Game;
