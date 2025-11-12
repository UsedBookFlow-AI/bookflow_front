import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Recommendation.module.css";
import { Bot, MapPin, User, SendHorizontal, PenLine } from "lucide-react";
import type { Book } from "@/components/books/types";    

type Msg = { id: string; role: "bot" | "user" | "hint"; text: string };

export default function Recommendations() {
  const nav = useNavigate();
  const [visible, setVisible] = useState(0);            // 몇 개의 안내 말풍선을 보여줄지
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false); 

  // 안내 문구 3개
  const intro = useMemo<Msg[]>(
    () => [
      { id: "i1", role: "bot",  text: "안녕하세요! 재고 도서 매칭 AI 입니다!" },
      { id: "i2", role: "bot",  text: "수급 받고자 하는 도서에 대해 알려주세요!" },
      {
        id: "i3",
        role: "hint",
        text:
          "예시) 저희 도서관은 어린이 이용자가 많으며, 6~5세가 읽을만한 도서를 찾고 있습니다.",
      },
    ],
    []
  );

  // 말풍선 순차 등장
  useEffect(() => {
    let i = 0;
    const show = () => {
      i++;
      setVisible(i);
      if (i < intro.length) setTimeout(show, i === 1 ? 800 : 600); // 첫 문장 살짝 여유
      else setTimeout(() => inputRef.current?.focus(), 200);
    };
    show();
    return () => { i = intro.length; };
  }, [intro]);

  // 스크롤 항상 최하단
  useEffect(() => {
    if (!wrapRef.current) return;
    wrapRef.current.scrollTo({ top: wrapRef.current.scrollHeight, behavior: "smooth" });
  }, [visible, msgs]);

  const canSend = input.trim().length > 0;

  const onSend = async () => {
    if (!canSend) return;
    const text = input.trim();
  
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
  
    try {
      // TODO: 실제 API 호출
      // const data = await api.fetchRecommendations(text);
  
      // 데모용 (Book[] 리턴)
      const data: Book[] = await mockFetch(text);
  
      // 결과와 쿼리를 state로 전달
      nav("/recommendations/result", {
        state: { query: text, data },
        replace: false, // 뒤로가기 허용
      });
    } catch (e) {
      console.error(e);
      alert("추천 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  


  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  async function mockFetch(q: string): Promise<Book[]> {
    await new Promise((r) => setTimeout(r, 900));
    return [
      {
        id: "b1",
        title: "해양 신비",
        author: "팀 블루 에디션",
        genre: "자연 과학",
        publisher: "바다출판사",
        location: "A-12",
        stock: 7,
        cover:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      // ...원하는 만큼 추가
      {
        id: "b2",
        title: "낚시 이야기",
        author: "낚시칸",
        genre: "취미",
        publisher: "리버프레스",
        location: "B-03",
        stock: 12,
        cover:
          "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: "b3",
        title: "바다 생활 연대기",
        author: "오션 프레스",
        genre: "다큐",
        publisher: "오션 프레스",
        location: "C-21",
        stock: 8,
        cover:
          "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: "b4",
        title: "낚시 모험",
        author: "폭 라인 옵서버",
        genre: "에세이",
        publisher: "폭라인",
        location: "D-08",
        stock: 10,
        cover:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        id: "b5",
        title: "해양 신비",
        author: "팀 블루 에디션",
        genre: "자연 과학",
        publisher: "블루",
        location: "E-17",
        stock: 7,
        cover:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
    ];
  }

  

  return (
    <div className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.stream} ref={wrapRef}>
          {/* 왼쪽 안내 3연타 */}
          {intro.slice(0, visible).map((m) => (
            <Bubble key={m.id} role={m.role} text={m.text} />
          ))}

          {/* 사용자가 입력 후 생기는 우측 말풍선 */}
          {msgs.map((m) => (
            <Bubble key={m.id} role={m.role} text={m.text} />
          ))}
        </div>

        {/* 입력 영역 */}
        <div className={styles.inputRow}>
          <div className={styles.inputBox}>
            <PenLine size={18} className={styles.inputIcon} />
            <textarea
              ref={inputRef}
              className={styles.textarea}
              placeholder="제가 원하는 도서는…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
            />
          </div>
          <button
            className={styles.sendBtn}
            onClick={onSend}
            disabled={!canSend || visible < 3}
            title="보내기"
          >
            <SendHorizontal size={18} />
            <span>보내기</span>
          </button>
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  );
}

function Bubble({ role, text }: { role: "bot" | "user" | "hint"; text: string }) {
  const isLeft = role !== "user";
  return (
    <div className={`${styles.row} ${isLeft ? styles.left : styles.right}`}>
      <div className={styles.avatar}>
        {role === "bot" && <Bot size={22} />}
        {role === "hint" && <MapPin size={18} />}
        {role === "user" && <User size={18} />}
      </div>
      <div className={`${styles.bubble} ${styles[role]}`}>{text}</div>
    </div>
  );
}

function LoadingOverlay() {
    return (
      <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="추천 진행 중">
        <div className={styles.overlayCard}>
          <div className={styles.spinner} aria-hidden="true" />
          <strong className={styles.overlayTitle}>매칭 AI가 도서를 추천 중입니다!</strong>
          <p className={styles.overlaySub}>잠시만 기다려 주세요…</p>
        </div>
      </div>
    );
  }