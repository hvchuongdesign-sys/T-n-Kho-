import React, { useState } from 'react';
import { 
  PackagePlus, 
  Plus, 
  Upload, 
  MapPin, 
  Calculator, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Camera,
  X
} from 'lucide-react';
import { MaterialItem, MaterialCategory, MaterialGroup, MaterialCondition } from '../types';
import { COLOR_OPTIONS, WAREHOUSE_LOCATIONS } from '../data/initialData';
import { 
  generateItemCode, 
  calculateAreaM2, 
  addMaterial, 
  addCustomColor, 
  getCustomColors,
  generateQRCodeDataUrl 
} from '../utils/storage';

interface InboundFormProps {
  onSuccess: (item: MaterialItem) => void;
  onCancel: () => void;
}

export const InboundForm: React.FC<InboundFormProps> = ({ onSuccess, onCancel }) => {
  const [category, setCategory] = useState<MaterialCategory>('Mica');
  const [group, setGroup] = useState<MaterialGroup>('Tấm phẳng');
  const [name, setName] = useState('Mica Đỏ 3mm');
  const [supplier, setSupplier] = useState('Mica Chochen');
  const [unit, setUnit] = useState('Tấm');
  const [thickness, setThickness] = useState('3mm');
  const [originalSpec, setOriginalSpec] = useState('1220x2440mm');

  // Colors
  const [color, setColor] = useState('Đỏ');
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [newColorInput, setNewColorInput] = useState('');
  const [customColorsList, setCustomColorsList] = useState<string[]>(getCustomColors());

  // Dimensions & Quantities
  const [lengthMm, setLengthMm] = useState<number>(450);
  const [widthMm, setWidthMm] = useState<number>(800);
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPriceEstimate, setUnitPriceEstimate] = useState<number>(320000);

  // Condition & Location
  const [condition, setCondition] = useState<MaterialCondition>('Đã cắt 1 lần');
  const [location, setLocation] = useState('Kệ A1');

  // Source Project & Client
  const [sourceProject, setSourceProject] = useState('Trà Sữa ABC');
  const [clientName, setClientName] = useState('Nguyễn Văn Hùng');
  const [inboundStaff, setInboundStaff] = useState('Nguyễn Văn Minh (Thủ kho)');
  const [notes, setNotes] = useState('Cắt dư sau khi làm biển hiệu trà sữa, tấm đẹp sắc nét.');

  // Photo
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80');

  // Calculated Area
  const computedAreaM2 = calculateAreaM2(lengthMm, widthMm);

  // Auto-suggest name on Category change
  const handleCategoryChange = (newCat: MaterialCategory) => {
    setCategory(newCat);
    if (newCat === 'Mica') {
      setName('Mica Đỏ 3mm');
      setSupplier('Mica Chochen');
      setThickness('3mm');
      setUnit('Tấm');
      setOriginalSpec('1220x2440mm');
      setUnitPriceEstimate(320000);
    } else if (newCat === 'Alu') {
      setName('Alu Đen Alucobest 3mm');
      setSupplier('Alucobest');
      setThickness('3mm');
      setUnit('Tấm');
      setOriginalSpec('1220x2440mm');
      setUnitPriceEstimate(210000);
    } else if (newCat === 'Fomex') {
      setName('Fomex Trắng 5mm EV');
      setSupplier('Formex EV');
      setThickness('5mm');
      setUnit('Tấm');
      setOriginalSpec('1220x2440mm');
      setUnitPriceEstimate(140000);
    } else if (newCat === 'Decal') {
      setName('Decal Dán Kính');
      setSupplier('Avery Dennison');
      setThickness('2mm');
      setUnit('m');
      setGroup('Cuộn');
      setOriginalSpec('1200x50000mm');
      setUnitPriceEstimate(65000);
    }
  };

  const handleAddNewColor = () => {
    if (newColorInput.trim()) {
      addCustomColor(newColorInput.trim());
      setCustomColorsList(getCustomColors());
      setColor(newColorInput.trim());
      setNewColorInput('');
      setShowAddColorModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCode = generateItemCode(category);
    const today = new Date().toISOString().substring(0, 10);

    const newItem: MaterialItem = {
      id: 'mat-' + Date.now(),
      code: newCode,
      name,
      category,
      group,
      supplier,
      unit,
      thickness,
      originalSpec,
      color,
      lengthMm,
      widthMm,
      areaM2: computedAreaM2,
      lengthM: Number((lengthMm / 1000).toFixed(2)),
      quantity,
      unitPriceEstimate,
      condition,
      location,
      importDate: today,
      createdDate: today,
      sourceProject,
      clientName,
      inboundStaff,
      imageUrl,
      images: [imageUrl],
      notes,
      status: 'available'
    };

    // Generate QR Code URL
    const qrData = JSON.stringify({
      code: newCode,
      name: newItem.name,
      spec: `${lengthMm}x${widthMm}mm`,
      color: newItem.color,
      loc: newItem.location
    });
    newItem.qrCodeUrl = await generateQRCodeDataUrl(qrData);

    // Save item
    addMaterial(newItem);

    onSuccess(newItem);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Nhập Kho Vật Tư Dư Sau Cắt</h1>
            <p className="text-xs text-slate-500">
              Nhập nhanh nguyên liệu xén dư từ các đơn hàng để lưu thông tin, in tem QR Code & quản lý vị trí kệ
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          Hủy bỏ
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Step 1: Project & Client Origin */}
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Nguồn Gốc Đơn Hàng & Công Trình</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Công Trình Nguồn <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={sourceProject}
                onChange={(e) => setSourceProject(e.target.value)}
                placeholder="Ví dụ: Trà Sữa ABC, VinFast..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên Khách Hàng</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Tên khách / Công ty..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nhân Viên Nhập Kho</label>
              <input
                type="text"
                value={inboundStaff}
                onChange={(e) => setInboundStaff(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Material Info */}
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Thông Tin Vật Tư Dư</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chủng Loại <span className="text-rose-500">*</span></label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as MaterialCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mica">Mica</option>
                <option value="Alu">Alu (Aluminum)</option>
                <option value="Fomex">Fomex</option>
                <option value="Decal">Decal / Bạt</option>
                <option value="MDF / Gỗ">MDF / Gỗ</option>
                <option value="PVC / Poly">PVC / Polycarbonat</option>
                <option value="Canvas / Hiflex">Canvas / Hiflex</option>
                <option value="Khác">Vật tư khác</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên Vật Tư Chi Tiết <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Mica Đỏ 3mm Chochen..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nhà Cung Cấp</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Mica Chochen, Alucobest..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Độ Dày</label>
              <select
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2mm">2mm</option>
                <option value="3mm">3mm</option>
                <option value="5mm">5mm</option>
                <option value="8mm">8mm</option>
                <option value="10mm">10mm</option>
                <option value="15mm">15mm</option>
                <option value="20mm">20mm</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quy Cách Gốc</label>
              <input
                type="text"
                value={originalSpec}
                onChange={(e) => setOriginalSpec(e.target.value)}
                placeholder="1220x2440mm..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
              />
            </div>

            {/* Colors Selection & Custom Add */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Màu Sắc <span className="text-rose-500">*</span></label>
                <button
                  type="button"
                  onClick={() => setShowAddColorModal(true)}
                  className="text-[11px] text-blue-600 font-semibold hover:underline"
                >
                  + Thêm màu mới
                </button>
              </div>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COLOR_OPTIONS.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
                {customColorsList.map(c => (
                  <option key={c} value={c}>🌈 {c} (Màu mới)</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Step 3: Remaining Dimensions & Auto Area Calc */}
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Kích Thước Cắt Còn Lại & Tự Tính Diện Tích</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dài (mm) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                required
                min={10}
                value={lengthMm}
                onChange={(e) => setLengthMm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rộng (mm) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                required
                min={10}
                value={widthMm}
                onChange={(e) => setWidthMm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số Lượng</label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Calculated Area Display Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-emerald-600 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" />
                <span>Tự Động Tính Diện Tích</span>
              </span>
              <span className="text-xl font-black text-emerald-800 font-mono mt-0.5">
                {computedAreaM2} m²
              </span>
              <span className="text-[10px] text-emerald-600">
                ({(lengthMm / 1000).toFixed(2)}m × {(widthMm / 1000).toFixed(2)}m)
              </span>
            </div>

          </div>
        </div>

        {/* Step 4: Condition, Location & Photo */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
            <span>Tình Trạng, Vị Trí Kệ & Hình Ảnh</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tình Trạng Vật Tư</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as MaterialCondition)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mới">Mới (Cắt góc lỡ)</option>
                <option value="Đã cắt 1 lần">Đã cắt 1 lần</option>
                <option value="Đã cắt nhiều lần">Đã cắt nhiều lần</option>
                <option value="Méo góc">Méo góc</option>
                <option value="Trầy nhẹ">Trầy nhẹ màng che</option>
                <option value="Chỉ dùng chi tiết nhỏ">Chỉ dùng chi tiết nhỏ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vị Trí Lưu Kho <span className="text-rose-500">*</span></label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {WAREHOUSE_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">URL Ảnh Thực Tế Vật Tư</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1">Ghi Chú Chi Tiết</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm về chất lượng, đặc điểm tấm..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu Vật Tư & Tạo Nhãn QR</span>
          </button>
        </div>

      </form>

      {/* Modal Add Custom Color */}
      {showAddColorModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Thêm Màu Sắc Vật Tư Mới</h3>
              <button onClick={() => setShowAddColorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Màu Sắc Mới</label>
              <input
                type="text"
                autoFocus
                value={newColorInput}
                onChange={(e) => setNewColorInput(e.target.value)}
                placeholder="Ví dụ: Xanh Ngọc, Ánh Kim, Cam Nhạt..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddColorModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddNewColor}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Lưu Màu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
