import { useState } from "react";
import styles from "./MyPage.module.css";
import InventoryRequestModal from "@/components/mypage/InventoryRequestModal";
import type { InventoryRequestRow } from "@/components/mypage/types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type InventoryItem = {
  id: string;
  title: string;
  author: string;
  genre: string;
  stock: number;        // 현재 남은 재고
  initialStock: number; // 초기 재고
  cover: string;
};

type RequestItem = {
  id: string;
  title: string;
  author: string;
  genre: string;
  requestCount: number;
  cover: string;
};

/** ===== 마이페이지 메인 리스트 목데이터 ===== */
const myInventoriesMock: InventoryItem[] = [
  {
    id: "1",
    title: "위대한 모험",
    author: "J.R.R. 톨킨",
    genre: "판타지 소설",
    stock: 7,
    initialStock: 20,
    cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
  },
  {
    id: "2",
    title: "위대한 모험",
    author: "J.R.R. 톨킨",
    genre: "판타지 소설",
    stock: 3,
    initialStock: 15,
    cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
  },
  {
    id: "3",
    title: "위대한 모험",
    author: "J.R.R. 톨킨",
    genre: "판타지 소설",
    stock: 10,
    initialStock: 30,
    cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
  },
];

const myRequestsMock: RequestItem[] = [
  {
    id: "a",
    title: "위대한 모험",
    author: "J.R.R. 톨킨",
    genre: "판타지 소설",
    requestCount: 7,
    cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
  },
  {
    id: "b",
    title: "위대한 모험",
    author: "J.R.R. 톨킨",
    genre: "판타지 소설",
    requestCount: 3,
    cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
  },
  {
    id: "c",
    title: "위대한 모험",
    author: "J.R.R. 톨킨",
    genre: "판타지 소설",
    requestCount: 1,
    cover: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
  },
];

/** ===== 재고별 신청 목록 목데이터 (모달용) ===== */
const inventoryRequestMockMap: Record<string, InventoryRequestRow[]> = {
  "1": [
    {
      id: "r1",
      orgName: "서울 어린이도서관",
      count: 5,
      date: "2025-11-10",
      phone: "02-123-4567",
      manager: "김담당",
    },
    {
      id: "r2",
      orgName: "행복지역아동센터",
      count: 3,
      date: "2025-11-12",
      phone: "010-2222-3333",
      manager: "이선생",
    },
  ],
  "2": [
    {
      id: "r3",
      orgName: "꿈나무 작은도서관",
      count: 4,
      date: "2025-11-08",
      phone: "031-555-9999",
      manager: "박책임",
    },
  ],
  "3": [],
};

export default function MyPage() {
  const name = "홍길동";
  const subtitle = "책 애호가 & 수집가";

  // 마이페이지 메인 리스트 (실제 API 연동 시 이 부분을 fetch로 교체)
  const [inventories, setInventories] =
    useState<InventoryItem[]>(myInventoriesMock);
  const [requests] = useState<RequestItem[]>(myRequestsMock);

  // 모달 관련 state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryItem | null>(null);
  const [inventoryRequests, setInventoryRequests] = useState<
    InventoryRequestRow[]
  >([]);

  /** ✅ 카드 클릭 시 모달 열기 + (API 가정) 신청 목록 불러오기 */
  const openInventoryModal = async (item: InventoryItem) => {
    setSelectedInventory(item);
    setModalOpen(true);

    try {
      // 실제 API가 준비되면 이 부분 사용
      // const res = await fetch(
      //   `${API_BASE}/bookflow/api/inventory/${item.id}/requests/`,
      //   { credentials: "include" }
      // );
      // if (!res.ok) throw new Error();
      // const data = await res.json();
      // setInventoryRequests(data.requests);

      // 아직은 목데이터 사용
      setInventoryRequests(inventoryRequestMockMap[item.id] ?? []);
    } catch (e) {
      console.error(e);
      // 실패 시에도 최소 목데이터는 보여주기
      setInventoryRequests(inventoryRequestMockMap[item.id] ?? []);
    }
  };

  /** 재고 중지 버튼 (예시) */
  const handlePauseInventory = (id: string) => {
    // TODO: 실제 중지 API 연동
    setInventories((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className={styles.page}>
      {/* 프로필 섹션 */}
      <section className={styles.profile}>
        <div className={styles.avatarWrap}>
          <img
            className={styles.avatar}
            src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
            alt={`${name} 프로필`}
          />
        </div>
        <div className={styles.profileText}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </section>

      {/* 재고 / 신청 관리 패널 */}
      <section className={styles.boards}>
        {/* 왼쪽: 나의 재고 관리 */}
        <div className={`${styles.board} ${styles.leftBoard}`}>
          <h2 className={styles.boardTitle}>나의 재고 관리</h2>

          <div className={styles.list}>
            {inventories.map((book) => (
              <article
                key={book.id}
                className={styles.item}
                onClick={() => openInventoryModal(book)}
              >
                <div className={styles.thumb}>
                  <img src={book.cover} alt={`${book.title} 표지`} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.itemTitle}>{book.title}</h3>
                  <p className={styles.meta}>저자: {book.author}</p>
                  <p className={styles.meta}>장르: {book.genre}</p>
                </div>
                <div className={styles.rightArea}>
                  <span className={styles.subLabel}>
                    재고량: {book.stock}
                  </span>
                  <button
                    className={styles.secondaryBtn}
                    onClick={(e) => {
                      e.stopPropagation(); // 모달 열리지 않게
                      handlePauseInventory(book.id);
                    }}
                  >
                    중지하기
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 오른쪽: 나의 신청 도서 */}
        <div className={`${styles.board} ${styles.rightBoard}`}>
          <h2 className={styles.boardTitle}>나의 신청 도서</h2>

          <div className={styles.list}>
            {requests.map((book) => (
              <article key={book.id} className={styles.item}>
                <div className={styles.thumb}>
                  <img src={book.cover} alt={`${book.title} 표지`} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.itemTitleAccent}>{book.title}</h3>
                  <p className={styles.meta}>저자: {book.author}</p>
                  <p className={styles.meta}>장르: {book.genre}</p>
                </div>
                <div className={styles.rightArea}>
                  <span className={styles.requestLabel}>
                    신청 갯수: {book.requestCount}
                  </span>
                  <button className={styles.primaryBtn}>취소하기</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ 재고 신청 내역 모달 */}
      {selectedInventory && (
        <InventoryRequestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          bookTitle={selectedInventory.title}
          initialStock={selectedInventory.initialStock}
          remainStock={selectedInventory.stock}
          rows={inventoryRequests}
        />
      )}
    </div>
  );
}