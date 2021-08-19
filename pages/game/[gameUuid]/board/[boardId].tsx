import React from 'react';
import Layout from '../../../../components/layout';
import {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import {getAllGameUuids, getGame} from '../../../../utils/db';
import {IBoard, ICell, IGame, IWord} from '../../../../utils/interfaces';
import {Button, Typography} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import {useRouter} from 'next/router';
import utilStyles from '../../../../styles/utilStyles.module.scss';
import styles from '../board.module.scss';
import Words from '../../../../components/words';
import ErrorPage from 'next/error';
import EditGame from '../../../../components/editGame';
import useSWR from 'swr';

interface Props {
    gameUuid: string;
    boardId: string;
}

const testBoard: IBoard = {
    name: 'Test Board',
    id: 0,
    gameUuid: '',
    cells: [{
        wordId: 0,
        word: 'first',
        selected: false,
    }, {
        wordId: 0,
        word: 'second',
        selected: true,
    }],
};

interface ICellProps extends Partial<ICell> {
    onClick: (selected: boolean) => void;
}

const SelectedSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="100%" width="100%" viewBox="0 0 24 24">
        <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
);

const Cell: React.FC<ICellProps> = ({word = '', selected = false}) => (
    <div className={`${styles.cell} ${selected ? styles.active : ''}`}>
        <Typography variant="h6" className={styles.text}>{word}</Typography>
        <div className={styles.check}><SelectedSVG/></div>
    </div>
);

const Game: React.FC<Props> = () => {
    const router = useRouter();
    const {gameUuid, boardId} = router.query;
    //const { data, error } = useSWR<IWord[]>( `/api/game/${gameUuid}/${boardId}` );
    const data = testBoard;
    if (router.isFallback) {
        return <div>Building Board...</div>;
    }

    const getCells = () => {
        const cells: JSX.Element[] = [];
        for (let i = 0; i <= 24; i++) {
            let cellData: ICell;
            if (i < 12) {
                cellData = data.cells[i];
            } else if (i === 12) {
                cellData = {
                    wordId: -1,
                    word: 'Free Space',
                    selected: true,
                };
            } else {
                cellData = data.cells[i - 1];
            }
            cells.push(
                <Cell
                    key={i}
                    onClick={() => null}
                    wordId={cellData?.wordId}
                    word={cellData?.word}
                    selected={cellData?.selected}
                />,
            );
        }
        return cells;
    };

    return (
        <Layout
            toolbar={(
                <>
                    <Typography variant="h6" color="inherit" className={utilStyles.appBarTitle}>
                        {data.name}
                    </Typography>
                </>
            )}
        >
            <Head>
                <title>{data.name} - Team Bingo</title>
            </Head>
            <div className={styles.board}>
                {getCells()}
            </div>
        </Layout>
    );
};

export default Game;
