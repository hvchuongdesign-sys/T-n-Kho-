import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  ArrowRight,
  PackageMinus
} from 'lucide-react';
import { WarehouseAlert, MaterialItem, UserRole } from '../types';
import { dismissAlert } from '../utils/storage';

interface AlertsViewProps {
  alerts: WarehouseAlert[];
  materials: MaterialItem[];
  onNavigateToItem: (itemCode: string) => void;
  onOpenOutbound: (item: MaterialItem) => void;
  onRefreshAlerts: () => void;
  userRole: UserRole;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  materials,
  onNavigateToItem,
  onOpenOutbound,
  onRefreshAlerts,
  userRole
}) => {

  const handleDismiss = (id: string) => {
    dismissAlert(id);
    onRefreshAlerts();
  };

  return (
    <div className="space-y-5">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Trung Tâm Cảnh Báo Kho Thông Minh</h1>
            <p className="text-xs text-slate-500">
              Cảnh báo vật tư đọng kho quá 6 tháng, kích thước quá nhỏ & tự động gợi ý tận dụng cho đơn mới
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
          {alerts.length} cảnh báo cần xử lý
        </span>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">Kho vận hành tuyệt đối tối ưu!</p>
            <p className="text-xs text-slate-400 mt-0.5">Không có vật tư nào lưu kho quá lâu hoặc tồn đọng lãng phí.</p>
          </div>
        ) : (
          alerts.map((alt) => {
            const targetItem = materials.find(m => m.id === alt.itemId || m.code === alt.itemCode);

            return (
              <div
                key={alt.id}
                className={`p-4 rounded-2xl border bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  alt.severity === 'warning' ? 'border-amber-300 border-l-4 border-l-amber-500' :
                  alt.severity === 'danger' ? 'border-rose-300 border-l-4 border-l-rose-500' :
                  'border-blue-300 border-l-4 border-l-blue-500'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      alt.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                      alt.severity === 'danger' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alt.type === 'over_6_months' ? 'Tồn > 6 Tháng' : alt.type === 'tiny_size' ? 'Kích thước nhỏ' : 'Gợi ý đơn hàng'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{alt.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{alt.message}</p>
                  <span className="text-[10px] text-slate-400 block">Thời gian phát hiện: {alt.createdAt}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  {targetItem && (
                    <>
                      <button
                        onClick={() => onNavigateToItem(targetItem.code)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        Đến vật tư
                      </button>
                      {userRole !== 'staff' && (
                        <button
                          onClick={() => onOpenOutbound(targetItem)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs flex items-center gap-1"
                        >
                          <PackageMinus className="w-3.5 h-3.5" />
                          <span>Xuất Ngay</span>
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => handleDismiss(alt.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                    title="Đã xử lý"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
