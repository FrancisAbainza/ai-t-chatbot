'use client';
import styles from './error.module.css';

export default function Error() {
  return (
    <main className={styles['error']}>
      <h1>Error</h1>
      <p>An unexpected error has occured. Please refresh the page.</p>
    </main>
  );
}