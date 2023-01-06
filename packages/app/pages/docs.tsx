import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Docs() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Living Documentation</h1>
        <p className={styles.description}>
            Testing
            Hey!!!
          <Link href="/">&larr; Go Back</Link>
        </p>
      </main>
    </div>
  )
}
