export type Gender = 'Nam' | 'Nữ' | '';

export interface AppState {
  // Hành chính
  name: string;
  pid: string;
  gender: Gender;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  examDate: string;
  
  // Lý do
  reason: string;
  medicalHistoryProcess: string;
  nutritionHabits: string;
  sleepHabits: string;
  sportsActivity: string;
  academicAbility: string;
  micronutrients: string;
  chronicDiseases: string;
  prolongedMedication: string;
  allergies: string;

  // Tiền sử sơ sinh
  gestationalWeeks: string;
  maternalPregnancyOther: string;
  birthWeight: string;
  isSGA: boolean;
  birthLength: string;
  newbornScreening: string;
  newbornScreeningAbnormal: string;
  neonatalHistory: string[];
  neonatalHistoryOther: string;

  // Tiền sử gia đình
  fatherHeight: string;
  motherHeight: string;
  mph: string;
  mphPercentile: string;
  familyHistory: string[];
  familyHistoryOther: string;

  // Khám lâm sàng - Nhân trắc
  height: string;
  heightZ: string;
  weight: string;
  weightZ: string;
  bmi: string;
  bmiZ: string;
  growthVelocity: string;
  growthEvaluation: string;

  // Khám Toàn thân & Bộ phận
  specializedExamType: string;
  physicalExam: string;

  // Chi tiết khám chuyên đề (Specialized Exam Details)
  // Béo phì
  obesityDiet: string;
  obesityExercise: string;
  obesityCushing: boolean;
  obesityAcanthosis: boolean;
  obesityStriae: boolean;
  obesityAbdominalCircumference: string;
  obesityBloodPressure: string;
  obesityWeightGainAge: string;
  obesityCorticoidUse: string;
  obesityChronicDisease: string;
  obesityFamilyOverweight: boolean;
  obesityScreenTime: string;
  obesitySweetDrinks: string;
  obesitySleepTime: string;
  obesityWholeBody: boolean;
  obesityFamilyCardiovascular: boolean;
  obesityBreastfeeding: string;
  obesityComplementaryFeedingAge: string;
  obesityRewardPunish: boolean;
  obesityDiverseDiet: boolean;
  obesityEatTogether: boolean;
  obesityEatOut: boolean;
  obesityFastFood: boolean;
  obesityBringLunch: boolean;
  obesityVegetablesFruits: boolean;
  // Sơ sinh
  newbornReflexes: string;
  newbornMuscleTone: string;
  newbornJaundice: boolean;
  newbornUmbilical: boolean;
  // Tăng trưởng
  growthProportions: string;
  growthPuberty: string;
  growthDysmorphism: boolean;
  // Dậy thì
  pubertyTanner: string;
  pubertyBreastTestis: string;
  pubertyAcne: boolean;
  pubertyPubicHair: boolean;
  // Yếu cơ
  muscleStrength: string;
  muscleGait: string;
  muscleGowers: boolean;
  // Lùn trẻ gái
  turnerSigns: boolean;
  turnerLymphedema: boolean;
  turnerBreast: string;

  // Dậy thì (Thông số cũ - giữ lại để tương thích)
  tannerFemaleBreast: string;
  tannerFemalePubic: string;
  femaleMucosa: string;
  menstruation: string;
  menstruationAge: string;
  
  tannerMaleGenitalia: string;
  tannerMalePubic: string;
  testicularVolumeRight: string;
  testicularVolumeLeft: string;
  penileLength: string;

  // Thực thể khác
  thyroid: string[];
  otherSigns: string[];
  otherNotes: string;

  // Cận lâm sàng
  labTests: string[];
  labTestsOther1: string;
  labTestsOther2: string;
  labTestsOther3: string;
  imaging: string[];
  genetics: string[];

  // Kết luận & Tư vấn
  suspectedDiagnosis: string;
  counseling: string;
  conclusion: string;

  // Tiền sử sản khoa bổ sung
  birthOrder: string;
  deliveryMethod: string;
  maternalHistory: string[];
  prenatalUltrasound: string[];
  maternalHistoryNormal: boolean;
  prenatalUltrasoundNormal: boolean;
  prenatalScreeningNIPS: string;
  prenatalScreeningNIPSUnknown: boolean;
  heelPrickScreening: string;
  heelPrickScreeningUnknown: boolean;
  neonatalHistoryNormal: boolean;
  familyHistoryNormal: boolean;
}

export const initialState: AppState = {
  name: '',
  pid: '',
  gender: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  examDate: new Date().toISOString().split('T')[0],
  reason: '',
  medicalHistoryProcess: '',
  nutritionHabits: '',
  sleepHabits: '',
  sportsActivity: '',
  academicAbility: '',
  micronutrients: '',
  chronicDiseases: 'Không - theo gia đình kể',
  prolongedMedication: 'Hiện không dùng thuốc gì kéo dài, không táo bón, tiêu chảy, nôn kéo dài',
  allergies: 'Chưa ghi nhận trước đó',
  gestationalWeeks: '',
  maternalPregnancyOther: '',
  birthWeight: '',
  isSGA: false,
  birthLength: '',
  newbornScreening: '',
  newbornScreeningAbnormal: '',
  neonatalHistory: [],
  neonatalHistoryOther: '',
  fatherHeight: '',
  motherHeight: '',
  mph: '',
  mphPercentile: '',
  familyHistory: [],
  familyHistoryOther: '',
  height: '',
  heightZ: '',
  weight: '',
  weightZ: '',
  bmi: '',
  bmiZ: '',
  growthVelocity: '',
  growthEvaluation: '',
  specializedExamType: '',
  physicalExam: `- Trẻ tỉnh; tương tác tốt; 
- Da niêm mạc hồng, không ban nốt; 
- Dấu hiệu mất nước:  không 
- Hạch ngoại vi: Không sờ thấy

- Tim nhịp đều,  T1,T2 rõ; Refill <2s; Tưới máu ngoại biên tốt; Chi ấm; Mạch ngoại vi bắt rõ; Không tái tím 
- Trẻ tự thở, môi hồng; Thông khí đều; Lồng ngực cân đối;  Không ran phổi; Không thở nhanh
- Trẻ tri giác tỉnh, tương tác được; Hội chứng màng não âm tính; Không giảm trương lực cơ; Không yếu cơ; Đồng tử 2 bên 2mm, phản xạ ánh sáng dương tính, không liệt vận nhãn
- Bụng mềm, không dấu hiệu bụng ngoại khoa, không nôn nhiều. Phản ứng thành bụng: không; Cảm ứng phúc mạc: Không; Không chướng hơi; Không có dấu hiệu quai ruột nổi.

- Khám Nội tiết:
+ Tuyến giáp: Không bướu cổ
+ Cột sống: Không cong vẹo
+ Không biến dạng xương dài
+ Không dysmorphy (tay, chân, tai, răng)
+ Không thừa da cổ, không tóc mọc thấp
+ Tỉ lệ thân mình cân đối
+ Nhanh nhẹn, không phù niêm
+ Cẳng tay cong ngoài:
+ Vẻ Cushing: 
+ Gai đen:
+ Bướu trâu:
+ Tanner:`,
  
  // Béo phì
  obesityDiet: '',
  obesityExercise: '',
  obesityCushing: false,
  obesityAcanthosis: false,
  obesityStriae: false,
  obesityAbdominalCircumference: '',
  obesityBloodPressure: '',
  obesityWeightGainAge: '',
  obesityCorticoidUse: '',
  obesityChronicDisease: '',
  obesityFamilyOverweight: false,
  obesityScreenTime: '',
  obesitySweetDrinks: '',
  obesitySleepTime: '',
  obesityWholeBody: false,
  obesityFamilyCardiovascular: false,
  obesityBreastfeeding: '',
  obesityComplementaryFeedingAge: '',
  obesityRewardPunish: false,
  obesityDiverseDiet: false,
  obesityEatTogether: false,
  obesityEatOut: false,
  obesityFastFood: false,
  obesityBringLunch: false,
  obesityVegetablesFruits: false,
  // Sơ sinh
  newbornReflexes: '',
  newbornMuscleTone: '',
  newbornJaundice: false,
  newbornUmbilical: false,
  // Tăng trưởng
  growthProportions: '',
  growthPuberty: '',
  growthDysmorphism: false,
  // Dậy thì
  pubertyTanner: '',
  pubertyBreastTestis: '',
  pubertyAcne: false,
  pubertyPubicHair: false,
  // Yếu cơ
  muscleStrength: '',
  muscleGait: '',
  muscleGowers: false,
  // Lùn trẻ gái
  turnerSigns: false,
  turnerLymphedema: false,
  turnerBreast: '',

  tannerFemaleBreast: '',
  tannerFemalePubic: '',
  femaleMucosa: '',
  menstruation: '',
  menstruationAge: '',
  tannerMaleGenitalia: '',
  tannerMalePubic: '',
  testicularVolumeRight: '',
  testicularVolumeLeft: '',
  penileLength: '',
  thyroid: [],
  otherSigns: [],
  otherNotes: '',
  labTests: [],
  labTestsOther1: '',
  labTestsOther2: '',
  labTestsOther3: '',
  imaging: [],
  genetics: [],
  suspectedDiagnosis: '',
  counseling: '',
  conclusion: '',
  birthOrder: '',
  deliveryMethod: '',
  maternalHistory: [],
  maternalHistoryNormal: false,
  prenatalUltrasound: [],
  prenatalUltrasoundNormal: false,
  prenatalScreeningNIPS: '',
  prenatalScreeningNIPSUnknown: false,
  heelPrickScreening: '',
  heelPrickScreeningUnknown: false,
  neonatalHistoryNormal: false,
  familyHistoryNormal: false
};
