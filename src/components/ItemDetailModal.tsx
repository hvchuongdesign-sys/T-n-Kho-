import React from 'react';
import { 
  X, 
  MapPin, 
  QrCode, 
  PackageMinus, 
  Calendar, 
  User, 
  FolderKanban, 
  Ruler, 
  Coins, 
  Printer,
  Sparkles
} from 'lucide-react';
import { MaterialItem, UserRole } from '../types';
import { formatVND } from '../utils/storage';

interface ItemDetailModalProps {
  item: MaterialItem;
  onClose: () => void;
  onOpenOutbound: (item: MaterialItem) => void;
  onPrintQR: (item: MaterialItem) => void;
  userRole: UserRole;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onOpenOutbound,
  onPrintQR,
  userRole
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-extrabold text-sm text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-md border border-blue-400/30">
              {item.code}
            </span>
            <span className="text-xs text-slate-300 font-semibold">• {item.category}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Image & QR Code */}
            <div className="space-y-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-xs"
              />
              {item.qrCodeUrl && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                  <img src={item.qrCodeUrl} alt="QR Code" className="w-24 h-24 mx-auto border border-slate-200 rounded-md p-1 bg-white" />
                  <span className="text-[10px] text-slate-400 font-mono block">Mã tem QR: {item.code}</span>
                  <button
                    onClick={() => onPrintQR(item)}
                    className="w-full mt-1 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center justify-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Tem QR</span>
                  </button>
                </div>
              )}
            </div>

            {/* Details Specs */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">{item.name}</h2>
                <p className="text-slate-500 mt-0.5">Nhà cung cấp: <strong className="text-slate-800">{item.supplier}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Màu Sắc</span>
                  <span className="font-extrabold text-slate-900">{item.color}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Độ Dày</span>
                  <span className="font-extrabold text-slate-900">{item.thickness}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Quy Cách Dư</span>
                  <span className="font-mono font-extrabold text-slate-900">{item.lengthMm} × {item.widthMm} mm</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Diện Tích Dư</span>
                  <span className="font-extrabold text-emerald-700">{item.areaM2} m²</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Số Lượng Tồn</span>
                  <span className="font-extrabold text-slate-900">{item.quantity} {item.unit}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Giá Trị Tồn</span>
                  <span className="font-extrabold text-amber-700">{formatVND(item.unitPriceEstimate * item.areaM2 * item.quantity)}</span>
                </div>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vị trí kho:</span>
                  <span className="font-bold text-rose-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tình trạng:</span>
                  <span className="font-bold text-slate-900">{item.condition}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Công trình nguồn:</span>
                  <span className="font-bold text-slate-900">{item.sourceProject}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-bold text-slate-900">{item.clientName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Người nhập kho:</span>
                  <span className="font-bold text-slate-900">{item.inboundStaff}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ngày nhập kho:</span>
                  <span className="font-bold text-slate-900">{item.importDate}</span>
                </div>
              </div>

              {item.notes && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900">
                  <span className="font-bold block mb-0.5">Ghi chú:</span>
                  <p>{item.notes}</p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
          >
            Đóng
          </button>
          
          {userRole !== 'staff' && (
            <button
              onClick={() => {
                onOpenOutbound(item);
                onClose();
              }}
              className="px-5 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <PackageMinus className="w-4 h-4" />
              <span>Xuất Kho Ngay</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
