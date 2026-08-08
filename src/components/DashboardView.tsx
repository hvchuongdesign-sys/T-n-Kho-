import React from 'react';
import { 
  Package, 
  Maximize2, 
  Ruler, 
  Coins, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Award,
  BarChart2
} from 'lucide-react';
import { MaterialItem, InventoryTransaction, WarehouseAlert, ReuseMetrics } from '../types';
import { formatVND } from '../utils/storage';

interface DashboardViewProps {
  materials: MaterialItem[];
  transactions: InventoryTransaction[];
  alerts: WarehouseAlert[];
  metrics: ReuseMetrics;
  onNavigate: (page: string, filter?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  materials,
  transactions,
  alerts,
  metrics,
  onNavigate
}) => {
  // Available stock items
  const availableMaterials = materials.filter(m => m.status === 'available');

  // Key Totals
  const totalItemsCount = availableMaterials.reduce((acc, m) => acc + m.quantity, 0);
  const totalAreaM2 = availableMaterials.reduce((acc, m) => acc + (m.areaM2 * m.quantity), 0);
  const totalLengthM = availableMaterials.reduce((acc, m) => acc + ((m.lengthMm / 1000) * m.quantity), 0);
  const totalEstimatedValue = availableMaterials.reduce((acc, m) => acc + (m.unitPriceEstimate * m.areaM2 * m.quantity), 0);

  // Aging items > 180 days (6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);
  const sixMonthsAgoStr = sixMonthsAgo.toISOString().substring(0, 10);
  
  const agingMaterials = availableMaterials.filter(m => m.importDate <= sixMonthsAgoStr);

  // Breakdown by Category
  const categoryStats: Record<string, { count: number; area: number; value: number }> = {};
  availableMaterials.forEach(m => {
    if (!categoryStats[m.category]) {
      categoryStats[m.category] = { count: 0, area: 0, value: 0 };
    }
    categoryStats[m.category].count += m.quantity;
    categoryStats[m.category].area += (m.areaM2 * m.quantity);
    categoryStats[m.category].value += (m.unitPriceEstimate * m.areaM2 * m.quantity);
  });

  // Top Used Materials
  const outboundTx = transactions.filter(t => t.type === 'outbound');
  const usageMap: Record<string, number> = {};
  outboundTx.forEach(t => {
    usageMap[t.itemName] = (usageMap[t.itemName] || 0) + t.quantity;
  });

  const topUsedMaterials = Object.entries(usageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Monthly In/Out Mock & Calculated Chart Data
  const monthlyData = [
    { month: 'Tháng 3', in: 18, out: 12 },
    { month: 'Tháng 4', in: 24, out: 20 },
    { month: 'Tháng 5', in: 30, out: 26 },
    { month: 'Tháng 6', in: 22, out: 19 },
    { month: 'Tháng 7', in: 35, out: 28 },
    { month: 'Tháng 8 (HT)', in: 14, out: 11 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Material Reuse Savings Highlight */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Layers className="w-80 h-80 text-white" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hiệu Quả Tận Dụng Vật Tư Quảng Cáo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Tháng này xưởng đã tái sử dụng <span className="text-amber-400 font-black">{metrics.reusedPiecesMonth} tấm</span> vật tư dư
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Tiết kiệm <strong className="text-emerald-400">{metrics.savedAreaM2} m²</strong> vật tư Mica/Alu/Decal, tương đương quy đổi <strong className="text-amber-300">{formatVND(metrics.savedMoneyVND)}</strong> giá trị mua mới.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('savings')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Xem Chi Tiết ROI</span>
            </button>
            <button
              onClick={() => onNavigate('inbound')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs backdrop-blur-xs border border-white/20 transition-all"
            >
              + Nhập Vật Tư Dư
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards (4 Core Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Stock */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Tấm / Cuộn Dư</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalItemsCount}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">tấm / cuộn</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Sẵn sàng cắt gia công</span>
          </div>
        </div>

        {/* Metric 2: Total Area */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Diện Tích Tồn</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Maximize2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalAreaM2.toFixed(2)}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">m²</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Tương đương ~{(totalAreaM2 / 2.9776).toFixed(1)} tấm nguyên (1.22x2.44m)
          </div>
        </div>

        {/* Metric 3: Total Length */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Chiều Dài Dư</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalLengthM.toFixed(1)}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">m dài</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-600 font-medium">
            Gồm cuộn Decal, Bạt & Thanh Alu/Nẹp
          </div>
        </div>

        {/* Metric 4: Estimated Value */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá Trị Tồn Ước Tính</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-900">{formatVND(totalEstimatedValue)}</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium">
            Nguồn vốn nằm trong nguyên liệu dư
          </div>
        </div>

      </div>

      {/* Main Grid: Charts & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly In/Out Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>Biểu Đồ Nhập - Xuất Kho Vật Tư Dư Theo Tháng</span>
              </h2>
              <p className="text-xs text-slate-500">So sánh số lượng tấm nhập kho dư và xuất tái sử dụng</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span>Nhập dư mới</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-600" />
                <span>Xuất tái sử dụng</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 pt-6 pb-2 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                  {/* In Bar */}
                  <div 
                    style={{ height: `${(d.in / 40) * 100}%` }}
                    className="w-3 sm:w-5 bg-emerald-500 rounded-t-sm transition-all relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded-md whitespace-nowrap z-10 transition-opacity">
                      Nhập: {d.in} tấm
                    </div>
                  </div>
                  {/* Out Bar */}
                  <div 
                    style={{ height: `${(d.out / 40) * 100}%` }}
                    className="w-3 sm:w-5 bg-blue-600 rounded-t-sm transition-all relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded-md whitespace-nowrap z-10 transition-opacity">
                      Xuất: {d.out} tấm
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Tỷ lệ tái sử dụng trung bình: <strong className="text-slate-800">{metrics.reuseRatePercent}%</strong></span>
            <button onClick={() => onNavigate('reports')} className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
              <span>Xem Báo Cáo Chi Tiết</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Material Category Breakdown (1 col) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-slate-900 text-sm">Thống Kê Theo Loại Vật Tư</h2>
          
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, stat]) => {
              const catPercent = totalAreaM2 > 0 ? ((stat.area / totalAreaM2) * 100).toFixed(1) : '0';
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat}</span>
                    <span className="text-slate-500">{stat.count} tấm ({stat.area.toFixed(2)} m²)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      style={{ width: `${catPercent}%` }}
                      className={`h-full ${
                        cat === 'Mica' ? 'bg-red-500' :
                        cat === 'Alu' ? 'bg-slate-800' :
                        cat === 'Fomex' ? 'bg-amber-500' :
                        cat === 'Decal' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Chiếm {catPercent}% diện tích</span>
                    <span>{formatVND(stat.value)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Secondary Row: Aging Alert Box & Top Used Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Aging Materials Warning Box */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-sm">Vật Tư Lưu Kho Quá 6 Tháng ({agingMaterials.length})</h2>
            </div>
            <button onClick={() => onNavigate('alerts')} className="text-xs text-amber-600 font-semibold hover:underline">
              Cảnh báo ({alerts.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {agingMaterials.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Không có vật tư nào lưu kho quá 6 tháng. Kho vận hành rất tốt!</p>
            ) : (
              agingMaterials.slice(0, 4).map(m => (
                <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{m.code}</span>
                      <span className="text-slate-700 font-medium">{m.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      KT: {m.lengthMm}x{m.widthMm}mm • Vị trí: <span className="font-semibold text-slate-700">{m.location}</span> • Ngày nhập: {m.importDate}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('materials', m.code)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors shrink-0"
                  >
                    Ưu tiên xuất
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Used Materials */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm">Vật Tư Được Sử Dụng Tái Tạo Nhiều Nhất</h2>
            </div>
            <span className="text-xs text-slate-400">Xếp hạng theo lượt xuất</span>
          </div>

          <div className="space-y-2.5">
            {topUsedMaterials.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Chưa có lịch sử xuất vật tư.</p>
            ) : (
              topUsedMaterials.map(([name, count], index) => (
                <div key={name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      index === 0 ? 'bg-amber-400 text-slate-950' :
                      index === 1 ? 'bg-slate-300 text-slate-800' :
                      index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-800">{name}</span>
                  </div>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                    Đã xuất {count} lần
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
