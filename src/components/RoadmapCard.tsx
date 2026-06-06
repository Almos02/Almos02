import type { RoadmapItem } from '../types'
import styles from './RoadmapCard.module.css'

const PRIORITY_LABEL = { low: 'Низкий', medium: 'Средний', high: 'Высокий' }

interface Props {
  item: RoadmapItem
  onEdit: (item: RoadmapItem) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: RoadmapItem['status']) => void
}

export function RoadmapCard({ item, onEdit, onDelete, onStatusChange }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })

  return (
    <div className={`${styles.card} ${styles[item.priority]}`}>
      <div className={styles.topRow}>
        <span className={`${styles.priority} ${styles[`p_${item.priority}`]}`}>
          {PRIORITY_LABEL[item.priority]}
        </span>
        <div className={styles.actions}>
          <button onClick={() => onEdit(item)} title="Редактировать">✏️</button>
          <button onClick={() => onDelete(item.id)} title="Удалить">🗑️</button>
        </div>
      </div>
      <h3 className={styles.title}>{item.title}</h3>
      {item.description && <p className={styles.description}>{item.description}</p>}
      {(item.startDate || item.endDate) && (
        <div className={styles.dates}>
          📅 {item.startDate ? formatDate(item.startDate) : '?'}
          {item.endDate ? ` → ${formatDate(item.endDate)}` : ''}
        </div>
      )}
      <div className={styles.statusRow}>
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value as RoadmapItem['status'])}
          className={`${styles.statusSelect} ${styles[`s_${item.status}`]}`}
        >
          <option value="planned">Запланировано</option>
          <option value="in-progress">В процессе</option>
          <option value="done">Выполнено</option>
        </select>
      </div>
    </div>
  )
}
