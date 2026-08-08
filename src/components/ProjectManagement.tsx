import React, { useState } from 'react';
import { 
  FolderKanban, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  Layers, 
  Coins, 
  Maximize2,
  PackageMinus,
  Plus
} from 'lucide-react';
import { ProjectInfo, MaterialItem, UserRole } from '../types';
import { formatVND, calculateAreaM2 } from '../utils/storage';

interface ProjectManagementProps {
  projects: ProjectInfo[];
  materials: MaterialItem[];
  onSelectItem: (item: MaterialItem) => void;
  onOpenOutbound: (item: MaterialItem) => void;
  userRole: UserRole;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({
  projects,
  materials,
  onSelectItem,
  onOpenOutbound,
  userRole
}) => {
  const [selectedProjectName, setSelectedProjectName] = useState<string>(projects[0]?.name || 'Trà Sữa ABC');

  // Smart Material Matcher Tool Inputs
  const [targetCategory, setTargetCategory] = useState<string>('Mica');
  const [targetColor, setTargetColor] = useState<string>('Đỏ');
  const [reqLength, setReqLength] = useState<number>(400);
  const [reqWidth, setReqWidth] = useState<number>(600);
  const [showMatcherResults, setShowMatcherResults] = useState<boolean>(true);

  // Material Surplus items created by the selected project
  const projectSurplusItems = materials.filter(
    m => m.sourceProject.toLowerCase() === selectedProjectName.toLowerCase()
  );

  // Matching surplus items in warehouse for the new requested cut size
  const matchingStockCandidates = materials.filter(m => {
    if (m.status !== 'available' || m.quantity <= 0) return false;
    
    // Category & Color match
    const catMatch = m.category.toLowerCase() === targetCategory.toLowerCase();
    const colorMatch = m.color.toLowerCase().includes(targetColor.toLowerCase()) || targetColor === 'Tất cả';

    // Must be large enough to cut requested piece (Length & Width fit in either orientation)
    const fitDirect = m.lengthMm >= reqLength && m.widthMm >= reqWidth;
    const fitRotated = m.lengthMm >= reqWidth && m.widthMm >= reqLength;

    return catMatch && colorMatch && (fitDirect || fitRotated);
  }).sort((a, b) => a.areaM2 - b.areaM2); // Sort smallest area first (best fit, least waste!)

  const reqAreaM2 = calculateAreaM2(reqLength, reqWidth);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            <span>Quản Lý Công Trình & Đề Xuất Tận Dụng Mới</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi vật tư dư sinh ra từ từng công trình & tìm ngay tấm dư tái sử dụng cho công trình tiếp theo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {projects.length} công trình đang quản lý
          </span>
        </div>
      </div>

      {/* SECTION A: Smart Reuse Matcher for New Orders (Tận Dụng Vật Tư) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Công Cụ Tự Động Khớp Vật Tư Dư Cho Đơn Hàng Mới</span>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold">
          Nhập kích thước chi tiết biển hiệu mới để tìm tấm dư phù hợp nhất trong kho:
        </h2>

        {/* Input Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Chủng Loại</label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-2 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="Mica" className="text-slate-900">Mica</option>
              <option value="Alu" className="text-slate-900">Alu</option>
              <option value="Fomex" className="text-slate-900">Fomex</option>
              <option value="Decal" className="text-slate-900">Decal</option>
              <option value="MDF / Gỗ" className="text-slate-900">MDF / Gỗ</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Màu Sắc Cần Cắt</label>
            <input
              type="text"
              value={targetColor}
              onChange={(e) => setTargetColor(e.target.value)}
              placeholder="VD: Đỏ, Xanh, Đen..."
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-2 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Chiều Dài (mm)</label>
            <input
              type="number"
              min={10}
              value={reqLength}
              onChange={(e) => setReqLength(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-2 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Chiều Rộng (mm)</label>
            <input
              type="number"
              min={10}
              value={reqWidth}
              onChange={(e) => setReqWidth(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-2 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowMatcherResults(true)}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg shadow-md transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Tìm Tấm Dư</span>
            </button>
          </div>
        </div>

        {/* Match Results */}
        {showMatcherResults && (
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Kết quả gợi ý ({matchingStockCandidates.length} tấm có thể dùng vừa vặn cho KT {reqLength}x{reqWidth}mm ~ {reqAreaM2}m²):
              </span>
              <span className="text-[11px] text-amber-300">Được sắp xếp theo thứ tự vừa khít nhất (ít phế liệu nhất)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchingStockCandidates.length === 0 ? (
                <div className="col-span-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs text-slate-300">
                  Không tìm thấy tấm dư nào đủ kích thước {reqLength}x{reqWidth}mm màu {targetColor}. Khuyên dùng đặt tấm mới.
                </div>
              ) : (
                matchingStockCandidates.slice(0, 3).map((candidate, idx) => (
                  <div key={candidate.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                        {idx === 0 ? '⭐ Khuyên dùng nhất' : `Lựa chọn #${idx + 1}`}
                      </span>
                      <span className="font-bold text-white">{candidate.code}</span>
                    </div>

                    <div>
                      <div className="font-bold text-white text-sm line-clamp-1">{candidate.name}</div>
                      <div className="text-slate-300 text-[11px] mt-0.5 font-mono">
                        KT Tồn: {candidate.lengthMm}x{candidate.widthMm}mm • {candidate.areaM2} m²
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                      <span>Vị trí: <strong className="text-white">{candidate.location}</strong></span>
                      <span className="text-emerald-300 font-bold">Tiết kiệm ~{formatVND(candidate.unitPriceEstimate * reqAreaM2)}</span>
                    </div>

                    {userRole !== 'staff' && (
                      <button
                        onClick={() => onOpenOutbound(candidate)}
                        className="w-full mt-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <PackageMinus className="w-3.5 h-3.5" />
                        <span>Xuất Tận Dụng Ngay</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* SECTION B: Projects List & Surplus Generated */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects List (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Danh Sách Công Trình Thi Công
          </h2>

          <div className="space-y-2">
            {projects.map((p) => {
              const isSelected = p.name.toLowerCase() === selectedProjectName.toLowerCase();
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectName(p.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-500 font-semibold shadow-xs' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.status === 'completed' ? 'Hoàn thành' : 'Đang thi công'}
                    </span>
                  </div>

                  <div className="text-slate-500 text-[11px] mt-1">
                    Khách hàng: <strong className="text-slate-800">{p.client}</strong>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-slate-200/60">
                    <span className="text-slate-600">Đã dư: <strong className="text-blue-700">{p.surplusCount} tấm</strong></span>
                    <span className="text-emerald-700 font-bold">Tiết kiệm: {formatVND(p.totalSavedAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Surplus Items Created by Selected Project (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span>Vật Tư Dư Sinh Ra Từ Công Trình "{selectedProjectName}" ({projectSurplusItems.length})</span>
              </h2>
              <p className="text-xs text-slate-500">Các mảnh vật tư được xén dư sau khi cắt gia công công trình này</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projectSurplusItems.length === 0 ? (
              <div className="col-span-full py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Chưa có vật tư dư nào ghi nhận cho công trình này.
              </div>
            ) : (
              projectSurplusItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {item.code}
                    </span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.areaM2} m²
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      KT: {item.lengthMm}x{item.widthMm}mm • Màu: {item.color}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    <span>Vị trí: <strong className="text-slate-800">{item.location}</strong></span>
                    <span>Tình trạng: <strong>{item.condition}</strong></span>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="w-full py-1 bg-white border border-slate-300 rounded-lg font-semibold hover:bg-slate-100 text-slate-700"
                    >
                      Xem
                    </button>
                    {userRole !== 'staff' && (
                      <button
                        onClick={() => onOpenOutbound(item)}
                        className="w-full py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-2xs"
                      >
                        Xuất Tận Dụng
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
