import { AppState } from '../types';
import {
  MATERNAL_HISTORY_OPTS,
  PRENATAL_ULTRASOUND_OPTS,
  NEONATAL_HISTORY_OPTS,
  FAMILY_HISTORY_OPTS
} from '../constants';

export interface GeneratedReport {
  history: string;
  examination: string;
  labTests: string;
  conclusion: string;
}

const formatNormal = (isNormal: boolean, opts: string[], selected: string[], other: string) => {
  if (isNormal) return `Không bất thường (Không ${opts.join(', ')})`;
  let res = selected.join(', ');
  if (other) res += (res ? ', ' : '') + other;
  return res || 'Không rõ';
};

export const generateReportVN = (data: AppState): GeneratedReport => {
  const dob = [data.dobDay, data.dobMonth, data.dobYear].filter(Boolean).join('/');
  const examDateFormatted = data.examDate ? data.examDate.split('-').reverse().join('-') : '...';
  
  let history = `Trẻ có mã PID ${data.pid || '...'}, giới ${data.gender || '...'}, ngày sinh ${dob || '...'}. Gia đình đưa trẻ đến khám ngày ${examDateFormatted} vì ${data.reason || '...'}. `;
  if (data.medicalHistoryProcess) history += `Quá trình bệnh sử: ${data.medicalHistoryProcess}. `;
  
  history += `Tiền sử ghi nhận: Con lần ${data.birthOrder || '...'}, ${data.deliveryMethod || 'đẻ ...'}, tuổi thai ${data.gestationalWeeks || '...'} tuần. `;
  
  history += `Thai kì mẹ: ${formatNormal(data.maternalHistoryNormal, MATERNAL_HISTORY_OPTS, data.maternalHistory, data.maternalPregnancyOther)}. `;
  history += `Siêu âm thai: ${formatNormal(data.prenatalUltrasoundNormal, PRENATAL_ULTRASOUND_OPTS, data.prenatalUltrasound, '')}. `;
  history += `Sàng lọc NIPS: ${data.prenatalScreeningNIPSUnknown ? 'Chưa có thông tin (Không rõ)' : (data.prenatalScreeningNIPS || '...')}. `;
  history += `Sàng lọc máu gót chân: ${data.heelPrickScreeningUnknown ? 'Chưa có thông tin (Không rõ)' : (data.heelPrickScreening || '...')}. `;
  
  let canNang = `${data.birthWeight || '...'} kg`;
  if (data.isSGA) canNang += ` (SGA)`;
  history += `Sơ sinh: Cân nặng lúc sinh ${canNang}, chiều dài ${data.birthLength || '...'} cm; ${formatNormal(data.neonatalHistoryNormal, NEONATAL_HISTORY_OPTS, data.neonatalHistory, data.neonatalHistoryOther)}. `;
  
  history += `Bố cao ${data.fatherHeight || '...'} cm. Mẹ cao ${data.motherHeight || '...'} cm. `;
  history += `Tiền sử gia đình: ${formatNormal(data.familyHistoryNormal, FAMILY_HISTORY_OPTS, data.familyHistory, data.familyHistoryOther)}. `;

  if (data.nutritionHabits) history += `Thói quen dinh dưỡng: ${data.nutritionHabits}. `;
  if (data.sleepHabits) history += `Giấc ngủ: ${data.sleepHabits}. `;
  if (data.sportsActivity) history += `Thể thao - vận động: ${data.sportsActivity}. `;
  if (data.academicAbility) history += `Học lực - Trí lực: ${data.academicAbility}. `;
  if (data.micronutrients) history += `Vi chất đang bổ sung: ${data.micronutrients}. `;
  history += `Bệnh mạn tính: ${data.chronicDiseases || 'Không - theo gia đình kể'}. `;
  history += `Tiền sử dùng thuốc/bệnh kéo dài: ${data.prolongedMedication || 'Hiện không dùng thuốc gì kéo dài, không táo bón, tiêu chảy, nôn kéo dài'}. `;
  history += `Dị ứng - Mẫn cảm: ${data.allergies || 'Chưa ghi nhận trước đó'}.`;
  
  // Remove trailing space if any
  history = history.trim();

  let examination = `Hiện tại trẻ cao ${data.height || '...'} cm (Z-score: ${data.heightZ || '...'}), cân nặng ${data.weight || '...'} kg (Z-score: ${data.weightZ || '...'}).`;
  
  // Thêm chi tiết khám chuyên đề
  if (data.specializedExamType === 'Khám béo phì') {
    examination += `\n- Béo toàn thân: ${data.obesityWholeBody ? 'Có' : 'Không'} | Cushing: ${data.obesityCushing ? 'Có' : 'Không'}
- Gai đen: ${data.obesityAcanthosis ? 'Có' : 'Không'} | Rạn da: ${data.obesityStriae ? 'Có' : 'Không'}
- Vòng bụng: ${data.obesityAbdominalCircumference || '...'} cm | Huyết áp: ${data.obesityBloodPressure || '...'} mmHg
- Tăng cân từ: ${data.obesityWeightGainAge || '...'} tuổi
- Corticoid: ${data.obesityCorticoidUse || 'Không'} | Bệnh mãn tính: ${data.obesityChronicDisease || 'Không'}
- Bố mẹ/ Anh chị em ruột thừa cân: ${data.obesityFamilyOverweight ? 'Có' : 'Không'}
- Bú mẹ: ${data.obesityBreastfeeding || '...'} | Ăn dặm lúc: ${data.obesityComplementaryFeedingAge || '...'} tháng
- Thời gian dùng điện thoại/TV mỗi ngày: ${data.obesityScreenTime || '...'} giờ
- Nước quả: ${data.obesitySweetDrinks || '...'} | Đồ uống ngọt: ${data.obesitySweetDrinks || '...'}
- Thời gian ngủ: ${data.obesitySleepTime || '...'} giờ | Tập luyện/vui chơi mỗi ngày: ${data.obesityExercise || '...'} phút
- Chế độ ăn: ăn thưởng/phạt: ${data.obesityRewardPunish ? 'Có' : 'Không'} | ăn đa dạng: ${data.obesityDiverseDiet ? 'Có' : 'Không'}
- ăn chung: ${data.obesityEatTogether ? 'Có' : 'Không'} | ăn hàng: ${data.obesityEatOut ? 'Có' : 'Không'} | fastfood: ${data.obesityFastFood ? 'Có' : 'Không'}
- mang cơm trưa: ${data.obesityBringLunch ? 'Có' : 'Không'} | ăn rau/hoa quả: ${data.obesityVegetablesFruits ? 'Có' : 'Không'}`;
  } else if (data.specializedExamType === 'Khám tăng trưởng') {
    examination += `\n- Tỉ lệ thân mình: ${data.growthProportions || '...'} | Dậy thì: ${data.growthPuberty || '...'}
- Dị hình bất thường: ${data.growthDysmorphism ? 'Có' : 'Không'}`;
  } else if (data.specializedExamType === 'Khám dậy thì nữ') {
    examination += `\n- B: ${data.pubertyB || '...'} | P: ${data.pubertyP || '...'}
- Mụn trứng cá: ${data.pubertyAcne ? 'Có' : 'Không'} | Mùi cơ thể: ${data.pubertyBodyOdor ? 'Có' : 'Không'}
- Bướu cổ: ${data.pubertyGoiter ? 'Có' : 'Không'} | Mảng cà phê sữa: ${data.pubertyCafeAuLait ? 'Có' : 'Không'}
- Tanner: ${data.pubertyTanner || '...'}`;
  } else if (data.specializedExamType === 'Khám dậy thì nam') {
    examination += `\n- SPL: ${data.pubertySPL || '...'} cm
- Tinh hoàn trái: ${data.pubertyTestisLeft || '...'} mL | Tinh hoàn phải: ${data.pubertyTestisRight || '...'} mL
- Mụn trứng cá: ${data.pubertyAcne ? 'Có' : 'Không'} | Mùi cơ thể: ${data.pubertyBodyOdor ? 'Có' : 'Không'}
- Bướu cổ: ${data.pubertyGoiter ? 'Có' : 'Không'} | Mảng cà phê sữa: ${data.pubertyCafeAuLait ? 'Có' : 'Không'}
- Tanner: ${data.pubertyTanner || '...'}`;
  } else if (data.specializedExamType === 'Khám lùn trẻ gái') {
    examination += `\n- Ghi nhận đặc biệt: ${data.turnerSpecialNotes || '...'}`;
  }

  if (data.physicalExam) {
    examination += `\n${data.physicalExam}`;
  }
  if (data.otherNotes) {
    examination += `\nGhi nhận thực thể khác: ${data.otherNotes}`;
  }

  // Cận lâm sàng
  const allLabTests = [
    ...data.labTests,
    data.labTestsOther1, data.labTestsOther2, data.labTestsOther3,
    data.labTestsOther4, data.labTestsOther5, data.labTestsOther6,
    data.labTestsOther7, data.labTestsOther8
  ].filter(Boolean);
  const allImaging = data.imaging || [];
  const allGenetics = data.genetics || [];
  
  const totalTests = allLabTests.length + allImaging.length + allGenetics.length;
  
  let labTests = `Tổng số xét nghiệm: ${totalTests}\n`;
  if (allLabTests.length > 0) labTests += `- Xét nghiệm máu & nước tiểu: ${allLabTests.join(', ')}\n`;
  if (allImaging.length > 0) labTests += `- Chẩn đoán hình ảnh: ${allImaging.join(', ')}\n`;
  if (allGenetics.length > 0) labTests += `- Xét nghiệm Gen/NST: ${allGenetics.join(', ')}\n`;

  // Kết luận & Tư vấn
  let conclusion = '';
  if (data.suspectedDiagnosis) conclusion += `Chẩn đoán sơ bộ: ${data.suspectedDiagnosis}\n`;
  if (data.conclusion) conclusion += `Kết luận: ${data.conclusion}\n`;
  if (data.counseling) conclusion += `Tư vấn: ${data.counseling}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  conclusion += `\n\nBác sĩ tạo phiếu khám: BS. Đỗ Tiến Sơn ${timeStr} ${dateStr}`;

  return { history, examination, labTests: labTests.trim(), conclusion: conclusion.trim() };
};

export const generateReportEN = (data: AppState): GeneratedReport => {
  const dob = [data.dobDay, data.dobMonth, data.dobYear].filter(Boolean).join('/');
  const examDateFormatted = data.examDate ? data.examDate.split('-').reverse().join('-') : '...';
  const gender = data.gender === 'Nam' ? 'Male' : data.gender === 'Nữ' ? 'Female' : '...';
  
  let history = `Child with PID ${data.pid || '...'}, gender ${gender}, DOB ${dob || '...'}. Family brought the child for examination on ${examDateFormatted} due to ${data.reason || '...'}. `;
  if (data.medicalHistoryProcess) history += `Medical history process: ${data.medicalHistoryProcess}. `;
  
  const deliveryEn = data.deliveryMethod === 'Đẻ thường' ? 'vaginal delivery' : data.deliveryMethod === 'Đẻ mổ' ? 'cesarean section' : 'delivery ...';
  history += `History noted: Parity ${data.birthOrder || '...'}, ${deliveryEn}, gestational age ${data.gestationalWeeks || '...'} weeks. `;
  
  const formatNormalEN = (isNormal: boolean, opts: string[], selected: string[], other: string) => {
    if (isNormal) return `No abnormalities (No ${opts.join(', ')})`;
    let res = selected.join(', ');
    if (other) res += (res ? ', ' : '') + other;
    return res || 'Unknown';
  };

  history += `Maternal pregnancy: ${formatNormalEN(data.maternalHistoryNormal, MATERNAL_HISTORY_OPTS, data.maternalHistory, data.maternalPregnancyOther)}. `;
  history += `Prenatal ultrasound: ${formatNormalEN(data.prenatalUltrasoundNormal, PRENATAL_ULTRASOUND_OPTS, data.prenatalUltrasound, '')}. `;
  history += `NIPS screening: ${data.prenatalScreeningNIPSUnknown ? 'No information available (Unknown)' : (data.prenatalScreeningNIPS || '...')}. `;
  history += `Heel prick screening: ${data.heelPrickScreeningUnknown ? 'No information available (Unknown)' : (data.heelPrickScreening || '...')}. `;
  
  let canNang = `${data.birthWeight || '...'} kg`;
  if (data.isSGA) canNang += ` (SGA)`;
  history += `Neonatal: Birth weight ${canNang}, birth length ${data.birthLength || '...'} cm; ${formatNormalEN(data.neonatalHistoryNormal, NEONATAL_HISTORY_OPTS, data.neonatalHistory, data.neonatalHistoryOther)}. `;
  
  history += `Father's height ${data.fatherHeight || '...'} cm. Mother's height ${data.motherHeight || '...'} cm. `;
  history += `Family history: ${formatNormalEN(data.familyHistoryNormal, FAMILY_HISTORY_OPTS, data.familyHistory, data.familyHistoryOther)}. `;

  if (data.nutritionHabits) history += `Nutrition habits: ${data.nutritionHabits}. `;
  if (data.sleepHabits) history += `Sleep habits: ${data.sleepHabits}. `;
  if (data.sportsActivity) history += `Sports and physical activity: ${data.sportsActivity}. `;
  if (data.academicAbility) history += `Academic and cognitive ability: ${data.academicAbility}. `;
  if (data.micronutrients) history += `Micronutrient supplements: ${data.micronutrients}. `;
  history += `Chronic diseases: ${data.chronicDiseases || 'None reported by family'}. `;
  history += `Prolonged medication/illness history: ${data.prolongedMedication || 'Currently not taking any prolonged medication, no prolonged constipation, diarrhea, or vomiting'}. `;
  history += `Allergies/Sensitivities: ${data.allergies || 'None previously recorded'}.`;
  
  history = history.trim();

  let examination = `Currently, the child is ${data.height || '...'} cm tall (Z-score: ${data.heightZ || '...'}), weighs ${data.weight || '...'} kg (Z-score: ${data.weightZ || '...'}).`;
  
  // Add specialized exam details (EN)
  if (data.specializedExamType === 'Khám béo phì') {
    examination += `\n- Whole body obesity: ${data.obesityWholeBody ? 'Yes' : 'No'} | Cushingoid features: ${data.obesityCushing ? 'Yes' : 'No'}
- Acanthosis nigricans: ${data.obesityAcanthosis ? 'Yes' : 'No'} | Striae: ${data.obesityStriae ? 'Yes' : 'No'}
- Abdominal circumference: ${data.obesityAbdominalCircumference || '...'} cm | Blood pressure: ${data.obesityBloodPressure || '...'} mmHg
- Weight gain from age: ${data.obesityWeightGainAge || '...'}
- Corticoid use: ${data.obesityCorticoidUse || 'No'} | Chronic disease: ${data.obesityChronicDisease || 'No'}
- Family history of overweight: ${data.obesityFamilyOverweight ? 'Yes' : 'No'}
- Breastfeeding: ${data.obesityBreastfeeding || '...'} | Complementary feeding age: ${data.obesityComplementaryFeedingAge || '...'} months
- Screen time per day: ${data.obesityScreenTime || '...'} hours
- Sweet drinks: ${data.obesitySweetDrinks || '...'}
- Sleep time: ${data.obesitySleepTime || '...'} hours | Exercise/play per day: ${data.obesityExercise || '...'} minutes
- Diet: reward/punishment: ${data.obesityRewardPunish ? 'Yes' : 'No'} | diverse diet: ${data.obesityDiverseDiet ? 'Yes' : 'No'}
- Eat together: ${data.obesityEatTogether ? 'Yes' : 'No'} | Eat out: ${data.obesityEatOut ? 'Yes' : 'No'} | Fast food: ${data.obesityFastFood ? 'Yes' : 'No'}
- Bring lunch: ${data.obesityBringLunch ? 'Yes' : 'No'} | Vegetables/Fruits: ${data.obesityVegetablesFruits ? 'Yes' : 'No'}`;
  } else if (data.specializedExamType === 'Khám tăng trưởng') {
    examination += `\n- Body proportions: ${data.growthProportions || '...'} | Puberty status: ${data.growthPuberty || '...'}
- Dysmorphism: ${data.growthDysmorphism ? 'Yes' : 'No'}`;
  } else if (data.specializedExamType === 'Khám dậy thì nữ') {
    examination += `\n- B: ${data.pubertyB || '...'} | P: ${data.pubertyP || '...'}
- Acne: ${data.pubertyAcne ? 'Yes' : 'No'} | Body odor: ${data.pubertyBodyOdor ? 'Yes' : 'No'}
- Goiter: ${data.pubertyGoiter ? 'Yes' : 'No'} | Cafe-au-lait spots: ${data.pubertyCafeAuLait ? 'Yes' : 'No'}
- Tanner stage: ${data.pubertyTanner || '...'}`;
  } else if (data.specializedExamType === 'Khám dậy thì nam') {
    examination += `\n- SPL: ${data.pubertySPL || '...'} cm
- Left testis: ${data.pubertyTestisLeft || '...'} mL | Right testis: ${data.pubertyTestisRight || '...'} mL
- Acne: ${data.pubertyAcne ? 'Yes' : 'No'} | Body odor: ${data.pubertyBodyOdor ? 'Yes' : 'No'}
- Goiter: ${data.pubertyGoiter ? 'Yes' : 'No'} | Cafe-au-lait spots: ${data.pubertyCafeAuLait ? 'Yes' : 'No'}
- Tanner stage: ${data.pubertyTanner || '...'}`;
  } else if (data.specializedExamType === 'Khám lùn trẻ gái') {
    examination += `\n- Special notes: ${data.turnerSpecialNotes || '...'}`;
  }

  if (data.physicalExam) {
    examination += `\n${data.physicalExam}`;
  }
  if (data.otherNotes) {
    examination += `\nOther physical findings: ${data.otherNotes}`;
  }

  // Cận lâm sàng (EN)
  const allLabTests = [
    ...data.labTests,
    data.labTestsOther1, data.labTestsOther2, data.labTestsOther3,
    data.labTestsOther4, data.labTestsOther5, data.labTestsOther6,
    data.labTestsOther7, data.labTestsOther8
  ].filter(Boolean);
  const allImaging = data.imaging || [];
  const allGenetics = data.genetics || [];
  
  const totalTests = allLabTests.length + allImaging.length + allGenetics.length;
  
  let labTests = `Total number of tests: ${totalTests}\n`;
  if (allLabTests.length > 0) labTests += `- Blood & Urine tests: ${allLabTests.join(', ')}\n`;
  if (allImaging.length > 0) labTests += `- Imaging: ${allImaging.join(', ')}\n`;
  if (allGenetics.length > 0) labTests += `- Genetics/Karyotype: ${allGenetics.join(', ')}\n`;

  // Kết luận & Tư vấn (EN)
  let conclusion = '';
  if (data.suspectedDiagnosis) conclusion += `Preliminary diagnosis: ${data.suspectedDiagnosis}\n`;
  if (data.conclusion) conclusion += `Conclusion: ${data.conclusion}\n`;
  if (data.counseling) conclusion += `Counseling: ${data.counseling}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  conclusion += `\n\nExam report created by: Dr. Do Tien Son ${timeStr} ${dateStr}`;

  return { history, examination, labTests: labTests.trim(), conclusion: conclusion.trim() };
};
