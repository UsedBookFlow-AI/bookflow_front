import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookCard from "@/components/books/BookCard";
import type { Book } from "@/components/books/types";
import styles from "./RecommendationResult.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import  mockBooks  from "@/mock/books";

type ResultState = { query: string; data: Book[] };

export default function RecommendationResult() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: ResultState };

  // 새로고침 등으로 state가 없으면 입력 화면으로 회수
  useEffect(() => {
    if (!state?.data) nav("/recommendations", { replace: true });
  }, [state, nav]);

  if (!state?.data) return null;

  const data = state?.data || mockBooks; 

  // 좌우 스크롤
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.8) * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  // 신청하기 클릭
  const onApply = async (book: Book) => {
    // TODO: 신청 API 연동 (예: await api.applyBook(book.id))
    alert(`'${book.title}' 신청 API 호출! (id=${book.id})`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          AI 추천<br />재고 도서 리스트
        </h2>

        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={() => scrollBy("prev")} aria-label="이전">
            <ChevronLeft size={20} />
          </button>
          <button className={styles.arrow} onClick={() => scrollBy("next")} aria-label="다음">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 검색/요청 문장 보여주고 싶으면 여기에 표시 */}
      {/* <p className={styles.query}>요청: {query}</p> */}
      
      {/*<BookCard key={b.id} book={b} onApply={onApply} /> */}

      <div className={styles.scroller} ref={scrollerRef}>
        {data.map((b) => (
            <BookCard key={b.id} book={b} onApply={onApply} />
        ))}
      </div>
    </div>
  );
}