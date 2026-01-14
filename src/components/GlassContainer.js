'use client';

import styles from './GlassContainer.module.css';

export default function GlassContainer({ children, className = '', style = {} }) {
    return (
        <div className={`${styles.glass} ${className}`} style={style}>
            {children}
        </div>
    );
}
