import styles from "./InventoryRequestModal.module.css";
import type { InventoryRequestRow } from "./types";
type Props = {
    open: boolean;
    onClose: () => void;
    bookTitle: string;
    initialStock: number;
    remainStock: number;
    rows: InventoryRequestRow[];
};

export default function InventoryRequestModal({
    open,
    onClose,
    bookTitle,
    initialStock,
    remainStock,
    rows,
}: Props) {
    if (!open) return null;

    const totalRequested = rows.reduce((sum, r) => sum + r.count, 0);

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
            >
                <header className={styles.header}>
                    <h3 className={styles.title}>{bookTitle} 재고 신청 내역</h3>
                    <button className={styles.close} onClick={onClose} aria-label="닫기">
                        ×
                    </button>
                </header>

                <div className={styles.stockRow}>
                    <span>
                        초기 재고량 : <strong>{initialStock}</strong> 권
                    </span>
                    <span>
                        남은 재고량 : <strong>{remainStock}</strong> 권
                    </span>
                </div>

                {/* <div className={styles.stockSub}>
                    총 신청 수량: <strong>{totalRequested}</strong> 권
                </div> */}

                <hr className={styles.divider} />

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>수급요청한 기관명</th>
                                <th>요청 건수</th>
                                <th>날짜</th>
                                <th>전화번호</th>
                                <th>담당자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td className={styles.empty} colSpan={5}>
                                        아직 이 도서를 신청한 기관이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.orgName}</td>
                                        <td>{r.count}</td>
                                        <td>{r.date}</td>
                                        <td>{r.phone}</td>
                                        <td>{r.manager}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}