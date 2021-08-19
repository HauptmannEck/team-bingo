import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import { SWRConfig } from 'swr';

export const siteTitle = 'Team Bingo';

const App: React.FC<AppProps> = ( { Component, pageProps } ) => {
    React.useEffect( () => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector( '#jss-server-side' );
        if ( jssStyles ) {
            jssStyles.parentElement!.removeChild( jssStyles );
        }
    }, [] );
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
            <CssBaseline/>
            <SWRConfig
                value={{
                    refreshInterval: 10000,
                    fetcher: ( resource, init ) => fetch( resource, init ).then( res => res.json() ),
                }}
            >
                <Component {...pageProps}/>
            </SWRConfig>
        </>
    );
};

export default App;