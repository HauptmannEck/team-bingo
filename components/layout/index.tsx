import React from 'react';
import {
    AppBar,
    Container,
    IconButton,
    Link,
    Toolbar,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import {useRouter} from 'next/router';
import styles from './index.module.scss';

interface Props {
    toolbar?: JSX.Element;
}

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
                <footer>From <Link href="https://github.com/HauptmannEck/team-bingo">Happy Bandit</Link> {(new Date()).getFullYear()}</footer>
            </Container>
    );
};

export default Layout;