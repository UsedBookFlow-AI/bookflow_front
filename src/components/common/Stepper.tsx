import styles from "./Stepper.module.css";

export default function Stepper({
  steps,
  active,
}: {
  steps: string[];
  active: number; // 0-index
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <div
          className={styles.bar}
          style={{ width: `${(active / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className={styles.steps}>
        {steps.map((s, i) => (
          <div key={s} className={`${styles.step} ${i <= active ? styles.on : ""}`}>
            <span className={styles.label}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}