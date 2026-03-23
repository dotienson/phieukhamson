export const LAB_TESTS_GROUPED = [
  {
    category: "Chuyển hóa & Sinh hóa",
    tests: [
      "Công thức máu", "Máu lắng (ESR)", "Điện giải đồ", "Glucose máu (Đói)",
      "AST", "ALT", "Ure", "Creatinin", "Protein", "Albumin",
      "Cholesterol TP", "Triglyceride", "LDL-C", "Acid Uric", "HbA1c", "Insulin máu (Đói)", "C-peptid"
    ]
  },
  {
    category: "Tuyến giáp",
    tests: ["TSH", "fT4", "fT3", "Thyroglobulin (Tg)", "Anti-TPO", "Anti-Tg", "TRAb"]
  },
  {
    category: "Tăng trưởng & Tuyến yên",
    tests: ["IGF-1", "GH (Nghiệm pháp)", "Prolactin", "Cortisol (Máu 8:00 AM)", "ACTH (Máu 8:00 AM)"]
  },
  {
    category: "Dậy thì & Sinh dục",
    tests: ["LH", "FSH", "Estradiol (E2)", "Testosterone", "BetaHCG", "AFP"]
  },
  {
    category: "Tuyến thượng thận",
    tests: ["17-OH Progesterone", "Steroid niệu", "HVA-VMA niệu", "Renin", "Aldosterone"]
  },
  {
    category: "Xương & Khoáng chất",
    tests: ["Canxi (Toàn phần / Ion hóa)", "Phospho", "ALP (Phosphatase kiềm)", "Vitamin D", "PTH", "Ferritin", "Kẽm"]
  }
];

export const IMAGING = [
  "Siêu âm Tử cung - Phần phụ",
  "Siêu âm Tinh hoàn",
  "X-quang tuổi xương (cổ tay - bàn tay trái)",
  "Siêu âm Tuyến giáp",
  "Siêu âm ổ bụng",
  "MRI não đánh giá tuyến yên"
];

export const GENETICS = [
  "Nhiễm sắc thể đồ (Karyotype)",
  "CNVSure",
  "Giải trình tự Gen: G4500",
  "Giải trình tự Gen: WES-CNV",
  "Giải trình tự Gen: WGS"
];

export const MATERNAL_PREGNANCY_OPTS = ["Đa ối", "Đái tháo đường thai kì"];
export const NEONATAL_HISTORY_OPTS = ["Hạ đường huyết", "Vàng da kéo dài", "Dương vật nhỏ", "Tinh hoàn ẩn"];
export const FAMILY_HISTORY_OPTS = ["Bệnh lý tuyến giáp", "Đái tháo đường (Type 1/Type 2)", "Dậy thì sớm/muộn", "Thấp lùn vô căn", "Bệnh tự miễn"];
export const THYROID_OPTS = ["Không to", "To độ I", "To độ II", "Có nhân", "Hạch cổ"];
export const OTHER_SIGNS_OPTS = ["Gai đen", "Rạn da", "Trứng cá", "Rậm lông", "Bướu trâu", "Cushingoid"];

export const MATERNAL_HISTORY_OPTS = ["Viêm nhiễm/sốt/cúm", "Đái tháo đường", "Tiền sản giật", "Dọa sảy"];
export const PRENATAL_ULTRASOUND_OPTS = ["Phù thai", "Đa ối", "IUGR"];
export const PRENATAL_SCREENING_NIPS_OPTS = ["Bình thường", "Bất thường"];
export const HEEL_PRICK_SCREENING_OPTS = ["Bình thường", "Bất thường"];

export const SPECIALIZED_EXAM_TEMPLATES: Record<string, string> = {
  "Khám béo phì": `* KHÁM BÉO PHÌ:
- Béo toàn thân:      Cushing: 
- BMI: ~
- Gai đen:                     Rạn da:
- Vòng bụng:               Huyết áp:
- Tăng cân từ:               
- Corticoid:      Bệnh mãn tính: 
- Bố mẹ/ Anh chị em ruột thừa cân: 
- Đái đường thai kì:      Tăng cân trong thai kì:      BW:
- Bố/mẹ/ông/bà có bệnh lý tim mạch:
- Bú mẹ:          Ăn dặm lúc:        
- Thời gian dùng điện thoại/TV mỗi ngày: 
- Nước quả:                 Đồ uống ngọt:  
- Thời gian ngủ:       Tập luyện/vui chơi mỗi ngày:
- Chế độ ăn:   ăn thưởng/phạt:         ăn đa dạng:         
- ăn chung:       ăn hàng:     fastfood:            
- mang cơm trưa:          ăn rau/hoa quả:`,

  "Khám sơ sinh": `* KHÁM SƠ SINH:
- Trẻ sơ sinh Bú tốt  Khóc rõ tiếng  Không rõ mùi đặc biệt 
- Thóp phẳng   Không co giật  tại lúc khám  
- Trương lực cơ: không giảm/tăng  phản xạ sơ sinh: tốt
- Tự thở, môi hồng Không tím  Lồng ngực cân đối  
- Phổi thông khí đều, không ran   Không rút lõm lồng ngực 
- Không thở nhanh liên tục          Tần số thở: 
- Tim nhịp đều, T1  T2 rõ   Chi ấm Tiếng thổi:
- Bụng mềm  Gan không to
- Không khối vùng cùng cụt
- Phân, tiểu: Bình thường
- Da niêm mạc    Vàng da: 
- BPSD ngoài: 
- Thoát vị rốn: 
- Bớt bất thường nổi trội: 
- Dị hình bất thường nổi trội:`,

  "Khám tăng trưởng": `* KHÁM TĂNG TRƯỞNG:
- Gia đình đưa trẻ đến khám vì: 
- Theo dõi tăng trưởng:
- Tốc độ tăng cao:
- Thể thao:
- Giấc ngủ :
- Chế độ ăn: 
- Trí lực: Nhanh nhẹn;   
- Đang điều trị bệnh mạn tính? 
- Không nôn, táo bón, tiêu chảy... kéo dài; 
- Không đau đầu, buồn nôn, nhìn mờ bất thường;
- Tiền sử dùng corticoid kéo dài / chấn thương sọ não nặng: Không;`,

  "Khám dậy thì": `* KHÁM DẬY THÌ:
- Khám kiểm tra về dậy thì, dấu hiệu: vú phì đại  - từ
- Đau đầu: 
- Cao nhanh: 
- Tăng cân: 
- Mụn trứng cá, mùi cơ thể: 
- Tốc độ tăng chiều cao: 
- Tuổi hiện tại:`,

  "Khám yếu cơ trẻ nhỏ": `* KHÁM YẾU CƠ TRẺ NHỎ:
- Thời điểm khởi phát:
- Tiền sản và chu sinh:
+ Phơi nhiễm thuốc/chất:
+ Đa ối:
+ Bệnh của mẹ (đái đường, nhược cơ, loạn trương lực cơ):
+ Hôn nhân cận huyết:              Tuổi bố mẹ:
+ Tiền sử gia đình (yếu liệt, tàn phế, chậm trí tuệ):
+ Cuộc đẻ:
- Sau sinh:
+ Bú mút nuốt:         + Tiếng khóc:        + Tím tái:
- Thăm khám:
+ Dị hình:                    Vòng đầu:    
+ Đầu nhỏ:   Sụp mi:    Suy kiệt:      + Sắc tố da, tóc: 
+ Chuyển động mắt:               + Cử động mặt:      Cơ mặt miệng:
+ Rung giật cơ:                       + Lưỡi rung:            Vòng tím quanh môi:
+ Gan:                                   
+ NP Barlow:                + NP Ortolani:
+ Phản xạ trương lực cổ không đối xứng (< 2 tháng): 
+ Teo cơ:       
+ Hô hấp nghịch đảo:           + Lồng ngực hình chuông:
+ Vòng khẩu cái cao:`,

  "Khám lùn trẻ gái": `* KHÁM LÙN TRẺ GÁI:
- Tuổi:
- Tỉnh  Học lực: 
- Chiều cao (SDS, WHO):
- Cân nặng ứng với:  
- Lùn cân đối:
- Dysmorphy:
- Biến dạng xương dài (-) 
- Cushing (-)   Táo bón:
- Kinh nguyệt:
- Thừa da cổ:
- Tóc mọc thấp:
- Cẳng tay cong ngoài: 
- Nếp quạt ở mắt:
- Thiểu sản móng:
- Ngực rộng, núm vú xa nhau:
- Phù mu bàn chân/tay:
- Thị lực:
- Sắc tố da:`
};
