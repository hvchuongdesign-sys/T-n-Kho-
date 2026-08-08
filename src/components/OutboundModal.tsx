import React, { useState } from 'react';
import { 
  PackageMinus, 
  Search, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X,
  Layers,
  Ruler
} from 'lucide-react';
import { MaterialItem, UserRole } from '../types';
import { outboundMaterial, formatVND } from '../utils/storage';

interface OutboundModalProps {
  initialItem?: MaterialItem | null;
  materials: MaterialItem[];
  onClose: () => void;
  onSuccess: () => void;
  userRole: UserRole;
}

export const OutboundModal: React.FC<OutboundModalProps> = ({
  initialItem,
  materials,
  onClose,
  onSuccess,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialItem ? initialItem.name : 'Mica đỏ');
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(initialItem || null);

  const [exportQty, setExportQty] = useState<number>(1);
  const [projectName, setProjectName] = useState<string>('Cafe Katinat Tân Bình');
  const [clientName, setClientName] = useState<string>('Chuỗi Katinat Coffee');
  const [staffName, setStaffName] = useState<string>('Lê Hoàng Nam');
  const [notes, setNotes] = useState<string>('Xuất tái sử dụng làm chữ nổi biển hiệu.');

  // Available stock items matching search
  const availableStock = materials.filter(m => {
    if (m.status !== 'available' || m.quantity <= 0) return false;
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.color.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q)
    );
  });

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (exportQty > selectedItem.quantity) {
      alert(`Số lượng xuất (${exportQty}) lớn hơn số lượng tồn kho hiện tại (${selectedItem.quantity})!`);
      return;
    }

    const result = outboundMaterial(
      selectedItem.id,
      exportQty,
      staffName,
      projectName,
      clientName,
      notes
    );

    if (result.success) {
      alert(`Đã xuất kho thành công ${exportQty} ${selectedItem.unit} vật tư [${selectedItem.code}]!`);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 space-y-0">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <PackageMinus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Xuất Kho Vật Tư Dư Tái Sử Dụng</h2>
              <p className="text-xs text-slate-400">Chọn tấm vật tư dư phù hợp kích thước để xuất gia công cho công trình mới</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Search Box to Find Matching Stock */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Tìm Tên Vật Tư Hoặc Màu Sắc Cần Lấy (Ví dụ: Mica đỏ, Alu đen)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedItem(null);
                }}
                placeholder="Nhập tên vật tư (VD: Mica đỏ, Alu đen, Decal xanh)..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* List of Matching Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                2. Danh Sách Mảnh Tồn Kho Khả Dụng ({availableStock.length})
              </span>
              <span className="text-[11px] text-slate-400">Bấm chọn mảnh kích thước phù hợp nhất</span>
            </div>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto bg-slate-50/50">
              {availableStock.length === 0 ? (
                <p className="p-4 text-xs text-slate-500 text-center">Không tìm thấy mảnh vật tư dư nào khớp với từ khóa "{searchTerm}".</p>
              ) : (
                availableStock.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setExportQty(1);
                      }}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors text-xs ${
                        isSelected 
                          ? 'bg-blue-50/90 border-l-4 border-blue-600 font-semibold text-blue-900' 
                          : 'hover:bg-white text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {item.code}
                        </span>
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold text-slate-700">KT: {item.lengthMm}x{item.widthMm}mm</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{item.areaM2} m²</span>
                            <span>•</span>
                            <span>Màu: {item.color}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{item.location}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tồn: <strong className="text-slate-700">{item.quantity} {item.unit}</strong> • Nhập: {item.importDate}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Form Details if Item Selected */}
          {selectedItem && (
            <form onSubmit={handleExport} className="bg-slate-50 p-4 rounded-xl border border-blue-200 space-y-4 text-xs">
              
              <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Xác Nhận Xuất Tấm: {selectedItem.code} - {selectedItem.name}</span>
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Tiết kiệm: {formatVND(selectedItem.unitPriceEstimate * selectedItem.areaM2)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số Lượng Xuất (Tồn: {selectedItem.quantity}) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={selectedItem.quantity}
                    value={exportQty}
                    onChange={(e) => setExportQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Công Trình Sử Dụng <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Tên dự án mới..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khách Hàng</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Tên khách..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Người Thực Hiện Xuất</label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ghi Chú Xuất Kho</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mục đích sử dụng..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg font-semibold hover:bg-slate-100"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <PackageMinus className="w-4 h-4" />
                  <span>Xác Nhận Xuất Kho</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
