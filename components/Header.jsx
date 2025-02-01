import Image from "next/image";

import logoImg from '@/assets/logo.png';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Image src={logoImg} alt="A robot" width={100} priority />
      <h1>AI-T Chatbot</h1>
    </header>
  )
}