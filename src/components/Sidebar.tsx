import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PackagePlus, 
  PackageMinus, 
  FolderKanban, 
  QrCode, 
  BarChart3, 
  History, 
  AlertTriangle,
  TrendingUp,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  materialCount: number;
  alertCount: number;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  materialCount,
  alertCount,
  userRole
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Tổng Quan Kho',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
      roles: ['admin', 'keeper', 'staff']
    },
    {
      id: 'materials',
      label: 'Danh Mục Vật Tư',
      icon: <Package className="w-4 h-4" />,
      badge: materialCount > 0 ? materialCount : null,
      roles: ['admin', 'keeper', 'staff']
    },
    {
      id: 'inbound',
      label: 'Nhập Kho Dư',
      icon: <PackagePlus className="w-4 h-4 text-emerald-600" />,
      badge: null,
      roles: ['admin', 'keeper']
    },
    {
      id: 'outbound',
      label: 'Xuất Kho Sử Dụng',
      icon: <PackageMinus className="w-4 h-4 text-blue-600" />,
      badge: null,
      roles: ['admin', 'keeper']
    },
    {
      id: 'search',
      label: 'Tìm & Bộ Lọc Nhanh',
      icon: <SlidersHorizontal className="w-4 h-4" />,
      badge: null,
      roles: ['admin', 'keeper', 'staff']
    },
    {
      id: 'projects',
      label: 'Quản Lý Công Trình',
      icon: <FolderKanban className="w-4 h-4" />,
      badge: null,
      roles: ['admin', 'keeper', 'staff']
    },
    {
      id: 'qr',
      label: 'Quét Mã QR Vật Tư',
      icon: <QrCode className="w-4 h-4 text-indigo-600" />,
      badge: null,
      roles: ['admin', 'keeper', 'staff']
    },
    {
      id: 'savings',
      label: 'Thống Kê Tận Dụng (ROI)',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      badge: 'PRO',
      roles: ['admin', 'keeper', 'staff']
    },
    {
      id: 'reports',
      label: 'Báo Cáo & Xuất File',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: null,
      roles: ['admin', 'keeper']
    },
    {
      id: 'history',
      label: 'Lịch Sử Giao Dịch',
      icon: <History className="w-4 h-4" />,
      badge: null,
      roles: ['admin', 'keeper', 'staff']
    },
    {
      id: 'alerts',
      label: 'Cảnh Báo Thông Minh',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      badge: alertCount > 0 ? alertCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      roles: ['admin', 'keeper', 'staff']
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 shrink-0 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-6">
        
        {/* Navigation Category Label */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
            Danh Mục Chức Năng
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isAllowed = item.roles.includes(userRole);
              if (!isAllowed) return null;

              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Agency Value ProTip Widget */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Mẹo Quảng Cáo</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tận dụng tấm Mica/Alu xén góc cho các biển phòng ban hoặc chân logo nhỏ giúp tiết kiệm trung bình <strong className="text-emerald-400">12 - 18 triệu đ/tháng</strong> cho xưởng.
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">Công Ty Quảng Cáo & Nội Thất CHƯƠNG DESIGN</p>
        <p>Hệ thống Quản lý Vật tư Dư v2.4 Do Chương Design Thiết Kế</p>
      </div>
    </aside>
  );
};
