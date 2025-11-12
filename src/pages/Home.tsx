import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card";
import styles from "./Home.module.css";
import { Book, Sparkles, LineChart } from "lucide-react";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className={styles.home}>
      <div className={styles.cardContainer}>
        <Card
          align="left"
          icon={<Book size={120} strokeWidth={2.5} />}
          title="재고 도서 등록하기"
          description="출판사, 업체 여러분들의 재고 도서를 등록해 주세요!"
          onClick={() => nav("/inventory/new")}
        />
        <Card
          align="center"
          icon={<Sparkles size={120} strokeWidth={2.2} />}
          title="AI 추천 도서 받기"
          description="AI가 수급 받을 도서를 추천해 줍니다!"
          onClick={() => nav("/recommendations")}
        />
        <Card
          align="right"
          icon={<LineChart size={120} strokeWidth={2.2} />}
          title="나의 현황"
          description="내가 등록한 재고 도서,내가 신청한 도서의 매칭 현황을 확인합니다!"
          onClick={() => nav("/mypage")}
        />
      </div>
    </div>
  );
}