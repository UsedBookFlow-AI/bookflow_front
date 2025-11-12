import { NavLink, Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { BookOpen } from "lucide-react"; // npm i lucide-react (아이콘)

export default function Header() {
  const nav = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 로고 */}
        <Link to="/" className={styles.logo}>
          <BookOpen size={20} className={styles.logoIcon} />
          <span className={styles.logoText}>UsedBookFlow</span>
        </Link>

        {/* 우측 메뉴 */}
        <nav className={styles.nav}>
          <button
            className={styles.textBtn}
            onClick={() => nav("/login")}
          >
            로그인
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => nav("/signup")}
          >
            회원가입
          </button>
          <button
            className={styles.textBtn}
            onClick={() => nav("/recommendations")}
          >
            서비스
          </button>
        </nav>
      </div>
    </header>
  );
}