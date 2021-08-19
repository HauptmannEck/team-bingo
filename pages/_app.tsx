import React, {useEffect} from 'react';
import type {AppProps} from 'next/app';
import '../styles/globals.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import {SWRConfig} from 'swr';
import {ThemeProvider} from '@material-ui/styles';
import {createTheme, useMediaQuery} from '@material-ui/core';

export const siteTitle = 'Team Bingo';

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

const App: React.FC<AppProps> = ({Component, pageProps}) => {
    const isDarkModeEnabled = useMediaQuery('(prefers-color-scheme: dark)');
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <meta
                    name="description"
                    content="Make bingo cards for your team"
                />
                <meta name="og:title" content={siteTitle}/>
                <meta name="twitter:card" content="summary_large_image"/>
            </Head>
            <ThemeProvider theme={isDarkModeEnabled ? darkTheme : lightTheme}>
                <CssBaseline/>
                <SWRConfig
                    value={{
                        refreshInterval: 10000,
                        fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
                    }}
                >
                    <Component {...pageProps}/>
                </SWRConfig>
            </ThemeProvider>
        </>
    );
};

export default App;