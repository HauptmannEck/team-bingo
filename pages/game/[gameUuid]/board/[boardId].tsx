import React from 'react';
import Layout from '../../../../components/layout';
import Head from 'next/head';
import type { IBoard, ICell } from '../../../../utils/interfaces';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import utilStyles from '../../../../styles/utilStyles.module.scss';
import styles from '../board.module.scss';
import useSWR from 'swr';
import ErrorPage from 'next/error';

interface Props {
    gameUuid: string;
    boardId: string;
}

const editBoard = async ( uuid: string, id: number, name: string, cells: ICell[] ) => {
    const res = await fetch( `/api/game/${uuid}/board/${id}`, {
        body: JSON.stringify( {
            name,
            cells: cells.map( cell => ({
                id: cell.wordId,
                selected: cell.selected,
            }) ),
        } ),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    } );

    if ( res.status == 204 ) {
        return;
    } else {
        throw Error( await res.text() );
    }
};

interface ICellProps extends Partial<ICell> {
    onClick?: () => void;
}

const SelectedSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="100%" width="100%" viewBox="0 0 24 24">
        <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
);

const Cell: React.FC<ICellProps> = ( { wordId, word = '', selected = false, onClick } ) => (
    <div className={`${styles.cell} ${selected ? styles.active : ''} ${wordId === -1 ? styles.free : ''}`} onClick={onClick}>
        <Typography variant="h6" className={styles.text}>{word}</Typography>
        <div className={styles.check}><SelectedSVG/></div>
    </div>
);

const Board: React.FC<Props> = () => {
    const router = useRouter();
    const { gameUuid, boardId } = router.query;
    const { data, error, mutate } = useSWR<IBoard>( `/api/game/${gameUuid}/board/${boardId}` );

    if ( error ) return <ErrorPage statusCode={404}/>;

    const handleClick = ( selected: boolean, id?: number ) => {
        if ( !data || !id || id < 0 ) {
            return;
        }
        const newCells = data.cells.map( cell => {
            const newCell = { ...cell };
            if ( cell.wordId === id ) {
                newCell.selected = !newCell.selected;
            }
            return newCell;
        } );
        editBoard( gameUuid as string, parseInt( boardId as string ), data?.name, newCells )
            .then( () => mutate( {
                id: data?.id,
                name: data?.name,
                gameUuid: data?.gameUuid,
                cells: newCells,
            }, true ) )
            .then( res => console.log( res ) );
    };

    const getCells = ( dataCells: ICell[] = [] ) => {
        const cells: JSX.Element[] = [];
        for ( let i = 0; i <= 24; i++ ) {
            let cellData: ICell | undefined;
            if ( i < 12 ) {
                cellData = dataCells[i];
            } else if ( i === 12 ) {
                cellData = {
                    wordId: -1,
                    word: 'Free Space',
                    selected: true,
                };
            } else {
                cellData = dataCells[i - 1];
            }
            cells.push(
                <Cell
                    key={i}
                    onClick={cellData?.wordId >= 0 ? () => handleClick( !cellData?.selected, cellData?.wordId ) : undefined}
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
                        {data?.name ?? ''}
                    </Typography>
                </>
            )}
        >
            <Head>
                <title>{data?.name ?? ''} - Team Bingo</title>
            </Head>
            <div className={styles.board}>
                {getCells( data?.cells )}
            </div>
        </Layout>
    );
};

export default Board;
