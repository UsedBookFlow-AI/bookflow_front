import styles from "./Card.module.css";

type Align = "left" | "center" | "right";

export default function Card({
  icon,
  title,
  description,
  onClick,
  align = "center",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  align?: Align;
}) {
  return (
    <button
      type="button"
      className={`${styles.card} ${styles[align]}`}
      onClick={onClick}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.spacer} />
      <p className={styles.desc}>{description}</p>
      <h3 className={styles.title}>{title}</h3>
    </button>
  );
}