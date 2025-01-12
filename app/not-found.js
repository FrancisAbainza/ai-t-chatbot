import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles['not-found']}>
      <h1>Not found</h1>
      <p>Unfortunately, we could not find the requested page or resource.</p>
    </main>
  );
}
