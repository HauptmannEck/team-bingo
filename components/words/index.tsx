import React, { useState } from 'react';
import {
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    List,
    ListItem, Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useSWR from 'swr';
import styles from './index.module.scss';
import { IWord } from '../../utils/interfaces';

interface Props {
    gameUuid: string;
}

const addWord = async ( uuid: string, word: string ) => {
    const res = await fetch( `/api/game/${uuid}/words`, {
        body: JSON.stringify({
            text: word,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    } );

    if ( res.status == 204 ) {
        return;
    } else {
        throw Error( await res.text() );
    }
};

const Words: React.FC<Props> = ( { gameUuid } ) => {
    const { data, error } = useSWR<IWord[]>( `/api/game/${gameUuid}/words` );
    const [newWord, setNewWord] = useState('');

    if ( error ) return <div>failed to load</div>;
    if ( !data ) return <div>loading...</div>;

    const handleAdd = () => {
        addWord(gameUuid, newWord);
        setNewWord('');
    };

    return (
        <>
            <Typography variant="h4">
                Words ({data?.length ?? 0}/24 min)
            </Typography>
            <div className={styles.list}>
                <List>
                    {data.map( word => (
                        <ListItem key={word.id}>
                            {word.text}
                        </ListItem>
                    ) )}
                </List>
            </div>
            <FormControl>
                <InputLabel htmlFor="add-word">New Word</InputLabel>
                <Input
                    id="add-word"
                    value={newWord}
                    onChange={(event) => setNewWord(event.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                disabled={newWord.trim().length === 0}
                                onClick={handleAdd}
                            >
                                <AddIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </>
    );
};

export default Words;