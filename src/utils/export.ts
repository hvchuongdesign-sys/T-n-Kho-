import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { MaterialItem, InventoryTransaction } from '../types';
import { formatVND } from './storage';

export function exportMaterialsToExcel(materials: MaterialItem[], fileName = 'Danh_Muc_Vat_Tu_Du.xlsx') {
  const data = materials.map((m, index) => ({
    'STT': index + 1,
    'Mã Vật Tư': m.code,
    'Tên Vật Tư': m.name,
    'Chủng Loại': m.category,
    'Màu Sắc': m.color,
    'Độ Dày': m.thickness,
    'Quy Cách Gốc': m.originalSpec,
    'Dài (mm)': m.lengthMm,
    'Rộng (mm)': m.widthMm,
    'Diện Tích (m²)': m.areaM2,
    'Số Lượng': m.quantity,
    'Đơn Vi Tính': m.unit,
    'Tình Trạng': m.condition,
    'Vị Trí Kho': m.location,
    'Công Trình Nguồn': m.sourceProject,
    'Khách Hàng': m.clientName,
    'Nhà Cung Cấp': m.supplier,
    'Ngày Nhập Kho': m.importDate,
    'Giá Trị Ước Tính (VNĐ)': m.unitPriceEstimate * m.areaM2 * m.quantity,
    'Ghi Chú': m.notes
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Kho_Vat_Tu_Du');
  
  // Save file
  XLSX.writeFile(workbook, fileName);
}

export function exportTransactionsToExcel(transactions: InventoryTransaction[], fileName = 'Lich_Su_Kho_Vat_Tu.xlsx') {
  const data = transactions.map((t, index) => ({
    'STT': index + 1,
    'Mã Vật Tư': t.itemCode,
    'Tên Vật Tư': t.itemName,
    'Loại Giao Dịch': t.type === 'inbound' ? 'Nhập kho' : t.type === 'outbound' ? 'Xuất kho' : 'Cập nhật',
    'Số Lượng': t.quantity,
    'Diện Tích (m²)': t.areaM2,
    'Người Thực Hiện': t.staffName,
    'Vai Trò': t.role,
    'Công Trình': t.projectName,
    'Khách Hàng': t.clientName,
    'Vị Trí Kho': t.location || '-',
    'Thời Gian': t.timestamp,
    'Ghi Chú': t.notes
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lich_Su_Giao_Dich');
  
  XLSX.writeFile(workbook, fileName);
}

export function exportReportToPDF(title: string, materials: MaterialItem[], fileName = 'Bao_Cao_Kho_Vat_Tu.pdf') {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text('CÔNG TY CỔ PHẦN QUẢNG CÁO & NỘI THẤT', 14, 15);
  doc.setFontSize(12);
  doc.text('BÁO CÁO KHO VẬT TƯ DƯ TẬN DỤNG', 14, 23);
  doc.setFontSize(10);
  doc.text(`Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`, 14, 29);
  
  let y = 38;
  doc.line(14, y - 4, 196, y - 4);

  // Summary Metrics
  const totalItems = materials.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalArea = materials.reduce((acc, curr) => acc + (curr.areaM2 * curr.quantity), 0);
  const totalVal = materials.reduce((acc, curr) => acc + (curr.unitPriceEstimate * curr.areaM2 * curr.quantity), 0);

  doc.setFontSize(10);
  doc.text(`Tổng số lượng tồn: ${totalItems} tấm/cuộn`, 14, y);
  doc.text(`Tổng diện tích: ${totalArea.toFixed(2)} m2`, 80, y);
  doc.text(`Giá trị ước tính: ${formatVND(totalVal)}`, 140, y);

  y += 10;
  doc.line(14, y - 4, 196, y - 4);
  
  // Table Header
  y += 5;
  doc.setFontSize(9);
  doc.text('STT', 14, y);
  doc.text('Mã', 25, y);
  doc.text('Tên vật tư', 45, y);
  doc.text('KT (mm)', 95, y);
  doc.text('Màu', 125, y);
  doc.text('Vị trí', 150, y);
  doc.text('SL', 180, y);
  
  y += 4;
  doc.line(14, y, 196, y);

  // Table Body
  y += 6;
  materials.slice(0, 25).forEach((m, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${idx + 1}`, 14, y);
    doc.text(m.code, 25, y);
    doc.text(m.name.length > 22 ? m.name.substring(0, 20) + '...' : m.name, 45, y);
    doc.text(`${m.lengthMm}x${m.widthMm}`, 95, y);
    doc.text(m.color, 125, y);
    doc.text(m.location, 150, y);
    doc.text(`${m.quantity}`, 180, y);
    y += 7;
  });

  // Footer
  doc.setFontSize(9);
  doc.text('Người lập báo cáo: ____________________', 120, 280);

  doc.save(fileName);
}
