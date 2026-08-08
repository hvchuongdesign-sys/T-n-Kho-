import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Calendar, 
  Maximize2, 
  Package, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  Eye,
  PackageMinus
} from 'lucide-react';
import { MaterialItem, UserRole } from '../types';
import { COLOR_OPTIONS, WAREHOUSE_LOCATIONS } from '../data/initialData';
import { formatVND } from '../utils/storage';

interface SmartSearchProps {
  materials: MaterialItem[];
  onSelectItem: (item: MaterialItem) => void;
  onOpenOutbound: (item: MaterialItem) => void;
  initialQuery?: string;
  userRole: UserRole;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  materials,
  onSelectItem,
  onOpenOutbound,
  initialQuery = '',
  userRole
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [activeQuickFilters, setActiveQuickFilters] = useState<{
    overHalfM2: boolean;
    overOneM2: boolean;
    thisMonth: boolean;
    unusedOnly: boolean;
  }>({
    overHalfM2: false,
    overOneM2: false,
    thisMonth: false,
    unusedOnly: false
  });

  const [selectedColor, setSelectedColor] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedThickness, setSelectedThickness] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Filter materials
  const matchedMaterials = materials.filter(m => {
    if (m.status !== 'available') return false;

    // Search Query matching multiple fields
    if (query.trim()) {
      const q = query.toLowerCase();
      const match = 
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.color.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.thickness.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.sourceProject.toLowerCase().includes(q) ||
        m.supplier.toLowerCase().includes(q) ||
        m.clientName.toLowerCase().includes(q) ||
        m.inboundStaff.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedColor !== 'ALL' && m.color !== selectedColor) return false;
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (selectedThickness !== 'ALL' && m.thickness !== selectedThickness) return false;
    if (selectedLocation !== 'ALL' && m.location !== selectedLocation) return false;

    // Quick Filters
    if (activeQuickFilters.overHalfM2 && m.areaM2 < 0.5) return false;
    if (activeQuickFilters.overOneM2 && m.areaM2 < 1.0) return false;
    if (activeQuickFilters.unusedOnly && m.condition !== 'Mới') return false;

    if (activeQuickFilters.thisMonth) {
      const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
      if (!m.importDate.startsWith(currentMonthStr)) return false;
    }

    return true;
  });

  // Calculate Aggregates for Search Results (as required in prompt section 5)
  const totalSheetsCount = matchedMaterials.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalAreaM2 = matchedMaterials.reduce((acc, curr) => acc + (curr.areaM2 * curr.quantity), 0);

  const importDates = matchedMaterials.map(m => m.importDate).sort();
  const firstImportDate = importDates.length > 0 ? importDates[0] : 'N/A';
  const latestImportDate = importDates.length > 0 ? importDates[importDates.length - 1] : 'N/A';

  const categories = ['ALL', 'Mica', 'Alu', 'Fomex', 'Decal', 'MDF / Gỗ', 'PVC / Poly', 'Canvas / Hiflex', 'Khác'];
  const thicknesses = ['ALL', '2mm', '3mm', '5mm', '8mm', '10mm', '15mm', '20mm'];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Tìm Kiếm Thông Minh & Bộ Lọc Nhanh</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tra cứu đa trường dữ liệu: Tên, màu, độ dày, kích thước, công trình, nhà cung cấp, vị trí kho...
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gõ từ khóa tìm kiếm (Ví dụ: Mica đỏ, Alu đen, Decal xanh lá, MK001, Trà Sữa ABC)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-xs"
          />
        </div>

        {/* Quick Filter Checkbox Pills (Section 6 Requirements) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bộ Lọc Nhanh Tốc Độ</label>
          <div className="flex flex-wrap gap-2 text-xs">
            
            <button
              onClick={() => setActiveQuickFilters(prev => ({ ...prev, overHalfM2: !prev.overHalfM2 }))}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                activeQuickFilters.overHalfM2 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>✓ Còn trên 0.5 m²</span>
            </button>

            <button
              onClick={() => setActiveQuickFilters(prev => ({ ...prev, overOneM2: !prev.overOneM2 }))}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                activeQuickFilters.overOneM2 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>✓ Còn trên 1.0 m²</span>
            </button>

            <button
              onClick={() => setActiveQuickFilters(prev => ({ ...prev, thisMonth: !prev.thisMonth }))}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                activeQuickFilters.thisMonth 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>✓ Nhập trong tháng này</span>
            </button>

            <button
              onClick={() => setActiveQuickFilters(prev => ({ ...prev, unusedOnly: !prev.unusedOnly }))}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                activeQuickFilters.unusedOnly 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>✓ Chưa dùng (Nguyên tấm / Mới)</span>
            </button>

          </div>
        </div>

        {/* Detailed Parameter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Màu Sắc</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Tất cả màu</option>
              {COLOR_OPTIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Loại Vật Tư</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'Tất cả loại' : c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Độ Dày</label>
            <select
              value={selectedThickness}
              onChange={(e) => setSelectedThickness(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              {thicknesses.map(t => <option key={t} value={t}>{t === 'ALL' ? 'Tất cả độ dày' : t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Kho / Kệ Lưu</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Tất cả kho kệ</option>
              {WAREHOUSE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* Smart Search Aggregated Summary Banner (Section 5 Requirement) */}
      {query.trim().length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Kết Quả Tổng Hợp Cho Từ Khóa: "{query}"</span>
            </span>
            <span className="text-xs font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
              {matchedMaterials.length} mã vật tư phù hợp
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Còn Tồn Kho</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">{totalSheetsCount} tấm / cuộn</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Tổng Diện Tích</span>
              <p className="text-lg font-black text-emerald-700 mt-0.5">{totalAreaM2.toFixed(2)} m²</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Nhập Lần Đầu</span>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{firstImportDate}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Nhập Gần Nhất</span>
              <p className="text-sm font-extrabold text-blue-700 mt-1">{latestImportDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Matched Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchedMaterials.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800">Không tìm thấy vật tư nào khớp với tìm kiếm</p>
            <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa hoặc tắt bớt bộ lọc nhanh</p>
          </div>
        ) : (
          matchedMaterials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
              
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-extrabold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {item.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">{item.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium pt-1">
                  <span>Màu: <strong className="text-slate-900">{item.color}</strong></span>
                  <span>•</span>
                  <span>Độ dày: <strong className="text-slate-900">{item.thickness}</strong></span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Kích thước:</span>
                    <span className="font-mono font-bold text-slate-900">{item.lengthMm} × {item.widthMm} mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Diện tích dư:</span>
                    <span className="font-bold text-emerald-700">{item.areaM2} m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vị trí kệ:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Nguồn: {item.sourceProject}</span>
                  <span>Nhập: {item.importDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectItem(item)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Chi Tiết</span>
                </button>
                {userRole !== 'staff' && (
                  <button
                    onClick={() => onOpenOutbound(item)}
                    className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <PackageMinus className="w-3.5 h-3.5" />
                    <span>Xuất Kho</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
