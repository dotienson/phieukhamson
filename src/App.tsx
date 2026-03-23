import React, { useState, useEffect } from 'react';
import { ClipboardCopy, FileText, User, Activity, Stethoscope, Syringe, Check, X, Languages, Loader2, Beaker, Thermometer, Zap, Droplets, Bone, HeartPulse, Download } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import html2pdf from 'html2pdf.js';
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

export default function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [showModal, setShowModal] = useState(false);
  const [reportVN, setReportVN] = useState<GeneratedReport | null>(null);
  const [reportEN, setReportEN] = useState<GeneratedReport | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedHistory, setCopiedHistory] = useState(false);
  const [copiedExam, setCopiedExam] = useState(false);
  const [activeTab, setActiveTab] = useState<'VN' | 'EN'>('VN');

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
    setState(prev => {
      const newState = { ...prev, [key]: value };
      
      // Auto-calculate MPH if relevant fields change
      if (key === 'fatherHeight' || key === 'motherHeight' || key === 'gender') {
        newState.mph = calculateMPH(newState.fatherHeight, newState.motherHeight, newState.gender);
      }

      // Update physical exam template if specialized type changes
      if (key === 'specializedExamType' && value) {
        // We no longer overwrite physicalExam with templates as we use structured fields
        // But we can still provide a default if it's empty
        if (!newState.physicalExam || newState.physicalExam === initialState.physicalExam) {
           // newState.physicalExam = SPECIALIZED_EXAM_TEMPLATES[value as string] || newState.physicalExam;
        }
      }
      
      return newState;
    });
  };

  const toggleArrayItem = (key: keyof AppState, item: string) => {
    setState(prev => {
      const arr = prev[key] as string[];
      if (arr.includes(item)) {
        return { ...prev, [key]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [key]: [...arr, item] };
      }
    });
  };

  const translateReport = async (vnReport: GeneratedReport) => {
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following pediatric endocrinology medical report from Vietnamese to English. 
        Follow the professional style of NHS UK (National Health Service). 
        Maintain the structure and all medical details accurately.
        
        History Part:
        ${vnReport.history}
        
        Examination Part:
        ${vnReport.examination}
        
        Return the result as a JSON object with two keys: "history" and "examination". Do not include markdown formatting.`,
        config: { responseMimeType: "application/json" }
      });
      
      try {
        const parsed = JSON.parse(response.text || '{}');
        setReportEN({
          history: parsed.history || 'Translation failed.',
          examination: parsed.examination || 'Translation failed.'
        });
      } catch (e) {
        setReportEN(generateReportEN(state)); // Fallback to manual translation
      }
    } catch (error) {
      console.error('Translation error:', error);
      setReportEN(generateReportEN(state)); // Fallback to manual translation
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerate = async () => {
    if (!state.pid) {
      alert("Vui lòng nhập mã PID trước khi tạo phiếu khám.");
      return;
    }
    const vnReport = generateReportVN(state);
    setReportVN(vnReport);
    setShowModal(true);
    setCopiedHistory(false);
    setCopiedExam(false);
    setActiveTab('VN');
    setReportEN(null);
    await translateReport(vnReport);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     `PhieuKham_${state.pid}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleCopy = async (text: string, type: 'history' | 'exam') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'history') {
        setCopiedHistory(true);
        setTimeout(() => setCopiedHistory(false), 2000);
      } else {
        setCopiedExam(true);
        setTimeout(() => setCopiedExam(false), 2000);
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

  return (
    <div className="min-h-screen bg-slate-50 py-4 px-3 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black tracking-tighter text-blue-900 uppercase italic">
            EndoCheckup <span className="text-blue-600">Dr.Son</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-px w-6 bg-blue-100"></div>
            <p className="text-xs text-blue-400 uppercase tracking-[0.4em] font-bold">Pediatric Endocrinology</p>
            <div className="h-px w-6 bg-blue-100"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 space-y-3">
            {/* HÀNH CHÍNH */}
            <Section title="Hành chính" icon={<User className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Họ và tên" value={state.name} onChange={e => updateState('name', e.target.value)} className="sm:col-span-2" />
                <Input label="PID *" value={state.pid} onChange={e => updateState('pid', e.target.value)} />
                
                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-bold text-blue-900 uppercase tracking-tight">Giới tính</label>
                  <div className="flex items-center gap-3 mt-0.5">
                    <Radio label="Nam" name="gender" checked={state.gender === 'Nam'} onChange={() => updateState('gender', 'Nam')} />
                    <Radio label="Nữ" name="gender" checked={state.gender === 'Nữ'} onChange={() => updateState('gender', 'Nữ')} />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-blue-900 block mb-0.5 uppercase tracking-tight">Ngày sinh (DD/MM/YYYY)</label>
                  <div className="flex gap-1.5">
                    <Input placeholder="DD" type="number" min="1" max="31" value={state.dobDay} onChange={e => updateState('dobDay', e.target.value)} className="w-12" />
                    <Input placeholder="MM" type="number" min="1" max="12" value={state.dobMonth} onChange={e => updateState('dobMonth', e.target.value)} className="w-12" />
                    <Input placeholder="YYYY" type="number" min="1900" max="2100" value={state.dobYear} onChange={e => updateState('dobYear', e.target.value)} className="w-20" />
                  </div>
                </div>
                
                <Input label="Ngày khám" type="date" value={state.examDate} onChange={e => updateState('examDate', e.target.value)} />
              </div>
            </Section>

            {/* LÝ DO & TIỀN SỬ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Section title="Lý do & Tiền sử" icon={<FileText className="h-3.5 w-3.5" />}>
                <div className="space-y-3">
                  <TextArea label="Lý do đến khám" value={state.reason} onChange={e => updateState('reason', e.target.value)} placeholder="Nhập lý do chi tiết..." />
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2.5">
                    <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Tiền sử & Thói quen</h4>
                    <div className="space-y-2">
                      <TextArea label="Quá trình bệnh sử" value={state.medicalHistoryProcess} onChange={e => updateState('medicalHistoryProcess', e.target.value)} rows={2} />
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

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2.5">
                    <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Sản khoa & Sơ sinh</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Con lần" type="number" min="1" max="10" value={state.birthOrder} onChange={e => updateState('birthOrder', e.target.value)} />
                      <Select label="Đẻ thường/mổ" value={state.deliveryMethod} onChange={e => updateState('deliveryMethod', e.target.value)} options={['', 'Đẻ thường', 'Đẻ mổ']} />
                      <Input label="Tuổi thai" suffix="w" type="number" min="20" max="45" value={state.gestationalWeeks} onChange={e => updateState('gestationalWeeks', e.target.value)} />
                      <Input label="Cân nặng" suffix="kg" type="number" step="0.1" min="0.1" max="10" value={state.birthWeight} onChange={e => updateState('birthWeight', e.target.value)} />
                      <Input label="Chiều dài" suffix="cm" type="number" step="0.1" min="20" max="70" value={state.birthLength} onChange={e => updateState('birthLength', e.target.value)} />
                      <div className="flex items-center pt-3">
                        <Checkbox label="Nhẹ cân (SGA)" checked={state.isSGA} onChange={e => updateState('isSGA', e.target.checked)} />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-black text-blue-900 uppercase">Thai kì của mẹ</label>
                        <Checkbox label="Không bất thường" checked={state.maternalHistoryNormal} onChange={e => updateState('maternalHistoryNormal', e.target.checked)} />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {MATERNAL_HISTORY_OPTS.map(opt => (
                          <Checkbox key={opt} label={opt} checked={state.maternalHistory.includes(opt)} onChange={() => toggleArrayItem('maternalHistory', opt)} disabled={state.maternalHistoryNormal} />
                        ))}
                      </div>
                      <Input placeholder="Bất thường khác..." value={state.maternalPregnancyOther} onChange={e => updateState('maternalPregnancyOther', e.target.value)} disabled={state.maternalHistoryNormal} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-black text-blue-900 uppercase">Siêu âm thai</label>
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
                          <label className="text-[11px] font-black text-blue-900 uppercase">Sàng lọc NIPS</label>
                          <Checkbox label="NA" checked={state.prenatalScreeningNIPSUnknown} onChange={e => updateState('prenatalScreeningNIPSUnknown', e.target.checked)} />
                        </div>
                        <select 
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-500 outline-none disabled:opacity-50"
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
                          <label className="text-[11px] font-black text-blue-900 uppercase">Máu gót chân</label>
                          <Checkbox label="NA" checked={state.heelPrickScreeningUnknown} onChange={e => updateState('heelPrickScreeningUnknown', e.target.checked)} />
                        </div>
                        <select 
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-500 outline-none disabled:opacity-50"
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
                        <label className="text-[11px] font-black text-blue-900 uppercase">Sơ sinh</label>
                        <Checkbox label="Không bất thường" checked={state.neonatalHistoryNormal} onChange={e => updateState('neonatalHistoryNormal', e.target.checked)} />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {NEONATAL_HISTORY_OPTS.map(opt => (
                          <Checkbox key={opt} label={opt} checked={state.neonatalHistory.includes(opt)} onChange={() => toggleArrayItem('neonatalHistory', opt)} disabled={state.neonatalHistoryNormal} />
                        ))}
                      </div>
                      <TextArea label="Ghi chú sơ sinh khác" value={state.neonatalHistoryOther} onChange={e => updateState('neonatalHistoryOther', e.target.value)} className="mt-1" disabled={state.neonatalHistoryNormal} />
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="Gia đình" icon={<Activity className="h-3.5 w-3.5" />}>
                <div className="grid grid-cols-2 gap-2.5">
                  <Input label="Chiều cao Bố" suffix="cm" type="number" min="100" max="250" value={state.fatherHeight} onChange={e => updateState('fatherHeight', e.target.value)} />
                  <Input label="Chiều cao Mẹ" suffix="cm" type="number" min="100" max="250" value={state.motherHeight} onChange={e => updateState('motherHeight', e.target.value)} />
                  <Input label="MPH (Tự động)" suffix="cm" type="number" value={state.mph} readOnly className="opacity-70" />
                  <Input label="Percentile" suffix="%" type="number" min="0" max="100" value={state.mphPercentile} onChange={e => updateState('mphPercentile', e.target.value)} />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Bệnh lý gia đình</label>
                    <Checkbox label="Không bất thường" checked={state.familyHistoryNormal} onChange={e => updateState('familyHistoryNormal', e.target.checked)} />
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {FAMILY_HISTORY_OPTS.map(opt => (
                      <Checkbox key={opt} label={opt} checked={state.familyHistory.includes(opt)} onChange={() => toggleArrayItem('familyHistory', opt)} disabled={state.familyHistoryNormal} />
                    ))}
                  </div>
                  <TextArea label="Ghi chú bệnh lý khác" value={state.familyHistoryOther} onChange={e => updateState('familyHistoryOther', e.target.value)} className="mt-2" disabled={state.familyHistoryNormal} />
                </div>
              </Section>
            </div>

            {/* KHÁM LÂM SÀNG */}
            <Section title="Khám lâm sàng" icon={<Stethoscope className="h-3.5 w-3.5" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Input label="Chiều cao" suffix="cm" type="number" step="0.1" min="30" max="250" value={state.height} onChange={e => updateState('height', e.target.value)} />
                  <Input label="Z-score H" type="number" step="0.01" min="-10" max="10" value={state.heightZ} onChange={e => updateState('heightZ', e.target.value)} />
                  <Input label="Cân nặng" suffix="kg" type="number" step="0.1" min="0.5" max="300" value={state.weight} onChange={e => updateState('weight', e.target.value)} />
                  <Input label="Z-score W" type="number" step="0.01" min="-10" max="10" value={state.weightZ} onChange={e => updateState('weightZ', e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextArea label="Khám Nội tiết" value={state.physicalExam} onChange={e => updateState('physicalExam', e.target.value)} rows={10} placeholder="Nhập kết quả khám nội tiết chi tiết..." />
                  
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-3">Tư vấn tăng trưởng</h4>
                    <div className="space-y-3">
                      <Input label="Tốc độ tăng cao" suffix="cm/năm" type="number" step="0.1" value={state.growthVelocity} onChange={e => updateState('growthVelocity', e.target.value)} />
                      <Select label="Đánh giá tăng trưởng" value={state.growthEvaluation} onChange={e => updateState('growthEvaluation', e.target.value)} options={['Bình thường', 'Chậm tăng trưởng', 'Tăng trưởng nhanh']} />
                    </div>
                  </div>
                </div>

                <TextArea
                  label="Ghi nhận thực thể khác"
                  placeholder="Mô tả các dấu hiệu khác..."
                  value={state.otherNotes}
                  onChange={e => updateState('otherNotes', e.target.value)}
                />
              </div>
            </Section>
          </div>

          {/* CẬN LÂM SÀNG & KẾT LUẬN (Sidebar on Desktop) */}
          <div className="lg:col-span-5 space-y-3">
            <Section title="Cận lâm sàng" icon={<Syringe className="h-3.5 w-3.5" />}>
              <div className="space-y-4">
                <div className="max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
                      <Beaker className="h-3 w-3 text-blue-900" />
                      <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest">Xét nghiệm máu & nước tiểu</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-1 pl-1">
                      {LAB_TESTS_GROUPED.flatMap(g => g.tests).map(test => (
                        <Checkbox key={test} label={test} checked={state.labTests.includes(test)} onChange={() => toggleArrayItem('labTests', test)} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
                      <FileText className="h-3 w-3 text-blue-900" />
                      <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest">Chẩn đoán hình ảnh</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-1 pl-1">
                      {IMAGING.map(img => (
                        <Checkbox key={img} label={img} checked={state.imaging.includes(img)} onChange={() => toggleArrayItem('imaging', img)} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
                      <Activity className="h-3 w-3 text-blue-900" />
                      <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest">Di truyền</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-1 pl-1">
                      {GENETICS.map(gen => (
                        <Checkbox key={gen} label={gen} checked={state.genetics.includes(gen)} onChange={() => toggleArrayItem('genetics', gen)} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-black text-blue-900 uppercase tracking-widest block">Xét nghiệm khác</label>
                    <Input placeholder="Xét nghiệm khác 1..." value={state.labTestsOther1} onChange={e => updateState('labTestsOther1', e.target.value)} />
                    <Input placeholder="Xét nghiệm khác 2..." value={state.labTestsOther2} onChange={e => updateState('labTestsOther2', e.target.value)} />
                  </div>
                </div>
              </div>
            </Section>

            {/* KẾT LUẬN & TƯ VẤN */}
            <Section title="Kết luận & Tư vấn" icon={<Check className="h-3.5 w-3.5" />}>
              <div className="space-y-3">
                <Input label="Chẩn đoán nghi ngờ" value={state.suspectedDiagnosis} onChange={e => updateState('suspectedDiagnosis', e.target.value)} placeholder="VD: Dậy thì sớm trung ương..." />
                <div className="grid grid-cols-1 gap-3">
                  <TextArea label="Tư vấn" value={state.counseling} onChange={e => updateState('counseling', e.target.value)} placeholder="Nội dung tư vấn..." />
                  <TextArea label="Kết luận" value={state.conclusion} onChange={e => updateState('conclusion', e.target.value)} placeholder="Hướng xử trí..." />
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={handleGenerate}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-900 px-4 py-3.5 text-white font-black shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all transform hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest text-xs"
                  >
                    <FileText className="h-4 w-4" />
                    TẠO PHIẾU KHÁM
                  </button>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[2rem] bg-white shadow-2xl flex flex-col max-h-[90vh] border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4 bg-slate-50">
              <div className="flex items-center gap-6">
                <h2 className="text-lg font-black text-blue-900 uppercase tracking-tighter italic">Kết quả phiếu khám</h2>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setActiveTab('VN')}
                    className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all uppercase tracking-widest ${activeTab === 'VN' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500 hover:text-blue-900'}`}
                  >
                    Tiếng Việt
                  </button>
                  <button 
                    onClick={() => setActiveTab('EN')}
                    disabled={isTranslating}
                    className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'EN' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500 hover:text-blue-900'} disabled:opacity-50`}
                  >
                    {isTranslating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Languages className="h-3 w-3" />}
                    English
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-900 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-8 bg-white" id="report-content">
              {activeTab === 'EN' && isTranslating ? (
                <div className="flex flex-col items-center justify-center h-80 gap-4" data-html2canvas-ignore>
                  <Loader2 className="h-12 w-12 text-blue-900 animate-spin" />
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-blue-900 italic">AI đang xử lý bản dịch...</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Phong cách NHS UK</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Bệnh sử */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Bệnh sử</h3>
                      <button
                        onClick={() => handleCopy(activeTab === 'VN' ? reportVN?.history || '' : reportEN?.history || '', 'history')}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black transition-all shadow-sm active:scale-95 uppercase tracking-widest ${copiedHistory ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        data-html2canvas-ignore
                      >
                        {copiedHistory ? <Check className="h-3 w-3" /> : <ClipboardCopy className="h-3 w-3" />}
                        {copiedHistory ? 'Đã copy' : 'Copy Bệnh sử'}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner leading-relaxed selection:bg-blue-100">
                      {activeTab === 'VN' ? reportVN?.history : reportEN?.history}
                    </pre>
                  </div>

                  {/* Khám lâm sàng */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Khám lâm sàng</h3>
                      <button
                        onClick={() => handleCopy(activeTab === 'VN' ? reportVN?.examination || '' : reportEN?.examination || '', 'exam')}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black transition-all shadow-sm active:scale-95 uppercase tracking-widest ${copiedExam ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        data-html2canvas-ignore
                      >
                        {copiedExam ? <Check className="h-3 w-3" /> : <ClipboardCopy className="h-3 w-3" />}
                        {copiedExam ? 'Đã copy' : 'Copy Lâm sàng'}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner leading-relaxed selection:bg-blue-100">
                      {activeTab === 'VN' ? reportVN?.examination : reportEN?.examination}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-100 px-8 py-4 flex justify-between items-center bg-slate-50">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {activeTab === 'EN' ? "Translated by Gemini AI • NHS UK Style" : "Original Vietnamese Document"}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                >
                  <Download className="h-4 w-4" />
                  Xuất PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-xs font-bold text-slate-400 hover:text-blue-900 transition-colors uppercase tracking-widest"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
