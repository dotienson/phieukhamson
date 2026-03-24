export const LAB_TESTS_GROUPED = [
  {
    category: "Chuyển hóa & Sinh hóa",
    tests: [
      "Công thức máu", "Máu lắng (ESR)", "Điện giải đồ", "Glucose máu (Đói)",
      "AST", "ALT", "Ure", "Creatinin", "Protein", "Albumin",
      "Cholesterol TP", "Triglyceride", "LDL-C", "Acid Uric", "HbA1c", "Insulin máu (Đói)", "C-peptid",
      "Men cơ (CK)", "Vitamin B12"
    ]
  },
  {
    category: "Tuyến giáp",
    tests: ["TSH", "fT4", "fT3", "Thyroglobulin (Tg)", "Anti-TPO", "Anti-Tg", "TRAb"]
  },
  {
    category: "Tăng trưởng & Tuyến yên",
    tests: ["IGF-1", "GH tĩnh", "GH động", "Prolactin", "Cortisol (Máu 8:00 AM)", "ACTH (Máu 8:00 AM)"]
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
    tests: ["Canxi toàn phần", "Canxi ion hóa", "Phospho", "ALP (Phosphatase kiềm)", "Vitamin D", "PTH", "Ferritin", "Kẽm"]
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

  "Khám dậy thì nữ": `* Khám kiểm tra về dậy thì:
- Đau đầu: 
- Cao nhanh: 
- Tăng cân: 
- Bướu cổ:
- Mảng cà phê sữa:
- Mụn trứng cá, mùi cơ thể: 
- Tốc độ tăng chiều cao: 
- Tanner: `,

  "Khám dậy thì nam": `* Khám kiểm tra về dậy thì:
- Đau đầu: 
- Cao nhanh: 
- Tăng cân: 
- Bướu cổ:
- Mảng cà phê sữa:
- Mụn trứng cá, mùi cơ thể: 
- Tốc độ tăng chiều cao: 
- Tanner: `,

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
- Thị lực:
- Sắc tố da:`
};
