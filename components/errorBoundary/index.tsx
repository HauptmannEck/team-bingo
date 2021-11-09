import React from 'react';
import { Logtail } from '@logtail/browser';

let logger: Logtail | undefined;
if ( process.env.NEXT_PUBLIC_LOGTAIL_SOURCE_TOKEN ) {
    logger = new Logtail( process.env.NEXT_PUBLIC_LOGTAIL_SOURCE_TOKEN );
}

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
    constructor( props: any ) {
        super( props );
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch( error: string | Error, errorInfo: any ) {
        // You can also log the error to an error reporting service
        if ( logger ) {
            return logger.error( error, errorInfo );
        }
    }

    render() {
        if ( this.state.hasError ) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
