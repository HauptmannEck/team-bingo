import React from 'react';
import { AppBar, Container, IconButton, Toolbar } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { useRouter } from 'next/router';

interface Props {
    toolbar?: JSX.Element;
}

const Layout: React.FC<Props> = ( { children, toolbar } ) => {
    const router = useRouter();

    return (
        <>
            <AppBar>
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => router.push('/')}>
                        <HomeIcon/>
                    </IconButton>
                    {toolbar ?? ''}
                </Toolbar>
            </AppBar>
            <Toolbar variant="dense"/>
            <Container>
                {children}
                <footer>From Happy Bandit</footer>
            </Container>
        </>
    );
};

export default Layout;