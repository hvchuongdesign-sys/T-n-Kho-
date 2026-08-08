import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Maximize2, 
  Award, 
  Sparkles, 
  BarChart3, 
  ArrowUpRight, 
  CheckCircle2, 
  Percent,
  Layers,
  Leaf
} from 'lucide-react';
import { ReuseMetrics, MaterialItem } from '../types';
import { formatVND } from '../utils/storage';

interface SavingsAnalyticsProps {
  metrics: ReuseMetrics;
  materials: MaterialItem[];
}

export const SavingsAnalytics: React.FC<SavingsAnalyticsProps> = ({ metrics, materials }) => {
  
  // Category ROI Breakdown
  const categoriesROI = [
    { name: 'Mica Đỏ & Mica Trong', reused: 14, savedArea: '8.2 m²', savedValue: 5240000, percent: '42%' },
    { name: 'Alu Đen & Alu Trắng', reused: 10, savedArea: '6.1 m²', savedValue: 4120000, percent: '33%' },
    { name: 'Fomex Trắng 5mm/8mm', reused: 5, savedArea: '2.8 m²', savedValue: 1850000, percent: '15%' },
    { name: 'Decal & Bạt Hiflex', reused: 3, savedArea: '1.5 m²', savedValue: 1240000, percent: '10%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 uppercase">
              ROI & Cost Offset
            </span>
            <span className="text-xs text-slate-400">• Dành cho xưởng quảng cáo</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Thống Kê Tận Dụng Vật Tư & Tiết Kiệm Chi Phí</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Đánh giá hiệu quả tái chế vật tư dư xén, giảm chi phí nguyên liệu mua mới & tối ưu hóa lợi nhuận
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Tỷ Lệ Tận Dụng</span>
            <span className="text-lg font-black text-emerald-800 font-mono">{metrics.reuseRatePercent}%</span>
          </div>
        </div>
      </div>

      {/* 4 Core ROI Hero Cards (Section 13 Prompt Example Exact Alignment) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Reused Pieces */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-blue-300">
            <span className="text-xs font-bold uppercase tracking-wider">Tái Sử Dụng Tháng Này</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-300">{metrics.reusedPiecesMonth}</span>
            <span className="text-xs text-slate-300 ml-1.5 font-bold">tấm vật tư</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Đã gia công cho các biển phòng & logo nhỏ
          </p>
        </div>

        {/* Metric 2: Saved Area */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-xs font-bold uppercase tracking-wider">Diện Tích Tiết Kiệm</span>
            <Maximize2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-300">{metrics.savedAreaM2}</span>
            <span className="text-xs text-slate-300 ml-1.5 font-bold">m² mica / alu</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Tránh được lãng phí phế liệu xén dư
          </p>
        </div>

        {/* Metric 3: Saved Money VND */}
        <div className="bg-gradient-to-br from-amber-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-xs font-bold uppercase tracking-wider">Giá Trị Tiết Kiệm Quy Đổi</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-300">{formatVND(metrics.savedMoneyVND)}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Số tiền trực tiếp cắt giảm cho chi phí mua mới
          </p>
        </div>

        {/* Metric 4: Reuse Rate % */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-xs font-bold uppercase tracking-wider">Tỷ Lệ Tận Dụng Vật Tư</span>
            <Percent className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-indigo-300">{metrics.reuseRatePercent}%</span>
            <span className="text-xs text-slate-300 ml-1.5 font-medium">(Chỉ tiêu: {metrics.targetRatePercent}%)</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Đánh giá chỉ số vận hành xưởng tối ưu
          </p>
        </div>

      </div>

      {/* Detailed Category ROI Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>Chi Tiết Tiết Kiệm Theo Chủng Loại Vật Tư</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Chủng Loại Vật Tư</th>
                <th className="py-2.5 px-3">Số Tấm Tái Sử Dụng</th>
                <th className="py-2.5 px-3">Diện Tích (m²)</th>
                <th className="py-2.5 px-3">Giá Trị Tiết Kiệm (VNĐ)</th>
                <th className="py-2.5 px-3 text-right">Tỷ Lệ Đóng Góp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {categoriesROI.map((c) => (
                <tr key={c.name} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{c.reused} tấm</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{c.savedArea}</td>
                  <td className="py-3 px-3 font-bold text-amber-700">{formatVND(c.savedValue)}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-blue-700">{c.percent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental & Sustainability Impact */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 text-sm">Xưởng Quảng Cáo Xanh & Bảo Vệ Môi Trường</h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              Tái sử dụng 18.6m² nhựa Mica/Alu giúp cắt giảm ~42kg chất thải nhựa khó phân hủy ra môi trường mỗi tháng.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
