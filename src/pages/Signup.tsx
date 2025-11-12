import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

type OrgType = "demand" | "supply";

export default function Signup() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    id: "",
    pw: "",
    orgName: "",
    orgType: "demand" as OrgType,
    address: "",
    contact: "",
  });
  const [error, setError] = useState("");

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    const { id, pw, orgName, address, contact } = form;
    if (!id || !pw || !orgName || !address || !contact) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }
    // TODO: 실제 회원가입 API 연동
    // await api.signup(form)
    nav("/login"); // 가입 후 로그인 화면으로 이동(or 원하는 경로)
  };

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleAddressSearch = () => {
    // TODO: 주소 검색 모달/다음 주소 etc.
    alert("주소 검색을 연결해 주세요 :)");
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
              onChange={(e) => set("id")(e.target.value)}
              autoComplete="username"
            />
          </Field>

          <Field label="비밀번호 입력">
            <input
              className={styles.input}
              type="password"
              placeholder="비밀번호 입력"
              value={form.pw}
              onChange={(e) => set("pw")(e.target.value)}
              autoComplete="new-password"
            />
          </Field>

          <Field label="기관명 입력">
            <input
              className={styles.input}
              placeholder="기관명 입력"
              value={form.orgName}
              onChange={(e) => set("orgName")(e.target.value)}
            />
          </Field>

          <Field label="기관 유형 입력">
            <div className={styles.typeRow} role="group" aria-label="기관 유형">
              <button
                type="button"
                aria-pressed={form.orgType === "demand"}
                className={`${styles.typeBtn} ${
                  form.orgType === "demand" ? styles.typeOn : styles.typeOff
                }`}
                onClick={() => set("orgType")("demand")}
              >
                도서 수급 기관
              </button>
              <button
                type="button"
                aria-pressed={form.orgType === "supply"}
                className={`${styles.typeBtn} ${
                  form.orgType === "supply" ? styles.typeOn : styles.typeOff
                }`}
                onClick={() => set("orgType")("supply")}
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
                onChange={(e) => set("address")(e.target.value)}
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
              onChange={(e) => set("contact")(e.target.value)}
            />
          </Field>

          {error && <p className={styles.error}>{error}</p>}
        </form>

        <button className={styles.primary} type="submit">
            회원가입하기
          </button>
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