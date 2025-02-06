import { motion } from "framer-motion"

import styles from './LoadingIndicator.module.css'

export default function LoadingIndicator() {
  return (
    <div
      className={`${styles.loadingIndicator}`}
    >
      <motion.div
        className={styles.loadingDot}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      <motion.div
        className={styles.loadingDot}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      />
      <motion.div
        className={styles.loadingDot}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
    </div>
  )
}