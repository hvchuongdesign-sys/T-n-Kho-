import React from 'react';
import { Printer, X, QrCode, Layers, MapPin } from 'lucide-react';
import { MaterialItem } from '../types';

interface QRLabelPrintModalProps {
  item: MaterialItem;
  onClose: () => void;
}

export const QRLabelPrintModal: React.FC<QRLabelPrintModalProps> = ({ item, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 space-y-4 p-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-slate-900 text-sm">Tem Nhãn Dán QR Code Vật Tư Kho</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Sticker Card (Aspect ratio tag) */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-white shadow-xs space-y-3 print:border-solid print:p-0">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-extrabold text-slate-900 text-xs">VẬT TƯ DƯ QUẢNG CÁO</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500">MÃ: {item.code}</span>
          </div>

          <div className="flex items-center gap-4">
            {item.qrCodeUrl && (
              <img src={item.qrCodeUrl} alt="QR Code" className="w-24 h-24 border border-slate-200 rounded-lg p-1 shrink-0" />
            )}

            <div className="space-y-1 text-xs">
              <div className="font-extrabold text-slate-900 text-sm line-clamp-1">{item.name}</div>
              <div className="text-slate-700 font-semibold">Màu: <strong className="text-slate-900">{item.color}</strong> • {item.thickness}</div>
              <div className="font-mono font-bold text-blue-700 text-sm">{item.lengthMm} × {item.widthMm} mm</div>
              <div className="text-emerald-700 font-bold">{item.areaM2} m²</div>
              <div className="font-bold text-rose-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Vị trí: {item.location}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-1.5 flex justify-between text-[9px] text-slate-400">
            <span>Nguồn: {item.sourceProject}</span>
            <span>Ngày nhập: {item.importDate}</span>
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>In Tem Dán Này</span>
          </button>
        </div>

      </div>
    </div>
  );
};
