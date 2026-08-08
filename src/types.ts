export type MaterialCategory = 
  | 'Mica' 
  | 'Alu' 
  | 'Fomex' 
  | 'Decal' 
  | 'MDF / Gỗ' 
  | 'PVC / Poly' 
  | 'Canvas / Hiflex' 
  | 'Khác';

export type MaterialGroup = 'Tấm phẳng' | 'Cuộn' | 'Thanh / Cây' | 'Khung';

export type MaterialCondition = 
  | 'Mới' 
  | 'Đã cắt 1 lần' 
  | 'Đã cắt nhiều lần' 
  | 'Méo góc' 
  | 'Trầy nhẹ' 
  | 'Chỉ dùng chi tiết nhỏ';

export type MaterialStatus = 'available' | 'used_up' | 'liquidated';

export interface MaterialItem {
  id: string;
  code: string; // E.g. MK001, AL002, DE003
  name: string; // E.g. Mica Đỏ 3mm
  category: MaterialCategory;
  group: MaterialGroup;
  supplier: string; // E.g. Mica Chochen, Alucobest
  unit: string; // Tấm, m², m, Cuộn
  thickness: string; // 2mm, 3mm, 5mm...
  originalSpec: string; // 1220x2440mm
  color: string; // Đỏ, Xanh, Đen, Trắng, Vàng...
  lengthMm: number; // Dài (mm)
  widthMm: number; // Rộng (mm)
  areaM2: number; // Tự động tính = (Dài * Rộng) / 1,000,000
  lengthM: number; // Dài (m) = Dài mm / 1000
  quantity: number; // Số lượng tồn
  unitPriceEstimate: number; // Đơn giá ước tính VNĐ/m² hoặc VNĐ/đơn vị
  condition: MaterialCondition;
  location: string; // Kệ A1, Kệ A2, Giá B3, Kho tầng 2...
  importDate: string; // YYYY-MM-DD
  createdDate: string; // YYYY-MM-DD
  lastUsedDate?: string; // YYYY-MM-DD
  sourceProject: string; // Công trình nguồn
  clientName: string; // Khách hàng
  inboundStaff: string; // Người nhập
  imageUrl: string;
  images: string[];
  qrCodeUrl?: string;
  notes: string;
  status: MaterialStatus;
}

export type TransactionType = 'inbound' | 'outbound' | 'location_update' | 'liquidate';

export interface InventoryTransaction {
  id: string;
  itemCode: string;
  itemName: string;
  type: TransactionType;
  quantity: number;
  areaM2: number;
  staffName: string;
  role: string;
  projectName: string;
  clientName: string;
  timestamp: string; // YYYY-MM-DD HH:mm:ss
  notes: string;
  location?: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  client: string;
  startDate: string;
  status: 'active' | 'completed';
  surplusCount: number;
  totalSavedAmount: number;
}

export type UserRole = 'admin' | 'keeper' | 'staff';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatarUrl: string;
}

export type AlertType = 'over_6_months' | 'tiny_size' | 'overstock' | 'low_new_stock' | 'project_match';

export interface WarehouseAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: 'warning' | 'danger' | 'info';
  itemId?: string;
  itemCode?: string;
  createdAt: string;
}

export interface ReuseMetrics {
  reusedPiecesMonth: number; // e.g. 32 tấm
  savedAreaM2: number; // e.g. 18.6 m²
  savedMoneyVND: number; // e.g. 12,450,000 đ
  reuseRatePercent: number; // e.g. 76%
  targetRatePercent: number; // e.g. 80%
  topReusedCategory: string; // E.g. Mica Đỏ / Alu
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  color: string;
  thickness: string;
  location: string;
  condition: string;
  minAreaM2?: number;
  maxAreaM2?: number;
  importedThisMonthOnly: boolean;
  unusedOnly: boolean;
  project: string;
  supplier: string;
}
