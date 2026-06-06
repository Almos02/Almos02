import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { RoadmapSelector } from './components/RoadmapSelector'
import { Column } from './components/Column'
import { ItemModal } from './components/ItemModal'
import type { Roadmap, RoadmapItem, Status } from './types'
import './App.css'

const STATUSES: Status[] = ['planned', 'in-progress', 'done']

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function App() {
  const [roadmaps, setRoadmaps] = useLocalStorage<Roadmap[]>('zesi-roadmaps', [])
  const [activeId, setActiveId] = useLocalStorage<string | null>('zesi-active', null)
  const [modalStatus, setModalStatus] = useState<Status | null>(null)
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const activeRoadmap = roadmaps.find((r) => r.id === activeId) ?? null

  const createRoadmap = () => {
    const name = prompt('Название дорожной карты:')?.trim()
    if (!name) return
    const newRoadmap: Roadmap = {
      id: generateId(),
      name,
      description: '',
      items: [],
      createdAt: new Date().toISOString(),
    }
    setRoadmaps((prev) => [...prev, newRoadmap])
    setActiveId(newRoadmap.id)
  }

  const deleteRoadmap = (id: string) => {
    if (!confirm('Удалить эту дорожную карту?')) return
    setRoadmaps((prev) => prev.filter((r) => r.id !== id))
    if (activeId === id) setActiveId(roadmaps.find((r) => r.id !== id)?.id ?? null)
  }

  const openAddModal = (status: Status) => {
    setEditingItem(null)
    setModalStatus(status)
    setIsModalOpen(true)
  }

  const openEditModal = (item: RoadmapItem) => {
    setEditingItem(item)
    setModalStatus(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setModalStatus(null)
  }

  const saveItem = (data: Omit<RoadmapItem, 'id' | 'createdAt'>) => {
    if (!activeRoadmap) return

    if (editingItem) {
      setRoadmaps((prev) =>
        prev.map((r) =>
          r.id === activeId
            ? { ...r, items: r.items.map((i) => (i.id === editingItem.id ? { ...i, ...data } : i)) }
            : r
        )
      )
    } else {
      const newItem: RoadmapItem = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...data,
        status: modalStatus ?? data.status,
      }
      setRoadmaps((prev) =>
        prev.map((r) =>
          r.id === activeId ? { ...r, items: [...r.items, newItem] } : r
        )
      )
    }
    closeModal()
  }

  const deleteItem = (id: string) => {
    setRoadmaps((prev) =>
      prev.map((r) =>
        r.id === activeId ? { ...r, items: r.items.filter((i) => i.id !== id) } : r
      )
    )
  }

  const changeStatus = (id: string, status: Status) => {
    setRoadmaps((prev) =>
      prev.map((r) =>
        r.id === activeId
          ? { ...r, items: r.items.map((i) => (i.id === id ? { ...i, status } : i)) }
          : r
      )
    )
  }

  return (
    <div className="app">
      <RoadmapSelector
        roadmaps={roadmaps}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createRoadmap}
        onDelete={deleteRoadmap}
      />

      <main className="main">
        {activeRoadmap ? (
          <>
            <div className="boardHeader">
              <h1>{activeRoadmap.name}</h1>
              <span className="itemCount">{activeRoadmap.items.length} задач</span>
            </div>
            <div className="board">
              {STATUSES.map((status) => (
                <Column
                  key={status}
                  status={status}
                  items={activeRoadmap.items.filter((i) => i.status === status)}
                  onAdd={openAddModal}
                  onEdit={openEditModal}
                  onDelete={deleteItem}
                  onStatusChange={changeStatus}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="empty">
            <div className="emptyIcon">🗺️</div>
            <h2>Добро пожаловать в Зеси</h2>
            <p>Создайте дорожную карту, чтобы начать планирование</p>
            <button className="createBtn" onClick={createRoadmap}>
              + Создать дорожную карту
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <ItemModal
          item={editingItem}
          onSave={saveItem}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
