const STORAGE_KEY = 'medtech-catalogue-v1';
const seed = [
  { id: 'm-101', name: 'Vitamin C 500 mg', category: 'Supplements', description: 'Fictional sample listing for the catalogue demo.', price: 99, prescriptionRequired: false },
  { id: 'm-102', name: 'Daily Wellness Pack', category: 'Wellness', description: 'A sample product card with a longer description to show the responsive layout.', price: 249, prescriptionRequired: false },
  { id: 'm-103', name: 'Allergy Relief 10 mg', category: 'Allergy', description: 'Illustrative catalogue data only. Always follow qualified medical guidance.', price: 58.5, prescriptionRequired: true },
  { id: 'm-104', name: 'First Aid Essentials', category: 'First aid', description: 'A fictional example of a general first aid category item.', price: 315, prescriptionRequired: false },
  { id: 'm-105', name: 'Hydration Salts', category: 'Wellness', description: 'Sample entry used to demonstrate search and category filters.', price: 42, prescriptionRequired: false },
  { id: 'm-106', name: 'Skin Care Cream', category: 'Personal care', description: 'Fictional item. No medical claims are made by this demo.', price: 180, prescriptionRequired: false },
];

const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
export const isDemo = !apiBase;

function readDemo() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : seed;
  } catch {
    return seed;
  }
}

function writeDemo(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
}

async function request(path, options) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

export const catalogue = {
  list: (search = '') => isDemo
    ? Promise.resolve(readDemo().filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())))
    : request(`/medicines${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: async (item) => {
    if (!isDemo) return request('/medicines', { method: 'POST', body: JSON.stringify(item) });
    const current = readDemo();
    const created = { ...item, id: `demo-${Date.now()}` };
    writeDemo([created, ...current]);
    return created;
  },
  remove: async (id) => {
    if (!isDemo) return request(`/medicines/${id}`, { method: 'DELETE' });
    writeDemo(readDemo().filter((item) => String(item.id) !== String(id)));
  },
  reset: () => writeDemo(seed),
};

