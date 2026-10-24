import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

class MemoryStorage implements Storage {
  private store = new Map<string, string>()
  get length() {
    return this.store.size
  }
  clear() {
    this.store.clear()
  }
  getItem(key: string) {
    return this.store.get(key) ?? null
  }
  key(index: number) {
    return [...this.store.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.store.delete(key)
  }
  setItem(key: string, value: string) {
    this.store.set(key, value)
  }
}

const memory = new MemoryStorage()

Object.defineProperty(window, 'localStorage', {
  value: memory,
})

Object.defineProperty(window, 'sessionStorage', {
  value: new MemoryStorage(),
})

beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})
