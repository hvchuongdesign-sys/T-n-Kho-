import QRCode from 'qrcode';
import { MaterialItem, InventoryTransaction, ProjectInfo, WarehouseAlert, ReuseMetrics, UserRole } from '../types';
import { INITIAL_MATERIALS, INITIAL_TRANSACTIONS, INITIAL_PROJECTS, INITIAL_ALERTS, INITIAL_REUSE_METRICS } from '../data/initialData';

const STORAGE_KEYS = {
  MATERIALS: 'ad_warehouse_materials_v1',
  TRANSACTIONS: 'ad_warehouse_transactions_v1',
  PROJECTS: 'ad_warehouse_projects_v1',
  ALERTS: 'ad_warehouse_alerts_v1',
  METRICS: 'ad_warehouse_metrics_v1',
  ROLE: 'ad_warehouse_role_v1',
  CUSTOM_COLORS: 'ad_warehouse_custom_colors_v1'
};

// Initialize Storage with Seed Data if empty
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.METRICS)) {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(INITIAL_REUSE_METRICS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROLE)) {
    localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
  }
}

// Reset Storage to Initial State
export function resetStorage() {
  localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
  localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(INITIAL_REUSE_METRICS));
  localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
}

// --- MATERIALS API ---
export function getMaterials(): MaterialItem[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return data ? JSON.parse(data) : INITIAL_MATERIALS;
  } catch (e) {
    console.error('Failed to parse materials from localStorage', e);
    return INITIAL_MATERIALS;
  }
}

export function saveMaterials(items: MaterialItem[]) {
  localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(items));
}

export function addMaterial(item: MaterialItem): MaterialItem {
  const items = getMaterials();
  items.unshift(item);
  saveMaterials(items);

  // Log Inbound Transaction
  logTransaction({
    id: 'tx-' + Date.now(),
    itemCode: item.code,
    itemName: item.name,
    type: 'inbound',
    quantity: item.quantity,
    areaM2: item.areaM2,
    staffName: item.inboundStaff || 'Thủ kho',
    role: getUserRole() === 'admin' ? 'Quản trị' : getUserRole() === 'keeper' ? 'Thủ kho' : 'Nhân viên',
    projectName: item.sourceProject || 'Dự án lẻ',
    clientName: item.clientName || 'Khách hàng lẻ',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    notes: `Nhập dư vật tư mới. KT: ${item.lengthMm}x${item.widthMm}mm, Màu: ${item.color}`,
    location: item.location
  });

  return item;
}

export function updateMaterial(id: string, updates: Partial<MaterialItem>): MaterialItem | null {
  const items = getMaterials();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...updates };
  saveMaterials(items);
  return items[index];
}

export function deleteMaterial(id: string): boolean {
  const items = getMaterials();
  const filtered = items.filter(i => i.id !== id);
  if (filtered.length !== items.length) {
    saveMaterials(filtered);
    return true;
  }
  return false;
}

export function outboundMaterial(
  id: string,
  exportQty: number,
  staffName: string,
  projectName: string,
  clientName: string,
  notes: string
): { success: boolean; item?: MaterialItem; remainingQty: number } {
  const items = getMaterials();
  const item = items.find(i => i.id === id);
  if (!item) return { success: false, remainingQty: 0 };

  const newQty = Math.max(0, item.quantity - exportQty);
  item.quantity = newQty;
  item.lastUsedDate = new Date().toISOString().substring(0, 10);

  if (newQty === 0) {
    item.status = 'used_up';
  }

  saveMaterials(items);

  // Update Savings Metrics
  const metrics = getMetrics();
  metrics.reusedPiecesMonth += exportQty;
  metrics.savedAreaM2 += Number((item.areaM2 * exportQty).toFixed(2));
  metrics.savedMoneyVND += (item.unitPriceEstimate * item.areaM2 * exportQty);
  saveMetrics(metrics);

  // Log Outbound Transaction
  logTransaction({
    id: 'tx-' + Date.now(),
    itemCode: item.code,
    itemName: item.name,
    type: 'outbound',
    quantity: exportQty,
    areaM2: Number((item.areaM2 * exportQty).toFixed(2)),
    staffName: staffName || 'Nhân viên xuất kho',
    role: getUserRole() === 'admin' ? 'Quản trị' : getUserRole() === 'keeper' ? 'Thủ kho' : 'Nhân viên',
    projectName: projectName || 'Dự án mới',
    clientName: clientName || 'Khách hàng',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    notes: notes || 'Xuất tái sử dụng cho công trình',
    location: item.location
  });

  return { success: true, item, remainingQty: newQty };
}

// --- TRANSACTIONS API ---
export function getTransactions(): InventoryTransaction[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  } catch (e) {
    return INITIAL_TRANSACTIONS;
  }
}

export function logTransaction(tx: InventoryTransaction) {
  const transactions = getTransactions();
  transactions.unshift(tx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// --- PROJECTS API ---
export function getProjects(): ProjectInfo[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : INITIAL_PROJECTS;
  } catch (e) {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: ProjectInfo[]) {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// --- ALERTS API ---
export function getAlerts(): WarehouseAlert[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return data ? JSON.parse(data) : INITIAL_ALERTS;
  } catch (e) {
    return INITIAL_ALERTS;
  }
}

export function dismissAlert(id: string) {
  const alerts = getAlerts().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
}

// --- METRICS API ---
export function getMetrics(): ReuseMetrics {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.METRICS);
    return data ? JSON.parse(data) : INITIAL_REUSE_METRICS;
  } catch (e) {
    return INITIAL_REUSE_METRICS;
  }
}

export function saveMetrics(m: ReuseMetrics) {
  localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(m));
}

// --- USER ROLE ---
export function getUserRole(): UserRole {
  initStorage();
  return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'admin';
}

export function setUserRole(role: UserRole) {
  localStorage.setItem(STORAGE_KEYS.ROLE, role);
}

// --- CUSTOM COLORS ---
export function getCustomColors(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_COLORS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addCustomColor(colorName: string) {
  const colors = getCustomColors();
  if (!colors.includes(colorName)) {
    colors.push(colorName);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_COLORS, JSON.stringify(colors));
  }
}

// --- HELPERS ---
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function calculateAreaM2(lengthMm: number, widthMm: number): number {
  if (!lengthMm || !widthMm) return 0;
  return Number(((lengthMm * widthMm) / 1000000).toFixed(2));
}

export function generateItemCode(category: string): string {
  const prefixMap: Record<string, string> = {
    'Mica': 'MK',
    'Alu': 'AL',
    'Fomex': 'FO',
    'Decal': 'DE',
    'MDF / Gỗ': 'WD',
    'PVC / Poly': 'PVC',
    'Canvas / Hiflex': 'CV',
    'Khác': 'VT'
  };

  const prefix = prefixMap[category] || 'VT';
  const materials = getMaterials();
  const existingCodes = materials
    .map(m => m.code)
    .filter(c => c.startsWith(prefix))
    .map(c => parseInt(c.replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n));

  const maxNum = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
  const nextNum = (maxNum + 1).toString().padStart(3, '0');
  return `${prefix}${nextNum}`;
}

export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 250,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}
