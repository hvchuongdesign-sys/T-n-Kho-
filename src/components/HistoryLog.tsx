import React, { useState } from 'react';
import { 
  History, 
  Search, 
  ShieldAlert, 
  PackagePlus, 
  PackageMinus, 
  UserCheck, 
  FolderKanban, 
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { InventoryTransaction } from '../types';
import { exportTransactionsToExcel } from '../utils/export';

interface HistoryLogProps {
  transactions: InventoryTransaction[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ transactions }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = transactions.filter(t => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (!search.trim()) return true;

    const q = search.toLowerCase();
    return (
      t.itemCode.toLowerCase().includes(q) ||
      t.itemName.toLowerCase().includes(q) ||
      t.staffName.toLowerCase().includes(q) ||
      t.projectName.toLowerCase().includes(q) ||
      t.clientName.toLowerCase().includes(q) ||
      t.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-slate-900 text-white rounded-full uppercase tracking-wider">
              Audit Log • Không Thể Chỉnh Sửa
            </span>
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Nhật Ký Lịch Sử Nhập - Xuất Kho</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu vết tự động toàn bộ giao dịch ai nhập, ai xuất, ngày giờ, công trình & khách hàng
          </p>
        </div>

        <button
          onClick={() => exportTransactionsToExcel(filtered)}
          className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Tải Lịch Sử (.xlsx)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã vật tư, tên nhân viên, công trình, khách hàng..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <span className="text-slate-500 font-semibold text-[11px]">Loại giao dịch:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800"
          >
            <option value="ALL">Tất cả giao dịch</option>
            <option value="inbound">Nhập kho dư</option>
            <option value="outbound">Xuất kho sử dụng</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Thời Gian Stamp</th>
                <th className="py-3 px-4">Giao Dịch</th>
                <th className="py-3 px-4">Mã & Tên Vật Tư</th>
                <th className="py-3 px-4">Số Lượng / m²</th>
                <th className="py-3 px-4">Người Thực Hiện</th>
                <th className="py-3 px-4">Công Trình & Khách Hàng</th>
                <th className="py-3 px-4">Ghi Chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Chưa có nhật ký giao dịch nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {t.timestamp}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                        t.type === 'inbound' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {t.type === 'inbound' ? <PackagePlus className="w-3 h-3" /> : <PackageMinus className="w-3 h-3" />}
                        <span>{t.type === 'inbound' ? 'Nhập kho dư' : 'Xuất kho sử dụng'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mr-2">
                        {t.itemCode}
                      </span>
                      <span className="font-bold text-slate-900">{t.itemName}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900">
                      {t.quantity} tấm ({t.areaM2} m²)
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{t.staffName}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">{t.role}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">{t.projectName}</span>
                      <span className="text-[11px] text-slate-500">{t.clientName}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {t.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
