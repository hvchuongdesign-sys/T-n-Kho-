import React, { useState } from 'react';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  Search, 
  MapPin, 
  PackageMinus, 
  X,
  Sparkles,
  Layers,
  Calendar,
  Eye
} from 'lucide-react';
import { MaterialItem, UserRole } from '../types';

interface QRScannerModalProps {
  materials: MaterialItem[];
  onClose: () => void;
  onSelectItem: (item: MaterialItem) => void;
  onOpenOutbound: (item: MaterialItem) => void;
  userRole: UserRole;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  materials,
  onClose,
  onSelectItem,
  onOpenOutbound,
  userRole
}) => {
  const [scannedCodeInput, setScannedCodeInput] = useState('');
  const [scannedItem, setScannedItem] = useState<MaterialItem | null>(null);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(true);

  const handleScanCode = (code: string) => {
    const found = materials.find(
      m => m.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (found) {
      setScannedItem(found);
      setIsSimulatingCamera(false);
    } else {
      alert(`Không tìm thấy vật tư có mã QR [${code}] trong kho!`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Quét Mã QR Vật Tư Kho</h2>
              <p className="text-xs text-slate-400">Dán tem QR lên vật tư dư • Quét bằng camera điện thoại hoặc nhập mã</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Camera Scan Simulation Frame */}
          {isSimulatingCamera && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-2xl p-6 text-center text-white relative overflow-hidden border-2 border-indigo-500/40">
                
                {/* Camera Viewfinder Overlay */}
                <div className="w-48 h-48 mx-auto border-2 border-dashed border-indigo-400 rounded-xl relative flex items-center justify-center animate-pulse">
                  <div className="w-full h-0.5 bg-indigo-500 absolute top-1/2 -translate-y-1/2 shadow-lg shadow-indigo-500/50 animate-bounce" />
                  <Camera className="w-8 h-8 text-indigo-400/50" />
                </div>

                <p className="text-xs text-indigo-200 mt-4 font-semibold">
                  Đưa tem mã QR dán trên tấm vật tư vào khung hình camera...
                </p>

              </div>

              {/* Quick Select Item Tag Simulator */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Hoặc chọn mã tem QR mẫu trong kho để quét ngay:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {materials.slice(0, 4).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleScanCode(m.code)}
                      className="p-2.5 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-left transition-colors space-y-1"
                    >
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {m.code}
                      </span>
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">{m.name}</p>
                      <p className="text-[10px] text-slate-500">{m.lengthMm}x{m.widthMm}mm • {m.color}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Input Fallback */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={scannedCodeInput}
                  onChange={(e) => setScannedCodeInput(e.target.value)}
                  placeholder="Nhập thủ công mã QR (VD: MK001, AL002)..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleScanCode(scannedCodeInput)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Tìm Mã
                </button>
              </div>

            </div>
          )}

          {/* Scanned Material Details Card (Prompt Section 11 Requirements) */}
          {scannedItem && !isSimulatingCamera && (
            <div className="bg-slate-50 rounded-2xl border-2 border-indigo-200 p-5 space-y-4">
              
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-slate-900 text-sm">
                    Nhận Diện Thành Công Tem QR: {scannedItem.code}
                  </span>
                </div>
                <button
                  onClick={() => setIsSimulatingCamera(true)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Quét mã khác
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Photo */}
                <div className="sm:col-span-1">
                  <img
                    src={scannedItem.imageUrl}
                    alt={scannedItem.name}
                    className="w-full h-36 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                  {scannedItem.qrCodeUrl && (
                    <img
                      src={scannedItem.qrCodeUrl}
                      alt="QR Code"
                      className="w-20 h-20 mx-auto mt-2 border border-slate-200 rounded-lg p-1 bg-white"
                    />
                  )}
                </div>

                {/* Specs list */}
                <div className="sm:col-span-2 space-y-2 text-xs">
                  <h3 className="font-extrabold text-slate-900 text-base">{scannedItem.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-xl border border-slate-200 font-medium">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-semibold">Màu sắc</span>
                      <span className="font-bold text-slate-800">{scannedItem.color}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-semibold">Độ dày</span>
                      <span className="font-bold text-slate-800">{scannedItem.thickness}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-semibold">Kích thước</span>
                      <span className="font-mono font-bold text-slate-900">{scannedItem.lengthMm} × {scannedItem.widthMm} mm</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-semibold">Diện tích dư</span>
                      <span className="font-bold text-emerald-700">{scannedItem.areaM2} m²</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-semibold">Vị trí lưu kho</span>
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {scannedItem.location}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-semibold">Ngày nhập</span>
                      <span className="font-bold text-slate-800">{scannedItem.importDate}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Ghi chú: {scannedItem.notes || 'Không có ghi chú.'}
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    onSelectItem(scannedItem);
                    onClose();
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem Toàn Bộ</span>
                </button>

                {userRole !== 'staff' && (
                  <button
                    onClick={() => {
                      onOpenOutbound(scannedItem);
                      onClose();
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <PackageMinus className="w-4 h-4" />
                    <span>Xuất Tấm Này Ngay</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
