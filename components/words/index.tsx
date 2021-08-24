import React, {useContext, useState} from 'react';
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
import adminContext from '../adminCheck/adminContext';

interface Props {
    gameUuid: string;
}

const addWord = async ( uuid: string, key: string, word: string ) => {
    const res = await fetch( `/api/game/${uuid}/words`, {
        body: JSON.stringify( {
            text: word,
        } ),
        headers: {
            'Content-Type': 'application/json',
            'admin-key': key,
        },
        method: 'POST',
    } );

    if ( res.ok ) {
        return;
    } else {
        throw Error( await res.text() );
    }
};

const Words: React.FC<Props> = ( { gameUuid } ) => {
    const { data, error, mutate } = useSWR<IWord[]>( `/api/game/${gameUuid}/words` );
    const [newWord, setNewWord] = useState( '' );
    const admin = useContext(adminContext);

    if ( error ) return <div>failed to load</div>;
    if ( !data ) return <div>loading...</div>;

    const handleAdd = () => {
        if(!admin){
            return;
        }
        addWord( gameUuid, admin, newWord )
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
            {admin !== null && (
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
            )}
        </>
    );
};

export default Words;