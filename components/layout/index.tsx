import React from "react";
import styles from './index.module.scss'

interface Props {
    home?: boolean;
}

const Layout: React.FC<Props> = ({children, home = false}) => (
    <div className={styles.container}>
        {children}
        <footer>From Happy Bandit</footer>
    </div>
);

export default Layout;