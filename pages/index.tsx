import React from 'react';
import Link from 'next/link';
import styles from './index.module.scss';
import Layout from '../components/layout';
import type {IGame} from '../utils/interfaces';
import {GetStaticProps} from 'next';
import {getRandomGames} from '../utils/db';
import {Button} from '@material-ui/core';

interface IProps {
    randomGames: IGame[];
}

const Home: React.FC<IProps> = ({randomGames}) => {
    return (
        <Layout>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to Team Bingo
                </h1>

                <p className={styles.description}>
                    Host and play a custom game of bingo with your team
                </p>

                <Link href={'/game'}>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Create New Game
                    </Button>
                </Link>

                <div className={styles.grid}>
                    {randomGames.map(game => (
                        <Link key={game.id} href={`/game/${game.uuid}`} passHref>
                            <a className={styles.card}>
                                <h2>{game.name}</h2>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps<IProps> = async () => {
    const games = await getRandomGames();
    return {
        props: {
            randomGames: games,
        },
        revalidate: 15,
    };
};

export default Home;
