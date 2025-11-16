import { useState } from "react";
import styles from "./BookCard.module.css";
import type { Book } from "./types";

export default function BookCard({
  book,
  onApply,
}: {
  book: Book;
  onApply: (b: Book) => void;
}) {
  const [flip, setFlip] = useState(false);
  console.log("BookCard book >>>", book);

  return (
    <div className={styles.item}>
      <div
        className={`${styles.card} ${flip ? styles.flip : ""}`}
        onClick={() => setFlip(v => !v)}            // ✅ 카드 어디든 클릭 → 토글
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setFlip(v => !v)}
        aria-pressed={flip}
      >
        {/* front */}
        <div className={`${styles.face} ${styles.front}`}>
          <figure className={styles.cover}>
            <img src={book.cover} alt={`${book.title} 표지`} />
          </figure>
          <div className={styles.metaFront}>
            <div className={styles.bookTitle}>{book.title}</div>
            <div className={styles.bookSub}>{book.author}</div>
            <div className={styles.stock}>재고: {book.stock}</div>
          </div>
        </div>

        {/* back */}
        {/* ❌ 여기 있었던 onClick={(e)=>e.stopPropagation()} 제거 */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.backInner}>
            <div className={styles.badge}>{book.title}</div>

            <dl className={styles.desc}>
              <div><dt>저자</dt><dd>{book.author}</dd></div>
              <div><dt>장르</dt><dd>{book.genre}</dd></div>
              <div><dt>출판사</dt><dd>{book.publisher}</dd></div>
              <div><dt>카테고리</dt><dd>{book.category}</dd></div>   {/* ✅ 여기 */}
              <div><dt>재고</dt><dd>{book.stock}권</dd></div>
              <div><dt>추천 이유</dt><dd>{book.reason}</dd></div>
            </dl>

            {/* ✅ 버튼에서만 버블링 중단 → 카드가 뒤집히지 않음 */}
            <button
              className={styles.apply}
              onClick={(e) => {
                e.stopPropagation();
                onApply(book);
              }}
              onKeyDown={(e) => e.stopPropagation()} // 키로 눌러도 뒤집힘 방지(선택)
            >
              신청하기
            </button>

            <p className={styles.hint}>카드를 다시 클릭하면 앞면으로 돌아갑니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}