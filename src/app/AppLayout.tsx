// src/app/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Outlet />  {/* ✅ 자식 라우트가 여기 렌더링됨 */}
      </main>
    </div>
  );
}