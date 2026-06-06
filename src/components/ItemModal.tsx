import { useState, useEffect } from 'react'
import type { RoadmapItem, Status } from '../types'
import styles from './ItemModal.module.css'

interface Props {
  item?: RoadmapItem | null
  onSave: (item: Omit<RoadmapItem, 'id' | 'createdAt'>) => void
  onClose: () => void
}

export function ItemModal({ item, onSave, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Status>('planned')
  const [priority, setPriority] = useState<RoadmapItem['priority']>('medium')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setDescription(item.description)
      setStatus(item.status)
      setPriority(item.priority)
      setStartDate(item.startDate ?? '')
      setEndDate(item.endDate ?? '')
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{item ? 'Редактировать задачу' : 'Новая задача'}</h2>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Название *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название задачи..."
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание задачи..."
              rows={3}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Статус</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                <option value="planned">Запланировано</option>
                <option value="in-progress">В процессе</option>
                <option value="done">Выполнено</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Приоритет</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as RoadmapItem['priority'])}>
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Дата начала</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Дата окончания</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Отмена</button>
            <button type="submit" className={styles.save}>Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  )
}
