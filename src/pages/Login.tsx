import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    if (!id || !pw) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      // TODO: 실제 로그인 API 연동
      // await api.login({ id, pw });
      nav("/"); // 성공 시 메인으로
    } catch (err) {
      setError("로그인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>로그인</h1>

      <form className={styles.card} onSubmit={onSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>아이디 입력</label>
          <input
            className={styles.input}
            placeholder="아이디 입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>비밀번호 입력</label>
          <input
            className={styles.input}
            type="password"
            placeholder="비밀번호 입력"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </form>

      <button className={styles.primary} onClick={() => (document.forms[0] as HTMLFormElement)?.requestSubmit()}>
        로그인하기
      </button>

      <p className={styles.helper}>
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}