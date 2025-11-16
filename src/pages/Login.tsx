import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type LoginResponse = {
  message: string;
  status: "success" | "fail" | string;
  user_id?: string;
};

export default function Login() {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    if (!id || !pw) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ form-data 로 로그인 요청
      const fd = new FormData();
      fd.append("user_id", id);
      fd.append("password", pw);

      const res = await fetch(`${API_BASE}/api/bookflow/login/`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("로그인 요청에 실패했습니다.");
      }

      const data = (await res.json()) as LoginResponse;

      if (data.status !== "success" || !data.user_id) {
        throw new Error(data.message || "아이디 또는 비밀번호가 올바르지 않습니다.");
      }

      // ✅ 프론트 세션 저장 (30분 유지)
      const now = Date.now();
      const expiresAt = now + 30 * 60 * 1000; // 30분

      const session = {
        userId: data.user_id,
        loginAt: now,
        expiresAt,
      };

      localStorage.setItem("ubf_auth", JSON.stringify(session));

      // 홈 또는 마이페이지로 이동
      nav("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "로그인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
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

        {/* ✅ 버튼을 form 안에 두고 submit 으로 */}
        <button className={styles.primary} type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인하기"}
        </button>
      </form>

      <p className={styles.helper}>
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}