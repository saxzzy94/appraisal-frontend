const STORAGE_KEY = 'property-analysis-results';

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function getAllAnalyses() {
  return getFromStorage<Record<string, any>>(STORAGE_KEY) || {};
}

export function saveAnalysis(id: string, data: any) {
  const analyses = getAllAnalyses();
  analyses[id] = {
    ...data,
    savedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEY, analyses);
}

export function getAnalysis(id: string) {
  const analyses = getAllAnalyses();
  return analyses[id] || null;
}

export function deleteAnalysis(id: string) {
  const analyses = getAllAnalyses();
  delete analyses[id];
  saveToStorage(STORAGE_KEY, analyses);
}
