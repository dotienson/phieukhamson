import React, { useState, useEffect, useRef } from 'react';
import { ClipboardCopy, FileText, User, Activity, Stethoscope, Syringe, Check, X, Loader2, Beaker, Thermometer, Zap, Droplets, Bone, HeartPulse, Download, AlertCircle } from 'lucide-react';
import { AppState, initialState, Gender } from './types';
import { Input, Checkbox, Radio, Section, TextArea, Select } from './components/ui';
import { generateReportVN, generateReportEN, GeneratedReport } from './utils/generateReport';
import { 
  LAB_TESTS_GROUPED, IMAGING, GENETICS, 
  MATERNAL_PREGNANCY_OPTS, NEONATAL_HISTORY_OPTS, 
  FAMILY_HISTORY_OPTS, THYROID_OPTS, OTHER_SIGNS_OPTS,
  MATERNAL_HISTORY_OPTS, PRENATAL_ULTRASOUND_OPTS,
  PRENATAL_SCREENING_NIPS_OPTS, HEEL_PRICK_SCREENING_OPTS,
  SPECIALIZED_EXAM_TEMPLATES
} from './constants';

const CONSTRAINTS: Record<string, { min: number, max: number, name: string }> = {
  dobDay: { min: 1, max: 31, name: 'Ngày sinh' },
  dobMonth: { min: 1, max: 12, name: 'Tháng sinh' },
  dobYear: { min: 1900, max: 2026, name: 'Năm sinh' },
  gestationalWeeks: { min: 20, max: 42, name: 'Tuổi thai' },
  birthWeight: { min: 0.5, max: 10, name: 'Cân nặng sơ sinh' },
  birthOrder: { min: 1, max: 15, name: 'Con lần thứ' },
  height: { min: 30, max: 200, name: 'Chiều cao' },
  weight: { min: 1, max: 150, name: 'Cân nặng' },
  pubertyB: { min: 1, max: 5, name: 'Giai đoạn B' },
  pubertyP: { min: 1, max: 5, name: 'Giai đoạn P' },
  pubertySPL: { min: 1, max: 15, name: 'Chiều dài dương vật (SPL)' },
  pubertyTestisLeft: { min: 1, max: 30, name: 'Thể tích tinh hoàn trái' },
  pubertyTestisRight: { min: 1, max: 30, name: 'Thể tích tinh hoàn phải' },
  pubertyTanner: { min: 1, max: 5, name: 'Giai đoạn Tanner' },
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [showModal, setShowModal] = useState(false);
  const [reportVN, setReportVN] = useState<GeneratedReport | null>(null);
  const [reportEN, setReportEN] = useState<GeneratedReport | null>(null);
  const [copiedHistory, setCopiedHistory] = useState(false);
  const [copiedExam, setCopiedExam] = useState(false);
  const [copiedLabTests, setCopiedLabTests] = useState(false);
  const [copiedConclusion, setCopiedConclusion] = useState(false);
  const [activeTab, setActiveTab] = useState<'VN' | 'EN'>('VN');
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '8888') {
      setIsLocked(false);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const calculateMPH = (father: string, mother: string, gender: Gender) => {
    const f = parseFloat(father);
    const m = parseFloat(mother);
    if (isNaN(f) || isNaN(m) || !gender) return '';
    
    if (gender === 'Nam') {
      return ((f + m + 13) / 2).toFixed(1);
    } else {
      return ((f + m - 13) / 2).toFixed(1);
    }
  };

  const updateState = (key: keyof AppState, value: any) => {
    if (typeof value === 'string' && value !== '') {
      const numValue = parseFloat(value);
      const constraint = CONSTRAINTS[key as string];
      if (!isNaN(numValue) && constraint) {
        if (numValue > constraint.max) {
          showToast(`Cảnh báo: "${constraint.name}" tối đa là ${constraint.max}!`);
          return;
        }
        if (numValue < constraint.min) {
          showToast(`Cảnh báo: "${constraint.name}" tối thiểu là ${constraint.min}!`);
          // Không return ở đây để user có thể gõ tiếp (VD: gõ '1' để thành '15')
        }
      }
    }

    setState(prev => {
      let newValue = value;

      // Logic for specific fields
      if (key === 'name') {
        // Only allow letters and spaces (including Vietnamese characters)
        newValue = value.replace(/[^a-zA-ZÀ-ỹ\s]/g, '');
      }

      const newState = { ...prev, [key]: newValue };
      
      // Auto-calculate MPH if relevant fields change
      if (key === 'fatherHeight' || key === 'motherHeight' || key === 'gender') {
        newState.mph = calculateMPH(newState.fatherHeight, newState.motherHeight, newState.gender);
      }

      // Update physical exam template if specialized type changes
      if (key === 'specializedExamType') {
        // Always reset to template when type changes
        newState.physicalExam = SPECIALIZED_EXAM_TEMPLATES[value as string] || initialState.physicalExam;
      }
      
      return newState;
    });
  };

  const toggleArrayItem = (key: keyof AppState, item: string) => {
    setState(prev => {
      const arr = prev[key] as string[];
      let newArr = [...arr];
      
      if (arr.includes(item)) {
        newArr = newArr.filter(i => i !== item);
        // Automatic uncheck logic
        if (key === 'labTests') {
          if (item === 'GH tĩnh') newArr = newArr.filter(i => i !== 'GH động');
          if (item === 'GH động') newArr = newArr.filter(i => i !== 'GH tĩnh');
          if (item === 'Canxi toàn phần') newArr = newArr.filter(i => i !== 'Canxi ion hóa');
        }
      } else {
        newArr.push(item);
        // Automatic check logic
        if (key === 'labTests') {
          if (item === 'GH tĩnh' && !newArr.includes('GH động')) newArr.push('GH động');
          if (item === 'GH động' && !newArr.includes('GH tĩnh')) newArr.push('GH tĩnh');
          if (item === 'Canxi toàn phần' && !newArr.includes('Canxi ion hóa')) newArr.push('Canxi ion hóa');
        }
      }
      return { ...prev, [key]: newArr };
    });
  };

  const handleGenerate = async () => {
    if (!state.pid) {
      setError("Vui lòng nhập mã PID trước khi tạo phiếu khám.");
      return;
    }

    // Validate constraints before generating
    for (const [key, constraint] of Object.entries(CONSTRAINTS)) {
      const val = state[key as keyof AppState];
      if (val !== '' && val !== undefined && val !== null) {
        const numVal = parseFloat(val as string);
        if (!isNaN(numVal)) {
          if (numVal < constraint.min || numVal > constraint.max) {
            setError(`Vui lòng kiểm tra lại: "${constraint.name}" phải nằm trong khoảng từ ${constraint.min} đến ${constraint.max}.`);
            return;
          }
        }
      }
    }

    setError(null);
    const vnReport = generateReportVN(state);
    const enReport = generateReportEN(state);
    setReportVN(vnReport);
    setReportEN(enReport);
    setShowModal(true);
    setCopiedHistory(false);
    setCopiedExam(false);
    setCopiedLabTests(false);
    setCopiedConclusion(false);
    setActiveTab('VN');
  };

  const handleReset = () => {
    if (confirmReset) {
      setState(initialState);
      setError(null);
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const handleExportDoc = () => {
    const historyText = activeTab === 'VN' ? reportVN?.history : reportEN?.history;
    const examText = activeTab === 'VN' ? reportVN?.examination : reportEN?.examination;
    const labTestsText = activeTab === 'VN' ? reportVN?.labTests : reportEN?.labTests;
    const conclusionText = activeTab === 'VN' ? reportVN?.conclusion : reportEN?.conclusion;
    
    if (!historyText && !examText) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Phiếu khám</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
        h3 { font-size: 14pt; font-weight: bold; color: #1e3a8a; margin-bottom: 8px; }
        p { margin-top: 0; margin-bottom: 12px; }
        .section { margin-bottom: 24px; }
      </style>
      </head>
      <body>
        <div class="section">
          <h3>${activeTab === 'VN' ? 'BỆNH SỬ' : 'MEDICAL HISTORY'}</h3>
          <p>${historyText?.replace(/\n/g, '<br>') || ''}</p>
        </div>
        <div class="section">
          <h3>${activeTab === 'VN' ? 'KHÁM LÂM SÀNG' : 'PHYSICAL EXAMINATION'}</h3>
          <p>${examText?.replace(/\n/g, '<br>') || ''}</p>
        </div>
        <div class="section">
          <h3>${activeTab === 'VN' ? 'CẬN LÂM SÀNG' : 'LABORATORY TESTS'}</h3>
          <p>${labTestsText?.replace(/\n/g, '<br>') || ''}</p>
        </div>
        <div class="section">
          <h3>${activeTab === 'VN' ? 'KẾT LUẬN & TƯ VẤN' : 'CONCLUSION & COUNSELING'}</h3>
          <p>${conclusionText?.replace(/\n/g, '<br>') || ''}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const exportDateTime = now.toLocaleString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/[/:]/g, '-');
    
    const examDateStr = state.examDate.split('-').reverse().join('-');
    const filename = `BS Son kham ${state.name || 'Tre'} ${state.pid || 'PID'} ${examDateStr} ${exportDateTime}.doc`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (text: string, type: 'history' | 'exam' | 'labTests' | 'conclusion') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'history') {
        setCopiedHistory(true);
        setTimeout(() => setCopiedHistory(false), 2000);
      } else if (type === 'exam') {
        setCopiedExam(true);
        setTimeout(() => setCopiedExam(false), 2000);
      } else if (type === 'labTests') {
        setCopiedLabTests(true);
        setTimeout(() => setCopiedLabTests(false), 2000);
      } else if (type === 'conclusion') {
        setCopiedConclusion(true);
        setTimeout(() => setCopiedConclusion(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Chuyển hóa & Sinh hóa": return <Beaker className="h-3 w-3" />;
      case "Tuyến giáp": return <Thermometer className="h-3 w-3" />;
      case "Tăng trưởng & Tuyến yên": return <Zap className="h-3 w-3" />;
      case "Dậy thì & Sinh dục": return <HeartPulse className="h-3 w-3" />;
      case "Tuyến thượng thận": return <Droplets className="h-3 w-3" />;
      case "Xương & Khoáng chất": return <Bone className="h-3 w-3" />;
      default: return <Syringe className="h-3 w-3" />;
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[360px] bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border-2 border-white text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-pink-400 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Zap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-1.5 tracking-tight">Dr.Sunny Son</h1>
          <p className="text-sm font-bold text-slate-400 mb-8 tracking-wide">ESPE Clinical Fellow '25</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="****"
                className={`w-full px-6 py-3.5 rounded-2xl border-2 text-center text-2xl font-black tracking-[0.5em] focus:outline-none transition-all ${passwordError ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-100 bg-slate-50 focus:border-pink-300 focus:bg-white'}`}
                autoFocus
              />
              {passwordError && <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-widest">Mã bảo mật không đúng</p>}
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-2xl font-black uppercase tracking-[0.1em] text-sm shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Bắt đầu thăm khám
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-pink-200 selection:text-pink-900">
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="h-5 w-5" />
          {toastMessage}
        </div>
      )}
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <div className="inline-block mb-3 rounded-full bg-white px-4 py-1.5 shadow-sm border border-slate-100">
            <p className="text-xs text-pink-500 uppercase tracking-[0.2em] font-black">Phiếu khám chuyên khoa Nội tiết Nhi</p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800">
            EndoCheckup <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Dr.Son</span>
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          {/* HÀNH CHÍNH */}
          <Section title="Hành chính" icon={<User className="h-5 w-5" />}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Họ và tên" value={state.name} onChange={e => updateState('name', e.target.value)} />
              <Input label="PID *" value={state.pid} onChange={e => updateState('pid', e.target.value)} />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Giới tính</label>
                <div className="flex items-center gap-6 mt-1 bg-slate-50/50 p-3 rounded-xl border-2 border-slate-100">
                  <Radio label="Nam" name="gender" checked={state.gender === 'Nam'} onChange={() => updateState('gender', 'Nam')} />
                  <Radio label="Nữ" name="gender" checked={state.gender === 'Nữ'} onChange={() => updateState('gender', 'Nữ')} />
                </div>
              </div>
              
              <div>
                <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1 block mb-1.5">Ngày sinh (DD/MM/YYYY)</label>
                <div className="flex gap-3">
                  <Input placeholder="DD" type="number" min="1" max="31" value={state.dobDay} onChange={e => updateState('dobDay', e.target.value)} className="w-20" />
                  <Input placeholder="MM" type="number" min="1" max="12" value={state.dobMonth} onChange={e => updateState('dobMonth', e.target.value)} className="w-20" />
                  <Input placeholder="YYYY" type="number" min="2006" max="2026" value={state.dobYear} onChange={e => updateState('dobYear', e.target.value)} className="w-28" />
                </div>
              </div>
                
              <Input label="Ngày khám" type="date" value={state.examDate} onChange={e => updateState('examDate', e.target.value)} />
            </div>
          </Section>

            {/* LÝ DO & TIỀN SỬ */}
            <Section title="Lý do & Tiền sử" icon={<FileText className="h-5 w-5" />}>
              <div className="space-y-6">
                <TextArea label="Lý do đến khám" value={state.reason} onChange={e => updateState('reason', e.target.value)} placeholder="Nhập lý do chi tiết..." />
                
                <div className="bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100 space-y-4">
                  <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span> Tiền sử & Thói quen
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextArea className="sm:col-span-2" label="Quá trình bệnh sử" value={state.medicalHistoryProcess} onChange={e => updateState('medicalHistoryProcess', e.target.value)} rows={2} />
                    <Input label="Thói quen dinh dưỡng" value={state.nutritionHabits} onChange={e => updateState('nutritionHabits', e.target.value)} />
                    <Input label="Giấc ngủ" value={state.sleepHabits} onChange={e => updateState('sleepHabits', e.target.value)} />
                    <Input label="Thể thao - vận động" value={state.sportsActivity} onChange={e => updateState('sportsActivity', e.target.value)} />
                    <Input label="Học lực - Trí lực" value={state.academicAbility} onChange={e => updateState('academicAbility', e.target.value)} />
                    <Input label="Vi chất đang bổ sung" value={state.micronutrients} onChange={e => updateState('micronutrients', e.target.value)} />
                    <Input label="Bệnh mạn tính" value={state.chronicDiseases} onChange={e => updateState('chronicDiseases', e.target.value)} />
                    <Input label="Tiền sử dùng thuốc/bệnh kéo dài" value={state.prolongedMedication} onChange={e => updateState('prolongedMedication', e.target.value)} />
                    <Input label="Dị ứng - Mẫn cảm" value={state.allergies} onChange={e => updateState('allergies', e.target.value)} />
                  </div>
                </div>

                <div className="bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100 space-y-4">
                  <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span> Sản khoa & Sơ sinh
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Input label="Con lần" type="number" min="1" max="5" value={state.birthOrder} onChange={e => updateState('birthOrder', e.target.value)} />
                    <Select label="Đẻ thường/mổ" value={state.deliveryMethod} onChange={e => updateState('deliveryMethod', e.target.value)} options={['', 'Đẻ thường', 'Đẻ mổ']} />
                    <Input label="Tuổi thai" suffix="w" type="number" min="25" max="41" value={state.gestationalWeeks} onChange={e => updateState('gestationalWeeks', e.target.value)} />
                    <Input label="Cân nặng" suffix="kg" type="number" step="0.1" min="1" max="120" value={state.birthWeight} onChange={e => updateState('birthWeight', e.target.value)} />
                    <Input label="Chiều dài" suffix="cm" type="number" step="0.1" min="20" max="70" value={state.birthLength} onChange={e => updateState('birthLength', e.target.value)} />
                    <div className="flex items-center pt-6">
                      <Checkbox label="Nhẹ cân (SGA)" checked={state.isSGA} onChange={e => updateState('isSGA', e.target.checked)} />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Thai kì của mẹ</label>
                      <Checkbox label="Không bất thường" checked={state.maternalHistoryNormal} onChange={e => updateState('maternalHistoryNormal', e.target.checked)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MATERNAL_HISTORY_OPTS.map(opt => (
                        <Checkbox key={opt} label={opt} checked={state.maternalHistory.includes(opt)} onChange={() => toggleArrayItem('maternalHistory', opt)} disabled={state.maternalHistoryNormal} />
                      ))}
                    </div>
                    <Input placeholder="Bất thường khác..." value={state.maternalPregnancyOther} onChange={e => updateState('maternalPregnancyOther', e.target.value)} disabled={state.maternalHistoryNormal} />
                  </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Siêu âm thai</label>
                        <Checkbox label="Không bất thường" checked={state.prenatalUltrasoundNormal} onChange={e => updateState('prenatalUltrasoundNormal', e.target.checked)} />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {PRENATAL_ULTRASOUND_OPTS.map(opt => (
                          <Checkbox key={opt} label={opt} checked={state.prenatalUltrasound.includes(opt)} onChange={() => toggleArrayItem('prenatalUltrasound', opt)} disabled={state.prenatalUltrasoundNormal} />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Sàng lọc NIPS</label>
                          <Checkbox label="Chưa rõ thông tin" checked={state.prenatalScreeningNIPSUnknown} onChange={e => updateState('prenatalScreeningNIPSUnknown', e.target.checked)} />
                        </div>
                        <select 
                          className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-3.5 py-2.5 text-base text-slate-700 focus:border-pink-300 focus:bg-white outline-none disabled:opacity-50 transition-all"
                          value={state.prenatalScreeningNIPS}
                          onChange={e => updateState('prenatalScreeningNIPS', e.target.value)}
                          disabled={state.prenatalScreeningNIPSUnknown}
                        >
                          <option value="">Chọn...</option>
                          {PRENATAL_SCREENING_NIPS_OPTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Máu gót chân</label>
                          <Checkbox label="Chưa rõ thông tin" checked={state.heelPrickScreeningUnknown} onChange={e => updateState('heelPrickScreeningUnknown', e.target.checked)} />
                        </div>
                        <select 
                          className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-3.5 py-2.5 text-base text-slate-700 focus:border-pink-300 focus:bg-white outline-none disabled:opacity-50 transition-all"
                          value={state.heelPrickScreening}
                          onChange={e => updateState('heelPrickScreening', e.target.value)}
                          disabled={state.heelPrickScreeningUnknown}
                        >
                          <option value="">Chọn...</option>
                          {HEEL_PRICK_SCREENING_OPTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Sơ sinh</label>
                        <Checkbox label="Không bất thường" checked={state.neonatalHistoryNormal} onChange={e => updateState('neonatalHistoryNormal', e.target.checked)} />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {NEONATAL_HISTORY_OPTS.filter(opt => state.gender === 'Nữ' ? !['Dương vật nhỏ', 'Tinh hoàn ẩn'].includes(opt) : true).map(opt => (
                          <Checkbox key={opt} label={opt} checked={state.neonatalHistory.includes(opt)} onChange={() => toggleArrayItem('neonatalHistory', opt)} disabled={state.neonatalHistoryNormal} />
                        ))}
                      </div>
                      <TextArea label="Ghi chú sơ sinh khác" value={state.neonatalHistoryOther} onChange={e => updateState('neonatalHistoryOther', e.target.value)} className="mt-1" disabled={state.neonatalHistoryNormal} />
                    </div>
                  </div>
                </div>
            </Section>

            {/* KHÁM LÂM SÀNG */}
            <Section title="Khám lâm sàng" icon={<Stethoscope className="h-5 w-5" />}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Select 
                    label="Loại khám chuyên đề" 
                    value={state.specializedExamType} 
                    onChange={e => updateState('specializedExamType', e.target.value)} 
                    options={['', ...Object.keys(SPECIALIZED_EXAM_TEMPLATES)]} 
                  />
                </div>

                {state.specializedExamType === 'Khám béo phì' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-pink-50/30 p-5 rounded-xl border-2 border-pink-100">
                    <Checkbox label="Béo toàn thân" checked={state.obesityWholeBody} onChange={e => updateState('obesityWholeBody', e.target.checked)} />
                    <Checkbox label="Vẻ mặt Cushing" checked={state.obesityCushing} onChange={e => updateState('obesityCushing', e.target.checked)} />
                    <Checkbox label="Dấu hiệu gai đen" checked={state.obesityAcanthosis} onChange={e => updateState('obesityAcanthosis', e.target.checked)} />
                    <Checkbox label="Vết rạn da" checked={state.obesityStriae} onChange={e => updateState('obesityStriae', e.target.checked)} />
                    <Input label="Vòng bụng" suffix="cm" value={state.obesityAbdominalCircumference} onChange={e => updateState('obesityAbdominalCircumference', e.target.value)} />
                    <Input label="Huyết áp" suffix="mmHg" value={state.obesityBloodPressure} onChange={e => updateState('obesityBloodPressure', e.target.value)} />
                    <Input label="Tuổi bắt đầu tăng cân" value={state.obesityWeightGainAge} onChange={e => updateState('obesityWeightGainAge', e.target.value)} />
                    <Input label="Tiền sử dùng Corticoid" value={state.obesityCorticoidUse} onChange={e => updateState('obesityCorticoidUse', e.target.value)} />
                    <Input label="Bệnh mạn tính đi kèm" value={state.obesityChronicDisease} onChange={e => updateState('obesityChronicDisease', e.target.value)} />
                    <Checkbox label="Gia đình có người béo phì" checked={state.obesityFamilyOverweight} onChange={e => updateState('obesityFamilyOverweight', e.target.checked)} />
                    <Input label="Thời gian xem TV/ĐT" suffix="h/ngày" value={state.obesityScreenTime} onChange={e => updateState('obesityScreenTime', e.target.value)} />
                    <Input label="Đồ uống ngọt/Nước quả" value={state.obesitySweetDrinks} onChange={e => updateState('obesitySweetDrinks', e.target.value)} />
                    <Input label="Thời gian ngủ" suffix="h/ngày" value={state.obesitySleepTime} onChange={e => updateState('obesitySleepTime', e.target.value)} />
                    <Input label="Vận động/Thể thao" suffix="phút/ngày" value={state.obesityExercise} onChange={e => updateState('obesityExercise', e.target.value)} />
                    <div className="col-span-full grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      <Checkbox label="Ăn thưởng/phạt" checked={state.obesityRewardPunish} onChange={e => updateState('obesityRewardPunish', e.target.checked)} />
                      <Checkbox label="Ăn đa dạng" checked={state.obesityDiverseDiet} onChange={e => updateState('obesityDiverseDiet', e.target.checked)} />
                      <Checkbox label="Ăn chung gia đình" checked={state.obesityEatTogether} onChange={e => updateState('obesityEatTogether', e.target.checked)} />
                      <Checkbox label="Thường xuyên ăn hàng" checked={state.obesityEatOut} onChange={e => updateState('obesityEatOut', e.target.checked)} />
                      <Checkbox label="Thích fastfood" checked={state.obesityFastFood} onChange={e => updateState('obesityFastFood', e.target.checked)} />
                      <Checkbox label="Mang cơm trưa" checked={state.obesityBringLunch} onChange={e => updateState('obesityBringLunch', e.target.checked)} />
                      <Checkbox label="Ăn nhiều rau/quả" checked={state.obesityVegetablesFruits} onChange={e => updateState('obesityVegetablesFruits', e.target.checked)} />
                    </div>
                  </div>
                )}

                {state.specializedExamType === 'Khám tăng trưởng' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/30 p-5 rounded-xl border-2 border-emerald-100">
                    <Input label="Tỉ lệ thân mình" value={state.growthProportions} onChange={e => updateState('growthProportions', e.target.value)} />
                    <Input label="Tình trạng dậy thì" value={state.growthPuberty} onChange={e => updateState('growthPuberty', e.target.value)} />
                    <Checkbox label="Dị hình bất thường" checked={state.growthDysmorphism} onChange={e => updateState('growthDysmorphism', e.target.checked)} />
                  </div>
                )}

                {state.specializedExamType === 'Khám dậy thì nữ' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-violet-50/30 p-5 rounded-xl border-2 border-violet-100">
                    <div className="flex gap-2">
                      <Input label="B" type="number" min="1" max="3" value={state.pubertyB} onChange={e => updateState('pubertyB', e.target.value)} />
                      <Input label="P" type="number" min="1" max="3" value={state.pubertyP} onChange={e => updateState('pubertyP', e.target.value)} />
                    </div>
                    <Input label="Giai đoạn Tanner" type="number" min="1" max="5" value={state.pubertyTanner} onChange={e => updateState('pubertyTanner', e.target.value)} />
                    <Checkbox label="Mụn trứng cá" checked={state.pubertyAcne} onChange={e => updateState('pubertyAcne', e.target.checked)} />
                    <Checkbox label="Mùi cơ thể" checked={state.pubertyBodyOdor} onChange={e => updateState('pubertyBodyOdor', e.target.checked)} />
                    <Checkbox label="Bướu cổ" checked={state.pubertyGoiter} onChange={e => updateState('pubertyGoiter', e.target.checked)} />
                    <Checkbox label="Mảng cà phê sữa" checked={state.pubertyCafeAuLait} onChange={e => updateState('pubertyCafeAuLait', e.target.checked)} />
                  </div>
                )}

                {state.specializedExamType === 'Khám dậy thì nam' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-50/30 p-5 rounded-xl border-2 border-blue-100">
                    <Input label="SPL" suffix="cm" type="number" step="0.1" min="0" max="15" value={state.pubertySPL} onChange={e => updateState('pubertySPL', e.target.value)} />
                    <div className="flex gap-2">
                      <Input label="Tinh hoàn trái" suffix="mL" type="number" min="1" max="25" value={state.pubertyTestisLeft} onChange={e => updateState('pubertyTestisLeft', e.target.value)} />
                      <Input label="Tinh hoàn phải" suffix="mL" type="number" min="1" max="25" value={state.pubertyTestisRight} onChange={e => updateState('pubertyTestisRight', e.target.value)} />
                    </div>
                    <Input label="Giai đoạn Tanner" type="number" min="1" max="5" value={state.pubertyTanner} onChange={e => updateState('pubertyTanner', e.target.value)} />
                    <Checkbox label="Mụn trứng cá" checked={state.pubertyAcne} onChange={e => updateState('pubertyAcne', e.target.checked)} />
                    <Checkbox label="Mùi cơ thể" checked={state.pubertyBodyOdor} onChange={e => updateState('pubertyBodyOdor', e.target.checked)} />
                    <Checkbox label="Bướu cổ" checked={state.pubertyGoiter} onChange={e => updateState('pubertyGoiter', e.target.checked)} />
                    <Checkbox label="Mảng cà phê sữa" checked={state.pubertyCafeAuLait} onChange={e => updateState('pubertyCafeAuLait', e.target.checked)} />
                  </div>
                )}

                {state.specializedExamType === 'Khám lùn trẻ gái' && (
                  <div className="bg-rose-50/30 p-5 rounded-xl border-2 border-rose-100">
                    <TextArea label="Ghi nhận đặc biệt" value={state.turnerSpecialNotes} onChange={e => updateState('turnerSpecialNotes', e.target.value)} placeholder="Nhập các ghi nhận đặc biệt cho trẻ Turner..." />
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100">
                  <Input label="Chiều cao" suffix="cm" type="number" step="0.1" min="30" max="200" value={state.height} onChange={e => updateState('height', e.target.value)} />
                  <Input label="Z-score H" type="number" step="0.01" min="-10" max="10" value={state.heightZ} onChange={e => updateState('heightZ', e.target.value)} />
                  <Input label="Cân nặng" suffix="kg" type="number" step="0.1" min="1" max="120" value={state.weight} onChange={e => updateState('weight', e.target.value)} />
                  <Input label="Z-score W" type="number" step="0.01" min="-10" max="10" value={state.weightZ} onChange={e => updateState('weightZ', e.target.value)} />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <TextArea label="Khám Nội tiết" value={state.physicalExam} onChange={e => updateState('physicalExam', e.target.value)} rows={10} placeholder="Nhập kết quả khám nội tiết chi tiết..." />
                </div>

                <TextArea
                  label="Ghi nhận thực thể khác"
                  placeholder="Mô tả các dấu hiệu khác..."
                  value={state.otherNotes}
                  onChange={e => updateState('otherNotes', e.target.value)}
                />
              </div>
          </Section>

          {/* CẬN LÂM SÀNG & KẾT LUẬN */}
          <Section title="Cận lâm sàng" icon={<Syringe className="h-5 w-5" />}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3 bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100">
                  <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-3">
                    <Beaker className="h-4 w-4 text-pink-500" />
                    <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Xét nghiệm máu (1)</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {LAB_TESTS_GROUPED.slice(0, 2).flatMap(g => g.tests).map(test => (
                      <Checkbox key={test} label={test} checked={state.labTests.includes(test)} onChange={() => toggleArrayItem('labTests', test)} />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100">
                  <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-3">
                    <Beaker className="h-4 w-4 text-pink-500" />
                    <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Xét nghiệm máu (2)</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {LAB_TESTS_GROUPED.slice(2).flatMap(g => g.tests).map(test => (
                      <Checkbox key={test} label={test} checked={state.labTests.includes(test)} onChange={() => toggleArrayItem('labTests', test)} />
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="space-y-3 bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100">
                    <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-3">
                      <FileText className="h-4 w-4 text-sky-500" />
                      <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Chẩn đoán hình ảnh</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {IMAGING.filter(img => state.gender === 'Nữ' ? img !== 'Siêu âm Tinh hoàn' : true).map(img => (
                        <Checkbox key={img} label={img} checked={state.imaging.includes(img)} onChange={() => toggleArrayItem('imaging', img)} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100">
                    <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-3">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Di truyền</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {GENETICS.map(gen => (
                        <Checkbox key={gen} label={gen} checked={state.genetics.includes(gen)} onChange={() => toggleArrayItem('genetics', gen)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/50 p-5 rounded-xl border-2 border-slate-100">
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Xét nghiệm khác
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input placeholder="Xét nghiệm khác 1..." value={state.labTestsOther1} onChange={e => updateState('labTestsOther1', e.target.value)} />
                  <Input placeholder="Xét nghiệm khác 2..." value={state.labTestsOther2} onChange={e => updateState('labTestsOther2', e.target.value)} />
                  <Input placeholder="Xét nghiệm khác 3..." value={state.labTestsOther3} onChange={e => updateState('labTestsOther3', e.target.value)} />
                  <Input placeholder="Xét nghiệm khác 4..." value={state.labTestsOther4} onChange={e => updateState('labTestsOther4', e.target.value)} />
                  <Input placeholder="Xét nghiệm khác 5..." value={state.labTestsOther5} onChange={e => updateState('labTestsOther5', e.target.value)} />
                  <Input placeholder="Xét nghiệm khác 6..." value={state.labTestsOther6} onChange={e => updateState('labTestsOther6', e.target.value)} />
                  <Input placeholder="Xét nghiệm khác 7..." value={state.labTestsOther7} onChange={e => updateState('labTestsOther7', e.target.value)} />
                  <Input placeholder="Xét nghiệm khác 8..." value={state.labTestsOther8} onChange={e => updateState('labTestsOther8', e.target.value)} />
                </div>
              </div>
            </div>
          </Section>

          {/* KẾT LUẬN & TƯ VẤN */}
          <Section title="Kết luận & Tư vấn" icon={<Check className="h-5 w-5" />}>
            <div className="space-y-6">
              <Input label="Chẩn đoán nghi ngờ" value={state.suspectedDiagnosis} onChange={e => updateState('suspectedDiagnosis', e.target.value)} placeholder="VD: Dậy thì sớm trung ương..." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextArea label="Tư vấn" value={state.counseling} onChange={e => updateState('counseling', e.target.value)} placeholder="Nội dung tư vấn..." rows={4} />
                <TextArea label="Kết luận" value={state.conclusion} onChange={e => updateState('conclusion', e.target.value)} placeholder="Hướng xử trí..." rows={4} />
              </div>
            </div>
          </Section>

          <div className="pt-4 pb-12">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-pulse">
                <X className="h-5 w-5" />
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerate}
                className="flex-1 flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-5 text-white font-black shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:-translate-y-1 transition-all active:translate-y-0 uppercase tracking-widest text-sm"
              >
                <FileText className="h-5 w-5" />
                TẠO PHIẾU KHÁM
              </button>
              <button
                onClick={handleReset}
                className={`px-8 py-5 rounded-full border-2 font-black transition-all uppercase tracking-widest text-sm ${confirmReset ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
              >
                {confirmReset ? 'Xác nhận xóa?' : 'Xóa trắng'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[2rem] bg-white shadow-2xl flex flex-col max-h-[90vh] border-4 border-white overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-slate-100 px-8 py-5 bg-gradient-to-r from-pink-50 to-violet-50">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-black text-slate-700 uppercase tracking-wide">Kết quả phiếu khám</h2>
                <div className="flex bg-white p-1.5 rounded-2xl border-2 border-slate-100 shadow-sm">
                  <button 
                    onClick={() => setActiveTab('VN')}
                    className={`px-5 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'VN' ? 'bg-gradient-to-r from-pink-400 to-violet-400 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Tiếng Việt
                  </button>
                  <button 
                    onClick={() => setActiveTab('EN')}
                    className={`px-5 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'EN' ? 'bg-gradient-to-r from-pink-400 to-violet-400 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    English
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-full p-2.5 text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-sm transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-8 bg-slate-50/30 custom-scrollbar" id="report-content">
              <div className="space-y-6">
                  {/* Bệnh sử */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-400"></span> Bệnh sử
                      </h3>
                      <button
                        onClick={() => handleCopy(activeTab === 'VN' ? reportVN?.history || '' : reportEN?.history || '', 'history')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all shadow-sm active:scale-95 uppercase tracking-widest ${copiedHistory ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-pink-200 hover:text-pink-600'}`}
                        data-html2canvas-ignore
                      >
                        {copiedHistory ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                        {copiedHistory ? 'Đã copy' : 'Copy Bệnh sử'}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-[15px] text-slate-700 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm leading-relaxed selection:bg-pink-100">
                      {activeTab === 'VN' ? reportVN?.history : reportEN?.history}
                    </pre>
                  </div>

                  {/* Khám lâm sàng */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400"></span> Khám lâm sàng
                      </h3>
                      <button
                        onClick={() => handleCopy(activeTab === 'VN' ? reportVN?.examination || '' : reportEN?.examination || '', 'exam')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all shadow-sm active:scale-95 uppercase tracking-widest ${copiedExam ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-sky-200 hover:text-sky-600'}`}
                        data-html2canvas-ignore
                      >
                        {copiedExam ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                        {copiedExam ? 'Đã copy' : 'Copy Lâm sàng'}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-[15px] text-slate-700 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm leading-relaxed selection:bg-sky-100">
                      {activeTab === 'VN' ? reportVN?.examination : reportEN?.examination}
                    </pre>
                  </div>

                  {/* Cận lâm sàng */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Cận lâm sàng
                      </h3>
                      <button
                        onClick={() => handleCopy(activeTab === 'VN' ? reportVN?.labTests || '' : reportEN?.labTests || '', 'labTests')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all shadow-sm active:scale-95 uppercase tracking-widest ${copiedLabTests ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-emerald-200 hover:text-emerald-600'}`}
                        data-html2canvas-ignore
                      >
                        {copiedLabTests ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                        {copiedLabTests ? 'Đã copy' : 'Copy Cận lâm sàng'}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-[15px] text-slate-700 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm leading-relaxed selection:bg-emerald-100">
                      {activeTab === 'VN' ? reportVN?.labTests : reportEN?.labTests}
                    </pre>
                  </div>

                  {/* Kết luận & Tư vấn */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-400"></span> Kết luận & Tư vấn
                      </h3>
                      <button
                        onClick={() => handleCopy(activeTab === 'VN' ? reportVN?.conclusion || '' : reportEN?.conclusion || '', 'conclusion')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all shadow-sm active:scale-95 uppercase tracking-widest ${copiedConclusion ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-violet-200 hover:text-violet-600'}`}
                        data-html2canvas-ignore
                      >
                        {copiedConclusion ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                        {copiedConclusion ? 'Đã copy' : 'Copy Kết luận'}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-[15px] text-slate-700 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm leading-relaxed selection:bg-violet-100">
                      {activeTab === 'VN' ? reportVN?.conclusion : reportEN?.conclusion}
                    </pre>
                  </div>
                </div>
            </div>
            
            <div className="border-t-2 border-slate-100 px-8 py-5 flex justify-between items-center bg-white">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {activeTab === 'EN' ? "English Report" : "Original Vietnamese Document"}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-sm font-black text-slate-500 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest"
                >
                  Đóng
                </button>
                <button
                  onClick={handleExportDoc}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-black text-white bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 rounded-2xl shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all uppercase tracking-widest"
                >
                  <Download className="h-4 w-4" />
                  Xuất Word
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
