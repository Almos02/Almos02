import type { Roadmap } from '../types'
import styles from './RoadmapSelector.module.css'

interface Props {
  roadmaps: Roadmap[]
  activeId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
  onDelete: (id: string) => void
}

export function RoadmapSelector({ roadmaps, activeId, onSelect, onCreate, onDelete }: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>🗺️ Зеси</span>
        <button className={styles.newBtn} onClick={onCreate}>+ Новая</button>
      </div>
      <div className={styles.list}>
        {roadmaps.length === 0 && (
          <p className={styles.hint}>Создайте вашу первую дорожную карту</p>
        )}
        {roadmaps.map((rm) => (
          <div
            key={rm.id}
            className={`${styles.item} ${rm.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(rm.id)}
          >
            <span className={styles.itemName}>{rm.name}</span>
            <button
              className={styles.deleteBtn}
              onClick={(e) => { e.stopPropagation(); onDelete(rm.id) }}
              title="Удалить дорожную карту"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
