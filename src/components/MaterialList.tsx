import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  MapPin, 
  QrCode, 
  Eye, 
  PackageMinus, 
  Edit3, 
  Trash2, 
  Sparkles,
  Layers,
  Ruler,
  Clock,
  ChevronDown,
  Check,
  FileSpreadsheet,
  Printer,
  X
} from 'lucide-react';
import { MaterialItem, MaterialCategory, UserRole } from '../types';
import { COLOR_OPTIONS, WAREHOUSE_LOCATIONS } from '../data/initialData';
import { formatVND } from '../utils/storage';
import { exportMaterialsToExcel } from '../utils/export';

interface MaterialListProps {
  materials: MaterialItem[];
  onSelectItem: (item: MaterialItem) => void;
  onOpenOutbound: (item: MaterialItem) => void;
  onPrintQR: (item: MaterialItem) => void;
  onUpdateLocation: (itemId: string, newLoc: string) => void;
  onDeleteMaterial: (itemId: string) => void;
  userRole: UserRole;
  initialSearch?: string;
  onNavigateToInbound: () => void;
}

export const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  onSelectItem,
  onOpenOutbound,
  onPrintQR,
  onUpdateLocation,
  onDeleteMaterial,
  userRole,
  initialSearch = '',
  onNavigateToInbound
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [selectedThickness, setSelectedThickness] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [minArea, setMinArea] = useState<string>('');

  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [tempLocation, setTempLocation] = useState<string>('');

  // Filtering Logic
  const filteredMaterials = materials.filter(m => {
    if (m.status !== 'available') return false;

    // Search query match
    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      const match = 
        m.code.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.color.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.sourceProject.toLowerCase().includes(q) ||
        m.supplier.toLowerCase().includes(q) ||
        m.notes.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (selectedColor !== 'ALL' && m.color !== selectedColor) return false;
    if (selectedThickness !== 'ALL' && m.thickness !== selectedThickness) return false;
    if (selectedLocation !== 'ALL' && m.location !== selectedLocation) return false;
    if (selectedCondition !== 'ALL' && m.condition !== selectedCondition) return false;
    if (minArea !== '' && m.areaM2 < parseFloat(minArea)) return false;

    return true;
  });

  const categories = ['ALL', 'Mica', 'Alu', 'Fomex', 'Decal', 'MDF / Gỗ', 'PVC / Poly', 'Canvas / Hiflex', 'Khác'];
  const thicknesses = ['ALL', '2mm', '3mm', '5mm', '8mm', '10mm', '15mm', '20mm'];
  const conditions = [
    'ALL', 
    'Mới', 
    'Đã cắt 1 lần', 
    'Đã cắt nhiều lần', 
    'Méo góc', 
    'Trầy nhẹ', 
    'Chỉ dùng chi tiết nhỏ'
  ];

  const handleExportExcel = () => {
    exportMaterialsToExcel(filteredMaterials, 'Danh_Muc_Vat_Tu_Du_Quang_Cao.xlsx');
  };

  return (
    <div className="space-y-5">
      
      {/* Header Bar & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>Kho Vật Tư Dư Tồn Kho ({filteredMaterials.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý chi tiết kích thước, màu sắc, vị trí lưu kho & in nhãn QR code
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
          {userRole !== 'staff' && (
            <button
              onClick={onNavigateToInbound}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>+ Nhập Dư Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã (MK001), tên vật tư, màu sắc, vị trí (Kệ A1), dự án..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 border-t border-slate-100 text-xs">
          
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Chủng Loại</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'Tất cả loại' : c}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Màu Sắc</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả màu</option>
              {COLOR_OPTIONS.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Thickness Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Độ Dày</label>
            <select
              value={selectedThickness}
              onChange={(e) => setSelectedThickness(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {thicknesses.map(t => (
                <option key={t} value={t}>{t === 'ALL' ? 'Tất cả độ dày' : t}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Vị Trí Kho</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả vị trí</option>
              {WAREHOUSE_LOCATIONS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Tình Trạng</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {conditions.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'Tất cả tình trạng' : c}</option>
              ))}
            </select>
          </div>

          {/* Min Area Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Diện Tích Tối Thiểu</label>
            <select
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tất cả kích thước</option>
              <option value="0.2">Tối thiểu 0.2 m²</option>
              <option value="0.5">Tối thiểu 0.5 m²</option>
              <option value="1.0">Tối thiểu 1.0 m²</option>
            </select>
          </div>

        </div>

      </div>

      {/* Materials Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Ảnh & Mã VT</th>
                <th className="py-3 px-4">Tên Vật Tư & Quy Cách Gốc</th>
                <th className="py-3 px-4">Màu & Độ Dày</th>
                <th className="py-3 px-4">Kích Thước Còn Lại</th>
                <th className="py-3 px-4">Diện Tích / Dài</th>
                <th className="py-3 px-4">SL</th>
                <th className="py-3 px-4">Tình Trạng</th>
                <th className="py-3 px-4">Vị Trí Kho</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">Không tìm thấy vật tư phù hợp</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Thử đổi bộ lọc hoặc nhập vật tư mới</p>
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((item) => {
                  const colorObj = COLOR_OPTIONS.find(c => c.name === item.color);
                  const isEditingLoc = editingLocationId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Photo & Code */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => onSelectItem(item)}
                          />
                          <div>
                            <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block font-mono">
                              {item.code}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{item.category}</div>
                          </div>
                        </div>
                      </td>

                      {/* Name & Original Spec */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="font-bold text-slate-900 hover:text-blue-600 text-left line-clamp-1 block transition-colors"
                        >
                          {item.name}
                        </button>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Gốc: {item.originalSpec} • {item.supplier}
                        </div>
                      </td>

                      {/* Color & Thickness */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs ${colorObj ? colorObj.class : 'bg-slate-400'}`} 
                          />
                          <span className="font-semibold text-slate-800">{item.color}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                          Độ dày: {item.thickness}
                        </span>
                      </td>

                      {/* Remaining Dimension */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 font-mono">
                          {item.lengthMm} × {item.widthMm} <span className="text-[10px] text-slate-400 font-sans">mm</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Nguồn: {item.sourceProject}
                        </div>
                      </td>

                      {/* Area / Length */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-emerald-700">
                          {item.areaM2} m²
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~{formatVND(item.unitPriceEstimate * item.areaM2)}/tấm
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900">
                        {item.quantity} {item.unit}
                      </td>

                      {/* Condition */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          item.condition === 'Mới' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.condition === 'Đã cắt 1 lần' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.condition === 'Đã cắt nhiều lần' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.condition}
                        </span>
                      </td>

                      {/* Storage Location */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isEditingLoc ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={tempLocation}
                              onChange={(e) => setTempLocation(e.target.value)}
                              className="w-24 px-1.5 py-0.5 border border-blue-400 rounded-md text-xs font-semibold focus:outline-none"
                              placeholder="Kệ A1..."
                            />
                            <button
                              onClick={() => {
                                onUpdateLocation(item.id, tempLocation);
                                setEditingLocationId(null);
                              }}
                              className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingLocationId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded-md"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group/loc">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className="font-semibold text-slate-800">{item.location}</span>
                            {userRole !== 'staff' && (
                              <button
                                onClick={() => {
                                  setEditingLocationId(item.id);
                                  setTempLocation(item.location);
                                }}
                                title="Đổi vị trí kệ"
                                className="opacity-0 group-hover/loc:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectItem(item)}
                            title="Xem chi tiết"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onPrintQR(item)}
                            title="In nhãn QR Code"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {userRole !== 'staff' && (
                            <button
                              onClick={() => onOpenOutbound(item)}
                              title="Xuất kho sử dụng"
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md flex items-center gap-1 transition-colors shadow-2xs"
                            >
                              <PackageMinus className="w-3.5 h-3.5" />
                              <span>Xuất</span>
                            </button>
                          )}

                          {userRole === 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Xóa vật tư ${item.code} khỏi danh mục kho?`)) {
                                  onDeleteMaterial(item.id);
                                }
                              }}
                              title="Xóa vật tư"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
