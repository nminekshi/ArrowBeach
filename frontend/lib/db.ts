import fs from 'fs';
import path from 'path';

// JSON file-based data store — works without MongoDB
// Data files are stored in /frontend/data/db/

const DB_DIR = path.join(process.cwd(), 'data', 'db');

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function getFilePath(collection: string) {
  return path.join(DB_DIR, `${collection}.json`);
}

export function readCollection<T = any>(collection: string): T[] {
  ensureDir();
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeCollection<T = any>(collection: string, data: T[]) {
  ensureDir();
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function findById<T extends { id: string }>(collection: string, id: string): T | undefined {
  const items = readCollection<T>(collection);
  return items.find((item) => item.id === id);
}

export function insertOne<T extends { id?: string }>(collection: string, item: Omit<T, 'id'>) {
  const items = readCollection(collection);
  const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
  items.push(newItem);
  writeCollection(collection, items);
  return newItem;
}

export function updateById(collection: string, id: string, updates: Record<string, any>) {
  const items = readCollection(collection);
  const index = items.findIndex((item: any) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  writeCollection(collection, items);
  return items[index];
}

export function deleteById(collection: string, id: string) {
  const items = readCollection(collection);
  const filtered = items.filter((item: any) => item.id !== id);
  if (filtered.length === items.length) return false;
  writeCollection(collection, filtered);
  return true;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
