import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileType2, 
  Filter, 
  Calendar, 
  Package, 
  User, 
  MapPin, 
  FolderKanban,
  Download,
  Check
} from 'lucide-react';
import { MaterialItem, InventoryTransaction } from '../types';
import { exportMaterialsToExcel, exportTransactionsToExcel, exportReportToPDF } from '../utils/export';
import { formatVND } from '../utils/storage';

interface ReportsViewProps {
  materials: MaterialItem[];
  transactions: InventoryTransaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ materials, transactions }) => {
  const [reportPeriod, setReportPeriod] = useState<'month' | 'day' | 'year'>('month');
  const [selectedStaff, setSelectedStaff] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');

  // Filtered materials for report
  const reportMaterials = materials.filter(m => {
    if (m.status !== 'available') return false;
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (selectedLocation !== 'ALL' && m.location !== selectedLocation) return false;
    if (selectedStaff !== 'ALL' && m.inboundStaff !== selectedStaff) return false;
    return true;
  });

  const totalQty = reportMaterials.reduce((acc, m) => acc + m.quantity, 0);
  const totalArea = reportMaterials.reduce((acc, m) => acc + (m.areaM2 * m.quantity), 0);
  const totalValue = reportMaterials.reduce((acc, m) => acc + (m.unitPriceEstimate * m.areaM2 * m.quantity), 0);

  const handleDownloadExcel = () => {
    exportMaterialsToExcel(reportMaterials, `Bao_Cao_Kho_Vat_Tu_${reportPeriod}.xlsx`);
  };

  const handleDownloadPDF = () => {
    exportReportToPDF(`BÁO CÁO KHO VẬT TƯ DƯ (${reportPeriod.toUpperCase()})`, reportMaterials, `Bao_Cao_Kho_Vat_Tu_${reportPeriod}.pdf`);
  };

  const handleDownloadHistoryExcel = () => {
    exportTransactionsToExcel(transactions, `Lich_Su_Kho_Vat_Tu.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Thống Kê Báo Cáo & Xuất File Kho</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lập báo cáo tổng hợp tồn kho, xuất file Excel & PDF chuẩn biểu mẫu quản lý xưởng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadExcel}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileType2 className="w-4 h-4 text-rose-600" />
            <span>Xuất PDF (.pdf)</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Tùy Chọn Lọc Báo Cáo</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kỳ Báo Cáo</label>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setReportPeriod('day')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold ${reportPeriod === 'day' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'}`}
              >
                Theo Ngày
              </button>
              <button
                onClick={() => setReportPeriod('month')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold ${reportPeriod === 'month' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'}`}
              >
                Theo Tháng
              </button>
              <button
                onClick={() => setReportPeriod('year')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold ${reportPeriod === 'year' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'}`}
              >
                Theo Năm
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chủng Loại Vật Tư</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="Mica">Mica</option>
              <option value="Alu">Alu</option>
              <option value="Fomex">Fomex</option>
              <option value="Decal">Decal</option>
              <option value="MDF / Gỗ">MDF / Gỗ</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kệ Kho Lưu</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Tất cả kệ kho</option>
              <option value="Kệ A1">Kệ A1</option>
              <option value="Kệ A2">Kệ A2</option>
              <option value="Giá B3">Giá B3</option>
              <option value="Kho tầng 2">Kho tầng 2</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lịch Sử Nhập/Xuất Kho</label>
            <button
              onClick={handleDownloadHistoryExcel}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Nhật Ký Lịch Sử</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-semibold uppercase">Số Tấm Trong Báo Cáo</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalQty} tấm / cuộn</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-semibold uppercase">Tổng Diện Tích Dư</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{totalArea.toFixed(2)} m²</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-semibold uppercase">Tổng Giá Trị Tồn</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{formatVND(totalValue)}</p>
        </div>
      </div>

      {/* Report Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Xem Trước Bảng Báo Cáo ({reportMaterials.length} dòng)</h2>
          <span className="text-xs text-slate-400">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Mã Vật Tư</th>
                <th className="py-2.5 px-3">Tên Vật Tư</th>
                <th className="py-2.5 px-3">Loại</th>
                <th className="py-2.5 px-3">Màu</th>
                <th className="py-2.5 px-3">KT (mm)</th>
                <th className="py-2.5 px-3">Diện Tích (m²)</th>
                <th className="py-2.5 px-3">SL</th>
                <th className="py-2.5 px-3">Vị Trí</th>
                <th className="py-2.5 px-3 text-right">Giá Trị Tồn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {reportMaterials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{m.code}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{m.category}</td>
                  <td className="py-2.5 px-3 text-slate-800">{m.color}</td>
                  <td className="py-2.5 px-3 font-mono">{m.lengthMm}x{m.widthMm}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">{m.areaM2}</td>
                  <td className="py-2.5 px-3 font-bold">{m.quantity}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-semibold">{m.location}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {formatVND(m.unitPriceEstimate * m.areaM2 * m.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
