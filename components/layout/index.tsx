import React from 'react';
import {AppBar, Container, createTheme, IconButton, ThemeProvider, Toolbar, useMediaQuery} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import {useRouter} from 'next/router';
import styles from './index.module.scss';

interface Props {
    toolbar?: JSX.Element;
}

const darkTheme = createTheme({
    palette: {
        type: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        type: 'light',
    },
});

const Layout: React.FC<Props> = ({children, toolbar}) => {
    const router = useRouter();

    return (
            <Container className={styles.container}>
                <AppBar>
                    <Toolbar variant="dense">
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => router.push('/')}>
                            <HomeIcon/>
                        </IconButton>
                        {toolbar ?? ''}
                    </Toolbar>
                </AppBar>
                <Toolbar variant="dense"/>
                <main className={styles.main}>
                    {children}
                </main>
                <footer>From Happy Bandit</footer>
            </Container>
    );
};

export default Layout;