import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "@/components/common/Stepper";
import Modal from "@/components/common/Modal";
import styles from "./InventoryNew.module.css";

type Form = {
  title: string;
  author: string;
  category: string;
  age: "kid" | "teen" | "adult" | "";
  condition: "new" | "good" | "bad" | "";
};

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];

export default function InventoryNew() {
  const nav = useNavigate();
  const [step, setStep] = useState(0); // 0~4
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>({
    title: "",
    author: "",
    category: "",
    age: "",
    condition: "",
  });

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // ⛔️ Enter로 조기 제출 방지 (마지막 단계 전에는)
  const preventEarlySubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && step < 4) {
      e.preventDefault();
      // next(); // Enter로 다음 단계로 보내고 싶으면 주석 해제
    }
  };

  // 입력 핸들러
  const onChange =
    (key: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  // ✅ 마지막 단계에서만 동작
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // 마지막 단계가 아니면 제출 무시
    if (step !== 4) return;

    // (선택) 최소 유효성 체크
    if (!form.title || !form.author || !form.category || !form.age || !form.condition) {
      // 여기에 토스트/에러 표시 가능
      return;
    }

    // TODO: API 호출 후 성공 시에만 모달
    // await api.createInventory(form);
    setOpen(true);
  };

  return (
    <div className={styles.page}>
      <Stepper steps={STEPS} active={step} />

      {/* ✅ form onSubmit 은 마지막 단계에서만 유효 */}
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

        {/* Step 3: 카테고리 */}
        {step === 2 && (
          <Field label="도서 카테고리" hint="도서 카테고리 입력">
            <input
              className={styles.input}
              placeholder="예) 소설, 에세이, 자기계발…"
              value={form.category}
              onChange={onChange("category")}
              onKeyDown={preventEarlySubmit}
            />
          </Field>
        )}

        {/* Step 4: 연령대 */}
        {step === 3 && (
          <Field label="도서 연령대">
            <div className={styles.radioRow}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="age"
                  value="kid"
                  checked={form.age === "kid"}
                  onChange={onChange("age")}
                />
                <span>아동</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="age"
                  value="teen"
                  checked={form.age === "teen"}
                  onChange={onChange("age")}
                />
                <span>청소년</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="age"
                  value="adult"
                  checked={form.age === "adult"}
                  onChange={onChange("age")}
                />
                <span>성인</span>
              </label>
            </div>
          </Field>
        )}

        {/* Step 5: 상태 */}
        {step === 4 && (
          <Field label="도서 상태">
            <div className={styles.radioRow}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="condition"
                  value="new"
                  checked={form.condition === "new"}
                  onChange={onChange("condition")}
                />
                <span>새 책</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="condition"
                  value="good"
                  checked={form.condition === "good"}
                  onChange={onChange("condition")}
                />
                <span>중고</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="condition"
                  value="bad"
                  checked={form.condition === "bad"}
                  onChange={onChange("condition")}
                />
                <span>손상</span>
              </label>
            </div>
          </Field>
        )}

        {/* 하단 액션 */}
        <div className={styles.footer}>
          <button
            type="button"               // ✅ 제출 방지
            className={styles.ghost}
            onClick={prev}
            disabled={step === 0}
          >
            이전 단계
          </button>

          {step < 4 ? (
            <button
              type="button"             // ✅ 제출 방지
              className={styles.primary}
              onClick={next}
            >
              다음 단계
            </button>
          ) : (
            <button className={styles.primary} type="submit">
              완료하기
            </button>
          )}
        </div>
      </form>

      {/* 완료 모달 (마지막 submit 성공 시에만) */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={styles.modalBody}>
          <strong>
            등록이 완료되었습니다!<br />마이페이지로 이동하시겠습니까?
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

/* 라벨/힌트 래퍼 */
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