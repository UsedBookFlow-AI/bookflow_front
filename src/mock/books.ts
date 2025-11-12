import type { Book } from "@/components/books/types";

const mockBooks: Book[] = [
  {
    id: "1",
    title: "바다 생물 대백과",
    author: "오션 프레스",
    genre: "자연·과학",
    publisher: "푸른바다출판사",
    location: "서울 강남 도서관",
    stock: 8,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    id: "2",
    title: "낚시 이야기",
    author: "박시인",
    genre: "취미·여가",
    publisher: "어부출판사",
    location: "부산 해운대 도서관",
    stock: 12,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    id: "3",
    title: "위대한 모험",
    author: "J.R.R. 톨킨",
    genre: "판타지 소설",
    publisher: "미들어스 출판사",
    location: "리벤델 지점",
    stock: 42,
    cover: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
  },
];

export default mockBooks;