import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Bell, 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  Layers, 
  RotateCcw,
  Sparkles,
  QrCode,
  X,
  AlertTriangle
} from 'lucide-react';
import { UserRole, WarehouseAlert } from '../types';
import { getUserRole, setUserRole, resetStorage } from '../utils/storage';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  alerts: WarehouseAlert[];
  onNavigate: (page: string) => void;
  onOpenQuickAdd: () => void;
  onOpenQRScanner: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  alerts,
  onNavigate,
  onOpenQuickAdd,
  onOpenQRScanner,
  searchQuery,
  onSearchChange
}) => {
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);

  const roleLabels: Record<UserRole, { label: string; bg: string; icon: React.ReactNode }> = {
    admin: { label: 'Quản trị (Toàn quyền)', bg: 'bg-rose-500/10 text-rose-600 border-rose-200', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    keeper: { label: 'Thủ kho (Nhập/Xuất/Kiểm)', bg: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: <Package className="w-3.5 h-3.5" /> },
    staff: { label: 'Nhân viên (Chỉ xem/Tìm)', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: <UserCheck className="w-3.5 h-3.5" /> }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* App Branding */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">AdSurplus</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">v2.4 Pro</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Kho Vật Tư Dư Công Ty Quảng Cáo</p>
            </div>
          </div>

          {/* Global Search Input */}
          <div className="flex-1 max-w-md mx-2 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã, tên vật tư, màu sắc (VD: Mica đỏ, MK001, Alu đen)..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    onNavigate('search');
                  }
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Quick Actions */}
            <button
              onClick={onOpenQRScanner}
              title="Quét mã QR vật tư"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Quét QR</span>
            </button>

            {currentRole !== 'staff' && (
              <button
                onClick={onOpenQuickAdd}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nhập Kho Dư</span>
              </button>
            )}

            {/* Alerts Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAlertsMenu(!showAlertsMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Cảnh báo kho"
              >
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {alerts.length}
                  </span>
                )}
              </button>

              {showAlertsMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-xs text-slate-800">Cảnh Báo Tồn Kho ({alerts.length})</span>
                    </div>
                    <button 
                      onClick={() => { setShowAlertsMenu(false); onNavigate('alerts'); }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Xem tất cả
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-2 divide-y divide-slate-100">
                    {alerts.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">Không có cảnh báo nào.</p>
                    ) : (
                      alerts.map((a) => (
                        <div key={a.id} className="py-2.5 flex items-start gap-2.5 text-xs">
                          <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${a.severity === 'warning' ? 'bg-amber-500' : a.severity === 'danger' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{a.title}</p>
                            <p className="text-slate-500 mt-0.5 line-clamp-2">{a.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative group">
              <button 
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold border rounded-lg transition-colors ${roleLabels[currentRole].bg}`}
              >
                {roleLabels[currentRole].icon}
                <span className="hidden lg:inline">{roleLabels[currentRole].label}</span>
                <span className="lg:hidden uppercase font-bold">{currentRole}</span>
              </button>

              {/* Role dropdown list */}
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phân Quyền Vai Trò</div>
                {(['admin', 'keeper', 'staff'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${currentRole === r ? 'bg-slate-100 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>{r === 'admin' ? 'Quản trị' : r === 'keeper' ? 'Thủ kho' : 'Nhân viên'}</span>
                    <span className="text-[10px] text-slate-400">
                      {r === 'admin' ? 'Toàn quyền' : r === 'keeper' ? 'Nhập/Xuất' : 'Xem tồn'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Data Button */}
            <button
              onClick={() => {
                if (confirm('Khôi phục dữ liệu kho về mẫu ban đầu?')) {
                  resetStorage();
                  window.location.reload();
                }
              }}
              title="Khôi phục dữ liệu mẫu"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
