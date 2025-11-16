import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css"; // 숨은 문자 없게 한 번 확인!

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type FormState = {
  id: string;
  pw: string;
  orgName: string;
  isSupply: boolean;
  isProcurement: boolean;
  address: string;
  contact: string;
};

export default function Signup() {
  const nav = useNavigate();

  const [form, setForm] = useState<FormState>({
    id: "",
    pw: "",
    orgName: "",
    isSupply: false,        // 도서 공급 기관 여부
    isProcurement: false,   // 도서 수급 기관 여부
    address: "",
    contact: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 공통 필드 setter
  const setField =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const handleAddressSearch = () => {
    // TODO: 주소 검색 모달/다음 주소 연동
    alert("주소 검색을 연결해 주세요 :)");
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    const { id, pw, orgName, address, contact, isSupply, isProcurement } = form;

    // 1) 기본 검증
    if (!id || !pw || !orgName || !address || !contact) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }

    // 기관 유형 검증 (둘 중 하나 이상 선택)
    if (!isSupply && !isProcurement) {
      setError("기관 유형을 최소 1개 이상 선택해 주세요.");
      return;
    }

    try {
      setLoading(true);

      // 2) FormData 생성
      const fd = new FormData();
      fd.append("user_id", id);
      fd.append("password", pw);
      fd.append("institution_name", orgName);
      fd.append("institution_address", address);
      fd.append("contact", contact);
      fd.append("is_supply_institution", String(isSupply));         // true / false
      fd.append("is_procurement_institution", String(isProcurement));

      const res = await fetch(`${API_BASE}/api/bookflow/register/`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let msg = "회원가입에 실패했습니다.";
        try {
          const data = await res.json();
          if (data.message) msg = data.message;
        } catch {
          // JSON 파싱 실패 시 기본 메시지 사용
        }
        throw new Error(msg);
      }

      const data = await res.json();
      console.log("signup result:", data);

      alert("회원가입이 완료되었습니다. 로그인 후 이용해 주세요!");
      nav("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>회원가입</h1>

        <form className={styles.card} onSubmit={onSubmit}>
          <Field label="아이디 입력">
            <input
              className={styles.input}
              placeholder="아이디 입력"
              value={form.id}
              onChange={(e) => setField("id")(e.target.value)}
              autoComplete="username"
            />
          </Field>

          <Field label="비밀번호 입력">
            <input
              className={styles.input}
              type="password"
              placeholder="비밀번호 입력"
              value={form.pw}
              onChange={(e) => setField("pw")(e.target.value)}
              autoComplete="new-password"
            />
          </Field>

          <Field label="기관명 입력">
            <input
              className={styles.input}
              placeholder="기관명 입력"
              value={form.orgName}
              onChange={(e) => setField("orgName")(e.target.value)}
            />
          </Field>

          {/* ✅ 기관 유형 : 둘 다 선택 가능 */}
          <Field label="기관 유형 선택">
            <div className={styles.typeRow} role="group" aria-label="기관 유형">
              <button
                type="button"
                aria-pressed={form.isProcurement}
                className={`${styles.typeBtn} ${
                  form.isProcurement ? styles.typeOn : styles.typeOff
                }`}
                onClick={() => setField("isProcurement")(!form.isProcurement)}
              >
                도서 수급 기관
              </button>
              <button
                type="button"
                aria-pressed={form.isSupply}
                className={`${styles.typeBtn} ${
                  form.isSupply ? styles.typeOn : styles.typeOff
                }`}
                onClick={() => setField("isSupply")(!form.isSupply)}
              >
                도서 공급 기관
              </button>
            </div>
          </Field>

          <Field label="기관 주소 입력">
            <div className={styles.addressRow}>
              <input
                className={styles.input}
                placeholder="주소 입력"
                value={form.address}
                onChange={(e) => setField("address")(e.target.value)}
              />
              <button
                type="button"
                className={styles.searchBtn}
                onClick={handleAddressSearch}
              >
                주소 검색
              </button>
            </div>
          </Field>

          <Field label="담당자 연락처 입력">
            <input
              className={styles.input}
              placeholder="담당자 연락처 입력"
              value={form.contact}
              onChange={(e) => setField("contact")(e.target.value)}
            />
          </Field>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.primary} type="submit" disabled={loading}>
            {loading ? "가입 중..." : "회원가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}