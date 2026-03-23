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
}

const formatNormal = (isNormal: boolean, opts: string[], selected: string[], other: string) => {
  if (isNormal) return `Không bất thường (Không ${opts.join(', ')})`;
  let res = selected.join(', ');
  if (other) res += (res ? ', ' : '') + other;
  return res || 'Không rõ';
};

export const generateReportVN = (data: AppState): GeneratedReport => {
  const dob = [data.dobDay, data.dobMonth, data.dobYear].filter(Boolean).join('/');
  
  let history = `Trẻ có mã PID ${data.pid || '...'}, giới ${data.gender || '...'}, ngày sinh ${dob || '...'}. Gia đình đưa trẻ đến khám vì ${data.reason || '...'}. `;
  if (data.medicalHistoryProcess) history += `Quá trình bệnh sử: ${data.medicalHistoryProcess}. `;
  
  history += `Tiền sử ghi nhận: Con lần ${data.birthOrder || '...'}, ${data.deliveryMethod || 'đẻ ...'}, tuổi thai ${data.gestationalWeeks || '...'} tuần. `;
  
  history += `Thai kì mẹ: ${formatNormal(data.maternalHistoryNormal, MATERNAL_HISTORY_OPTS, data.maternalHistory, data.maternalPregnancyOther)}. `;
  history += `Siêu âm thai: ${formatNormal(data.prenatalUltrasoundNormal, PRENATAL_ULTRASOUND_OPTS, data.prenatalUltrasound, '')}. `;
  history += `Sàng lọc NIPS: ${data.prenatalScreeningNIPSUnknown ? 'NA (Không rõ)' : (data.prenatalScreeningNIPS || '...')}. `;
  history += `Sàng lọc máu gót chân: ${data.heelPrickScreeningUnknown ? 'NA (Không rõ)' : (data.heelPrickScreening || '...')}. `;
  
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
  if (data.physicalExam) {
    examination += `\n${data.physicalExam}`;
  }
  if (data.otherNotes) {
    examination += `\nGhi nhận thực thể khác: ${data.otherNotes}`;
  }

  return { history, examination };
};

export const generateReportEN = (data: AppState): GeneratedReport => {
  const dob = [data.dobDay, data.dobMonth, data.dobYear].filter(Boolean).join('/');
  const gender = data.gender === 'Nam' ? 'Male' : data.gender === 'Nữ' ? 'Female' : '...';
  
  let history = `Child with PID ${data.pid || '...'}, gender ${gender}, DOB ${dob || '...'}. Family brought the child for examination due to ${data.reason || '...'}. `;
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
  history += `NIPS screening: ${data.prenatalScreeningNIPSUnknown ? 'NA (Unknown)' : (data.prenatalScreeningNIPS || '...')}. `;
  history += `Heel prick screening: ${data.heelPrickScreeningUnknown ? 'NA (Unknown)' : (data.heelPrickScreening || '...')}. `;
  
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
  if (data.physicalExam) {
    examination += `\n${data.physicalExam}`;
  }
  if (data.otherNotes) {
    examination += `\nOther physical findings: ${data.otherNotes}`;
  }

  return { history, examination };
};
