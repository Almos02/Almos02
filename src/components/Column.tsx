import type { RoadmapItem, Status } from '../types'
import { RoadmapCard } from './RoadmapCard'
import styles from './Column.module.css'

const COLUMN_META: Record<Status, { label: string; emoji: string; color: string }> = {
  planned:     { label: 'Запланировано', emoji: '📋', color: '#6366f1' },
  'in-progress': { label: 'В процессе',   emoji: '🚀', color: '#f59e0b' },
  done:        { label: 'Выполнено',      emoji: '✅', color: '#10b981' },
}

interface Props {
  status: Status
  items: RoadmapItem[]
  onAdd: (status: Status) => void
  onEdit: (item: RoadmapItem) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
}

export function Column({ status, items, onAdd, onEdit, onDelete, onStatusChange }: Props) {
  const meta = COLUMN_META[status]

  return (
    <div className={styles.column}>
      <div className={styles.header} style={{ borderTopColor: meta.color }}>
        <div className={styles.title}>
          <span>{meta.emoji}</span>
          <span>{meta.label}</span>
          <span className={styles.count}>{items.length}</span>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => onAdd(status)}
          title="Добавить задачу"
          style={{ color: meta.color }}
        >
          + Добавить
        </button>
      </div>
      <div className={styles.items}>
        {items.length === 0 ? (
          <div className={styles.empty}>Нет задач</div>
        ) : (
          items.map((item) => (
            <RoadmapCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  )
}
