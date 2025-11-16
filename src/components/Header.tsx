// Header.tsx
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>
          <BookOpen size={20} className={styles.logoIcon} />
          <span className={styles.logoText}>UsedBookFlow</span>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.active : ""}`
            }
          >
            로그인
          </NavLink>

          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.active : ""}`
            }
          >
            회원가입
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.active : ""}`
            }
          >
            서비스
          </NavLink>
        </nav>
      </div>
    </header>
  );
}