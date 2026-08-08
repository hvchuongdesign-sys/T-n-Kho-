/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MaterialList } from './components/MaterialList';
import { InboundForm } from './components/InboundForm';
import { OutboundModal } from './components/OutboundModal';
import { SmartSearch } from './components/SmartSearch';
import { ProjectManagement } from './components/ProjectManagement';
import { QRScannerModal } from './components/QRScannerModal';
import { ReportsView } from './components/ReportsView';
import { HistoryLog } from './components/HistoryLog';
import { AlertsView } from './components/AlertsView';
import { SavingsAnalytics } from './components/SavingsAnalytics';
import { ItemDetailModal } from './components/ItemDetailModal';
import { QRLabelPrintModal } from './components/QRLabelPrintModal';

import { 
  MaterialItem, 
  InventoryTransaction, 
  ProjectInfo, 
  WarehouseAlert, 
  ReuseMetrics, 
  UserRole 
} from './types';

import { 
  getMaterials, 
  getTransactions, 
  getProjects, 
  getAlerts, 
  getMetrics, 
  getUserRole, 
  setUserRole, 
  updateMaterial, 
  deleteMaterial, 
  initStorage 
} from './utils/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [userRole, setUserRoleState] = useState<UserRole>('admin');

  // Core Data States
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [alerts, setAlerts] = useState<WarehouseAlert[]>([]);
  const [metrics, setMetrics] = useState<ReuseMetrics>({
    reusedPiecesMonth: 32,
    savedAreaM2: 18.6,
    savedMoneyVND: 12450000,
    reuseRatePercent: 76,
    targetRatePercent: 80,
    topReusedCategory: 'Mica & Alu'
  });

  // Global Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedDetailItem, setSelectedDetailItem] = useState<MaterialItem | null>(null);
  const [outboundTargetItem, setOutboundTargetItem] = useState<MaterialItem | null>(null);
  const [showOutboundModal, setShowOutboundModal] = useState<boolean>(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState<boolean>(false);
  const [printQRTargetItem, setPrintQRTargetItem] = useState<MaterialItem | null>(null);

  // Load Storage Data
  const refreshData = () => {
    initStorage();
    setMaterials(getMaterials());
    setTransactions(getTransactions());
    setProjects(getProjects());
    setAlerts(getAlerts());
    setMetrics(getMetrics());
    setUserRoleState(getUserRole());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setUserRoleState(role);
  };

  const handleUpdateLocation = (itemId: string, newLoc: string) => {
    if (newLoc.trim()) {
      updateMaterial(itemId, { location: newLoc.trim() });
      refreshData();
    }
  };

  const handleDeleteMaterial = (itemId: string) => {
    deleteMaterial(itemId);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={userRole}
        onRoleChange={handleRoleChange}
        alerts={alerts}
        onNavigate={(p) => setCurrentPage(p)}
        onOpenQuickAdd={() => setCurrentPage('inbound')}
        onOpenQRScanner={() => setShowQRScannerModal(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(p) => setCurrentPage(p)}
          materialCount={materials.filter(m => m.status === 'available').length}
          alertCount={alerts.length}
          userRole={userRole}
        />

        {/* Viewport View Area */}
        <main className="flex-1 p-4 sm:p-6 min-w-0 overflow-y-auto">
          
          {currentPage === 'dashboard' && (
            <DashboardView
              materials={materials}
              transactions={transactions}
              alerts={alerts}
              metrics={metrics}
              onNavigate={(p, filter) => {
                if (filter) setSearchQuery(filter);
                setCurrentPage(p);
              }}
            />
          )}

          {currentPage === 'materials' && (
            <MaterialList
              materials={materials}
              onSelectItem={(item) => setSelectedDetailItem(item)}
              onOpenOutbound={(item) => {
                setOutboundTargetItem(item);
                setShowOutboundModal(true);
              }}
              onPrintQR={(item) => setPrintQRTargetItem(item)}
              onUpdateLocation={handleUpdateLocation}
              onDeleteMaterial={handleDeleteMaterial}
              userRole={userRole}
              initialSearch={searchQuery}
              onNavigateToInbound={() => setCurrentPage('inbound')}
            />
          )}

          {currentPage === 'inbound' && (
            <InboundForm
              onSuccess={(newItem) => {
                refreshData();
                setPrintQRTargetItem(newItem); // Directly offer to print QR tag!
                setCurrentPage('materials');
              }}
              onCancel={() => setCurrentPage('materials')}
            />
          )}

          {currentPage === 'outbound' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h1 className="text-lg font-bold text-slate-900">Quản Lý Xuất Kho Vật Tư Dư</h1>
              <p className="text-xs text-slate-500">Mở bảng tra cứu & chọn tấm vật tư cần xuất tái sử dụng</p>
              <button
                onClick={() => {
                  setOutboundTargetItem(null);
                  setShowOutboundModal(true);
                }}
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                + Mở Bảng Chọn Xuất Kho
              </button>
            </div>
          )}

          {currentPage === 'search' && (
            <SmartSearch
              materials={materials}
              onSelectItem={(item) => setSelectedDetailItem(item)}
              onOpenOutbound={(item) => {
                setOutboundTargetItem(item);
                setShowOutboundModal(true);
              }}
              initialQuery={searchQuery}
              userRole={userRole}
            />
          )}

          {currentPage === 'projects' && (
            <ProjectManagement
              projects={projects}
              materials={materials}
              onSelectItem={(item) => setSelectedDetailItem(item)}
              onOpenOutbound={(item) => {
                setOutboundTargetItem(item);
                setShowOutboundModal(true);
              }}
              userRole={userRole}
            />
          )}

          {currentPage === 'qr' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-black">QR</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Trình Quét Mã QR Kho Vật Tư</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhận diện nhanh thông tin kích thước, màu sắc, vị trí kệ lưu trữ từ tem dán trên tấm vật tư.
              </p>
              <button
                onClick={() => setShowQRScannerModal(true)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-lg text-xs"
              >
                Mở Camera Quét QR Ngay
              </button>
            </div>
          )}

          {currentPage === 'savings' && (
            <SavingsAnalytics
              metrics={metrics}
              materials={materials}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsView
              materials={materials}
              transactions={transactions}
            />
          )}

          {currentPage === 'history' && (
            <HistoryLog
              transactions={transactions}
            />
          )}

          {currentPage === 'alerts' && (
            <AlertsView
              alerts={alerts}
              materials={materials}
              onNavigateToItem={(code) => {
                setSearchQuery(code);
                setCurrentPage('materials');
              }}
              onOpenOutbound={(item) => {
                setOutboundTargetItem(item);
                setShowOutboundModal(true);
              }}
              onRefreshAlerts={refreshData}
              userRole={userRole}
            />
          )}

        </main>

      </div>

      {/* Item Detail Modal */}
      {selectedDetailItem && (
        <ItemDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          onOpenOutbound={(item) => {
            setOutboundTargetItem(item);
            setShowOutboundModal(true);
          }}
          onPrintQR={(item) => setPrintQRTargetItem(item)}
          userRole={userRole}
        />
      )}

      {/* Outbound Action Modal */}
      {showOutboundModal && (
        <OutboundModal
          initialItem={outboundTargetItem}
          materials={materials}
          onClose={() => {
            setShowOutboundModal(false);
            setOutboundTargetItem(null);
          }}
          onSuccess={() => {
            refreshData();
          }}
          userRole={userRole}
        />
      )}

      {/* QR Code Camera Scanner Modal */}
      {showQRScannerModal && (
        <QRScannerModal
          materials={materials}
          onClose={() => setShowQRScannerModal(false)}
          onSelectItem={(item) => setSelectedDetailItem(item)}
          onOpenOutbound={(item) => {
            setOutboundTargetItem(item);
            setShowOutboundModal(true);
          }}
          userRole={userRole}
        />
      )}

      {/* Printable QR Label Sticker Modal */}
      {printQRTargetItem && (
        <QRLabelPrintModal
          item={printQRTargetItem}
          onClose={() => setPrintQRTargetItem(null)}
        />
      )}

    </div>
  );
}
