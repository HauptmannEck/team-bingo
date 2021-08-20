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
import type { IWord } from '../../utils/interfaces';

interface Props {
    gameUuid: string;
}

const addWord = async ( uuid: string, word: string ) => {
    const res = await fetch( `/api/game/${uuid}/words`, {
        body: JSON.stringify( {
            text: word,
        } ),
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
    const { data, error, mutate } = useSWR<IWord[]>( `/api/game/${gameUuid}/words` );
    const [newWord, setNewWord] = useState( '' );

    if ( error ) return <div>failed to load</div>;
    if ( !data ) return <div>loading...</div>;

    const handleAdd = () => {
        addWord( gameUuid, newWord )
            .then( () => mutate() );
        setNewWord( '' );
    };

    return (
        <>
            <Typography variant="h4">
                Words ({data?.length ?? 0})<Typography variant="subtitle1" display="inline">24 min</Typography>
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
            <form style={{width: '100%'}} onSubmit={handleAdd}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="add-word">New Word</InputLabel>
                    <Input
                        id="add-word"
                        value={newWord}
                        onChange={( event ) => setNewWord( event.target.value )}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    disabled={newWord.trim().length === 0}
                                    onClick={handleAdd}
                                    type="submit"
                                >
                                    <AddIcon/>
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </form>
        </>
    );
};

export default Words;