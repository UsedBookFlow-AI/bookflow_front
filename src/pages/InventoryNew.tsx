import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "@/components/common/Stepper";
import Modal from "@/components/common/Modal";
import styles from "./InventoryNew.module.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type Age = "아동" | "청소년" | "성인" | "";
type Condition = "새 책" | "양호" | "손상" | "";

// 카테고리 옵션
const CATEGORIES = [
  "문학",
  "에세이",
  "인문",
  "사회·정치·법",
  "경제·경영",
  "자기계발",
  "과학",
  "예술/대중문화",
  "역사/문화",
  "건강·의학",
  "아동·유아",
  "만화·그래픽노블",
] as const;
type Category = (typeof CATEGORIES)[number] | "";

type Form = {
  title: string;
  author: string;
  category: Category;
  genre: string;
  age: Age;
  condition: Condition;
  stock: string;
};

const STEPS = [
  "도서명",
  "저자",
  "카테고리",
  "장르",
  "연령대",
  "상태",
  "재고 수량",
];

export default function InventoryNew() {
  const nav = useNavigate();
  const [step, setStep] = useState(0); // 0 ~ 6
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Form>({
    title: "",
    author: "",
    category: "",
    genre: "",
    age: "",
    condition: "",
    stock: "",
  });

  const next = () => setStep((s) => Math.min(s + 1, 6));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // ⛔️ Enter 로 조기 제출 방지 (마지막 단계 전까지만)
  const preventEarlySubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && step < 6) {
      e.preventDefault();
    }
  };
  // 기존
  // const onChange =
  //   (key: keyof Form) =>
  //   (e: React.ChangeEvent<HTMLInputElement>) => {

  // 수정 ✅
  const onChange =
    (key: keyof Form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
      };

  const onSelectCategory = (cat: Category) => {
    setForm((f) => ({ ...f, category: cat }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (step !== 6) return; // 마지막 step 번호에 맞게 조정

    // 최소 유효성 검사
    if (
      !form.title ||
      !form.author ||
      !form.category ||
      !form.genre ||
      !form.age ||
      !form.condition ||
      !form.stock
    ) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    // 로그인 세션에서 user_id 가져오기
    const raw = localStorage.getItem("ubf_auth");
    if (!raw) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    const session = JSON.parse(raw);
    const userId = session.userId as string | undefined;
    if (!userId) {
      alert("로그인 정보에 user_id가 없습니다.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("user_id", userId);
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("category", form.category);
      fd.append("genre", form.genre);
      fd.append("stock", form.stock);          // ✅ 숫자도 문자열로
      fd.append("condition", form.condition);  // "new" | "good" | "bad"
      // description 은 선택 사항이라 비워도 됨
      // fd.append("description", "");

      // 디버깅용: 실제로 어떤 값이 들어가는지 확인
      for (const [k, v] of fd.entries()) {
        console.log(k, "=>", v);
      }

      const res = await fetch(`${API_BASE}/api/bookflow/store_book/`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("store_book error:", text);
        throw new Error("재고 등록에 실패했습니다.");
      }

      // 성공 시 모달 열기
      setOpen(true);
    } catch (err) {
      console.error(err);
      alert("재고 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.page}>
      <Stepper steps={STEPS} active={step} />

      <form className={styles.form} onSubmit={onSubmit}>
        {/* Step 1: 도서명 */}
        {step === 0 && (
          <Field label="도서" hint="도서명 입력">
            <input
              className={styles.input}
              placeholder="도서명 입력"
              value={form.title}
              onChange={onChange("title")}
              onKeyDown={preventEarlySubmit}
            />
          </Field>
        )}

        {/* Step 2: 저자 */}
        {step === 1 && (
          <Field label="저자" hint="저자명 입력">
            <input
              className={styles.input}
              placeholder="저자명 입력"
              value={form.author}
              onChange={onChange("author")}
              onKeyDown={preventEarlySubmit}
            />
          </Field>
        )}

        {/* Step 3: 카테고리 (드롭다운) */}
        {step === 2 && (
          <Field label="도서 카테고리" hint="해당되는 카테고리를 선택해 주세요.">
            <select
              className={styles.select}
              value={form.category}
              onChange={onChange("category")}
            >
              <option value="">카테고리 선택</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        )}

        {/* Step 4: 장르 */}
        {step === 3 && (
          <Field label="도서 장르" hint="예) 판타지, 로맨스, 추리 등">
            <input
              className={styles.input}
              placeholder="장르 입력"
              value={form.genre}
              onChange={onChange("genre")}
              onKeyDown={preventEarlySubmit}
            />
          </Field>
        )}

        {/* Step 5: 연령대 */}
        {step === 4 && (
          <Field label="도서 연령대">
            <div className={styles.radioRow}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="age"
                  value="아동"
                  checked={form.age === "아동"}
                  onChange={onChange("age")}
                />
                <span>아동</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="age"
                  value="청소년"
                  checked={form.age === "청소년"}
                  onChange={onChange("age")}
                />
                <span>청소년</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="age"
                  value="성인"
                  checked={form.age === "성인"}
                  onChange={onChange("age")}
                />
                <span>성인</span>
              </label>
            </div>
          </Field>
        )}

        {/* Step 6: 상태 */}
        {step === 5 && (
          <Field label="도서 상태">
            <div className={styles.radioRow}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="condition"
                  value="새 책"
                  checked={form.condition === "새 책"}
                  onChange={onChange("condition")}
                />
                <span>새 책</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="condition"
                  value="양호"
                  checked={form.condition === "양호"}
                  onChange={onChange("condition")}
                />
                <span>양호</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="condition"
                  value="손상"
                  checked={form.condition === "손상"}
                  onChange={onChange("condition")}
                />
                <span>손상</span>
              </label>
            </div>
          </Field>
        )}

        {/* Step 7: 재고 수량 */}
        {step === 6 && (
          <Field label="재고 수량" hint="보유 중인 재고 수량을 입력해 주세요.">
            <input
              className={styles.input}
              type="number"
              min={0}
              placeholder="예) 10"
              value={form.stock}
              onChange={onChange("stock")}
            />
          </Field>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {/* 하단 버튼 */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.ghost}
            onClick={prev}
            disabled={step === 0}
          >
            이전 단계
          </button>

          {step < 6 ? (
            <button
              type="button"
              className={styles.primary}
              onClick={next}
            >
              다음 단계
            </button>
          ) : (
            <button className={styles.primary} type="submit" disabled={loading}>
              {loading ? "등록 중..." : "완료하기"}
            </button>
          )}
        </div>
      </form>

      {/* 완료 모달 */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={styles.modalBody}>
          <strong>
            등록이 완료되었습니다!
            <br />
            마이페이지로 이동하시겠습니까?
          </strong>
          <div className={styles.modalBtns}>
            <button className={styles.primary} onClick={() => nav("/mypage")}>
              확인 하기
            </button>
            <button className={styles.ghost} onClick={() => setOpen(false)}>
              취소 하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* 공통 필드 래퍼 */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.field}>
      <label className={styles.label}>{label}</label>
      {hint && <div className={styles.hint}>{hint}</div>}
      <div className={styles.box}>{children}</div>
    </section>
  );
}