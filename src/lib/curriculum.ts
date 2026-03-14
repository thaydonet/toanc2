export interface Lesson {
  title: string;
  href: string;
}

export interface Chapter {
  title: string;
  lessons: Lesson[];
}

export interface Volume {
  title: string;
  chapters: Chapter[];
}

export interface GradeCurriculum {
  title: string;
  gradeStr: string;
  slug: string;
  volumes: Volume[];
}

export const curriculumData: Record<string, GradeCurriculum> = {
  lop6: {
    title: 'Toán 6',
    gradeStr: 'Lớp 6',
    slug: 'lop6',
    volumes: [
      {
        title: 'Tập 1',
        chapters: [
          {
            title: 'Chương I: Tập hợp các số tự nhiên',
            lessons: [
              { title: 'Bài 1: Tập hợp', href: '/lop6/bai-1-tap-hop' },
              { title: 'Bài 2: Cách ghi số tự nhiên', href: '/lop6/bai-2-ghi-so-tu-nhien' },
              { title: 'Bài 3: Thứ tự trong tập hợp các số tự nhiên', href: '/lop6/bai-3-thu-tu-so-tu-nhien' },
              { title: 'Bài 4: Phép cộng và phép trừ số tự nhiên', href: '/lop6/bai-4-cong-tru' },
              { title: 'Bài 5: Phép nhân và phép chia số tự nhiên', href: '/lop6/bai-5-nhan-chia' },
              { title: 'Bài 6: Lũy thừa với số mũ tự nhiên', href: '/lop6/bai-6-luy-thua' },
              { title: 'Bài 7: Thứ tự thực hiện các phép tính', href: '/lop6/bai-7-thu-tu-phep-tinh' }
            ]
          },
          {
            title: 'Chương II: Tính chia hết trong tập hợp các số tự nhiên',
            lessons: [
              { title: 'Bài 8: Quan hệ chia hết và tính chất', href: '/lop6/bai-8-quan-he-chia-het' },
              { title: 'Bài 9: Dấu hiệu chia hết', href: '/lop6/bai-9-dau-hieu-chia-het' },
              { title: 'Bài 10: Số nguyên tố', href: '/lop6/bai-10-so-nguyen-to' },
              { title: 'Bài 11: Ước chung. Ước chung lớn nhất', href: '/lop6/bai-11-uoc-chung-ucln' },
              { title: 'Bài 12: Bội chung. Bội chung nhỏ nhất', href: '/lop6/bai-12-boi-chung-bcnn' }
            ]
          },
          {
            title: 'Chương III: Số nguyên',
            lessons: [
              { title: 'Bài 13: Tập hợp các số nguyên', href: '/lop6/bai-13-so-nguyen' },
              { title: 'Bài 14: Phép cộng và phép trừ số nguyên', href: '/lop6/bai-14-cong-tru-so-nguyen' },
              { title: 'Bài 15: Quy tắc dấu ngoặc', href: '/lop6/bai-15-quy-tac-dau-ngoac' },
              { title: 'Bài 16: Phép nhân số nguyên', href: '/lop6/bai-16-nhan-so-nguyen' },
              { title: 'Bài 17: Phép chia hết. Ước và bội của một số nguyên', href: '/lop6/bai-17-chia-het' }
            ]
          },
          {
            title: 'Chương IV: Một số hình phẳng trong thực tiễn',
            lessons: [
              { title: 'Bài 18: Hình tam giác đều. Hình vuông. Hình lục giác đều', href: '/lop6/bai-18-hinh-phang-1' },
              { title: 'Bài 19: Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân', href: '/lop6/bai-19-hinh-phang-2' },
              { title: 'Bài 20: Chu vi và diện tích của một số tứ giác đã học', href: '/lop6/bai-20-chu-vi-dien-tich' }
            ]
          },
          {
            title: 'Chương V: Tính đối xứng của hình phẳng trong tự nhiên',
            lessons: [
              { title: 'Bài 21: Hình có trục đối xứng', href: '/lop6/bai-21-truc-doi-xuong' },
              { title: 'Bài 22: Hình có tâm đối xứng', href: '/lop6/bai-22-tam-doi-xuong' }
            ]
          }
        ]
      },
      {
        title: 'Tập 2',
        chapters: [
          {
            title: 'Chương VI: Phân số',
            lessons: [
              { title: 'Phân số và các phép tính (Demo)', href: '/lop6/phan-so' },
              { title: 'Bài 23: Mở rộng phân số. Phân số bằng nhau', href: '/lop6/bai-23-mo-rong-phan-so' },
              { title: 'Bài 24: So sánh phân số. Hỗn số dương', href: '/lop6/bai-24-so-sanh-phan-so' },
              { title: 'Bài 25: Phép cộng và phép trừ phân số', href: '/lop6/bai-25-cong-tru-phan-so' },
              { title: 'Bài 26: Phép nhân và phép chia phân số', href: '/lop6/bai-26-nhan-chia-phan-so' },
              { title: 'Bài 27: Hai bài toán về phân số', href: '/lop6/bai-27-hai-bai-toan-phan-so' }
            ]
          },
          {
            title: 'Chương VII: Số thập phân',
            lessons: [
              { title: 'Bài 28: Số thập phân', href: '/lop6/bai-28-so-thap-phan' },
              { title: 'Bài 29: Tính toán với số thập phân', href: '/lop6/bai-29-tinh-toan-so-thap-phan' },
              { title: 'Bài 30: Làm tròn và ước lượng', href: '/lop6/bai-30-lam-tron-uoc-luong' },
              { title: 'Bài 31: Một số bài toán về tỉ số và tỉ số phần trăm', href: '/lop6/bai-31-ti-so-phan-tram' }
            ]
          },
          {
            title: 'Chương VIII: Những hình hình học cơ bản',
            lessons: [
              { title: 'Bài 32: Điểm và đường thẳng', href: '/lop6/bai-32-diem-duong-thang' },
              { title: 'Bài 33: Điểm nằm giữa hai điểm. Tia', href: '/lop6/bai-33-diem-tia' },
              { title: 'Bài 34: Đoạn thẳng. Độ dài đoạn thẳng', href: '/lop6/bai-34-doan-thang' },
              { title: 'Bài 35: Trung điểm của đoạn thẳng', href: '/lop6/bai-35-trung-diem' },
              { title: 'Bài 36: Góc', href: '/lop6/bai-36-goc' },
              { title: 'Bài 37: Số đo góc', href: '/lop6/bai-37-so-do-goc' }
            ]
          },
          {
            title: 'Chương IX: Dữ liệu và xác suất thực nghiệm',
            lessons: [
              { title: 'Bài 38: Dữ liệu và thu thập dữ liệu', href: '/lop6/bai-38-du-lieu-thu-thap' },
              { title: 'Bài 39: Bảng thống kê và biểu đồ tranh', href: '/lop6/bai-39-bang-thong-ke-bieu-do-tranh' },
              { title: 'Bài 40: Biểu đồ cột', href: '/lop6/bai-40-bieu-do-cot' },
              { title: 'Bài 41: Biểu đồ cột kép', href: '/lop6/bai-41-bieu-do-cot-kep' },
              { title: 'Bài 42: Kết quả có thể và sự kiện trong trò chơi, thí nghiệm', href: '/lop6/bai-42-ket-qua-co-the-su-kien' },
              { title: 'Bài 43: Xác suất thực nghiệm', href: '/lop6/bai-43-xac-suat-thuc-nghiem' }
            ]
          }
        ]
      }
    ]
  },
  lop7: {
    title: 'Toán 7',
    gradeStr: 'Lớp 7',
    slug: 'lop7',
    volumes: [
      {
        title: 'Tập 1',
        chapters: [
          {
            title: 'Chương I: Số hữu tỉ',
            lessons: [
              { title: 'Bài 1: Tập hợp các số hữu tỉ', href: '/lop7/bai-1-tap-hop-so-huu-ti' },
              { title: 'Bài 2: Cộng, trừ, nhân, chia số hữu tỉ', href: '/lop7/bai-2-cong-tru-nhan-chia-so-huu-ti' },
              { title: 'Bài 3: Lũy thừa với số mũ tự nhiên của một số hữu tỉ', href: '/lop7/bai-3-luy-thua-so-mu-tu-nhien' },
              { title: 'Bài 4: Thứ tự thực hiện các phép tính. Quy tắc chuyển vế', href: '/lop7/bai-4-thu-tu-thuc-hien-phep-tinh-quy-tac-chuyen-ve' }
            ]
          },
          {
            title: 'Chương II: Số thực',
            lessons: [
              { title: 'Bài 5: Làm quen với số thập phân vô hạn tuần hoàn', href: '/lop7/bai-5-so-thap-phan-vo-han-tuan-hoan' },
              { title: 'Bài 6: Số vô tỉ. Căn bậc hai số học', href: '/lop7/bai-6-so-vo-ti-can-bac-hai' },
              { title: 'Bài 7: Tập hợp các số thực', href: '/lop7/bai-7-tap-hop-so-thuc' }
            ]
          },
          {
            title: 'Chương III: Góc và đường thẳng song song',
            lessons: [
              { title: 'Bài 8: Góc ở vị trí đặc biệt. Tia phân giác của một góc', href: '/lop7/bai-8-goc-vi-tri-dac-biet-tia-phan-giac' },
              { title: 'Bài 9: Hai đường thẳng song song và dấu hiệu nhận biết', href: '/lop7/bai-9-duong-thang-song-song' },
              { title: 'Bài 10: Tiên đề Euclid. Tính chất của hai đường thẳng song song', href: '/lop7/bai-10-tien-de-euclid' },
              { title: 'Bài 11: Định lí và chứng minh định lí', href: '/lop7/bai-11-dinh-li-chung-minh' }
            ]
          },
          {
            title: 'Chương IV: Tam giác bằng nhau',
            lessons: [
              { title: 'Bài 12: Tổng các góc trong một tam giác', href: '/lop7/bai-12-tong-cac-goc-tam-giac' },
              { title: 'Bài 13: Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất', href: '/lop7/bai-13-hai-tam-giac-bang-nhau-ccc' },
              { title: 'Bài 14: Trường hợp bằng nhau thứ hai và thứ ba của tam giác', href: '/lop7/bai-14-truong-hop-bang-nhau-cgc-gcg' },
              { title: 'Bài 15: Các trường hợp bằng nhau của tam giác vuông', href: '/lop7/bai-15-tam-giac-vuong-bang-nhau' },
              { title: 'Bài 16: Tam giác cân. Đường trung trực của đoạn thẳng', href: '/lop7/bai-16-tam-giac-can-duong-trung-truc' }
            ]
          },
          {
            title: 'Chương V: Thu thập và biểu diễn dữ liệu',
            lessons: [
              { title: 'Bài 17: Thu thập và phân loại dữ liệu', href: '/lop7/bai-17-thu-thap-phan-loai-du-lieu' },
              { title: 'Bài 18: Biểu đồ hình quạt tròn', href: '/lop7/bai-18-bieu-do-hinh-quat-tron' },
              { title: 'Bài 19: Biểu đồ đoạn thẳng', href: '/lop7/bai-19-bieu-do-doan-thang' }
            ]
          }
        ]
      },
      {
        title: 'Tập 2',
        chapters: [
          {
            title: 'Chương VI: Tỉ lệ thức và đại lượng tỉ lệ',
            lessons: [
              { title: 'Bài 20: Tỉ lệ thức', href: '/lop7/bai-20-ti-le-thuc' },
              { title: 'Bài 21: Tính chất của dãy tỉ số bằng nhau', href: '/lop7/bai-21-tinh-chat-day-ti-so-bang-nhau' },
              { title: 'Bài 22: Đại lượng tỉ lệ thuận', href: '/lop7/bai-22-dai-luong-ti-le-thuan' },
              { title: 'Bài 23: Đại lượng tỉ lệ nghịch', href: '/lop7/bai-23-dai-luong-ti-le-nghich' }
            ]
          },
          {
            title: 'Chương VII: Biểu thức đại số và đa thức một biến',
            lessons: [
              { title: 'Bài 24: Biểu thức đại số', href: '/lop7/bai-24-bieu-thuc-dai-so' },
              { title: 'Bài 25: Đa thức một biến', href: '/lop7/bai-25-da-thuc-mot-bien' },
              { title: 'Bài 26: Phép cộng và phép trừ đa thức một biến', href: '/lop7/bai-26-cong-tru-da-thuc-mot-bien' },
              { title: 'Bài 27: Phép nhân đa thức một biến', href: '/lop7/bai-27-nhan-da-thuc-mot-bien' },
              { title: 'Bài 28: Phép chia đa thức một biến', href: '/lop7/bai-28-chia-da-thuc-mot-bien' }
            ]
          },
          {
            title: 'Chương VIII: Làm quen với biến cố và xác suất của biến cố',
            lessons: [
              { title: 'Bài 29: Làm quen với biến cố', href: '/lop7/bai-29-lam-quen-voi-bien-co' },
              { title: 'Bài 30: Làm quen với xác suất của biến cố', href: '/lop7/bai-30-lam-quen-voi-xac-suat-cua-bien-co' }
            ]
          },
          {
            title: 'Chương IX: Quan hệ giữa các yếu tố trong tam giác',
            lessons: [
              { title: 'Bài 31: Quan hệ giữa góc và cạnh đối diện trong một tam giác', href: '/lop7/bai-31-quan-he-giua-goc-va-canh-doi-dien' },
              { title: 'Bài 32: Quan hệ giữa đường vuông góc và đường xiên', href: '/lop7/bai-32-quan-he-giua-duong-vuong-goc-va-duong-xien' },
              { title: 'Bài 33: Quan hệ giữa ba cạnh của một tam giác', href: '/lop7/bai-33-quan-he-giua-ba-canh-cua-mot-tam-giac' },
              { title: 'Bài 34: Sự đồng quy của ba trung tuyến, ba đường phân giác', href: '/lop7/bai-34-dong-quy-ba-trung-tuyen-ba-duong-phan-giac' },
              { title: 'Bài 35: Sự đồng quy của ba đường trung trực, ba đường cao', href: '/lop7/bai-35-dong-quy-ba-duong-trung-truc-ba-duong-cao' }
            ]
          },
          {
            title: 'Chương X: Một số hình khối trong thực tiễn',
            lessons: [
              { title: 'Bài 36: Hình hộp chữ nhật và hình lập phương', href: '/lop7/bai-36-hinh-hop-chu-nhat-va-hinh-lap-phuong' },
              { title: 'Bài 37: Hình lăng trụ đứng tam giác, hình lăng trụ đứng tứ giác', href: '/lop7/bai-37-hinh-lang-tru-dung-tam-giac-tu-giac' }
            ]
          }
        ]
      }
    ]
  },
  lop8: {
    title: 'Toán 8',
    gradeStr: 'Lớp 8',
    slug: 'lop8',
    volumes: [
      {
        title: 'Tập 1',
        chapters: [
          {
            title: 'Chương 1: Đa thức',
            lessons: [
              { title: 'Bài 1: Đơn thức', href: '/lop8/bai-1-don-thuc' },
              { title: 'Bài 2: Đa thức', href: '/lop8/bai-2-da-thuc' },
              { title: 'Bài 3: Phép cộng và phép trừ đa thức', href: '/lop8/bai-3-cong-tru-da-thuc' },
              { title: 'Bài 4: Phép nhân đa thức', href: '/lop8/bai-4-nhan-da-thuc' },
              { title: 'Bài 5: Phép chia đa thức cho đơn thức', href: '/lop8/bai-5-chia-da-thuc' }
            ]
          },
          {
            title: 'Chương 2: Hằng đẳng thức đáng nhớ và ứng dụng',
            lessons: [
              { title: 'Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu', href: '/lop8/bai-6-hang-dang-thuc-1' },
              { title: 'Bài 7: Lập phương của một tổng. Lập phương của một hiệu', href: '/lop8/bai-7-hang-dang-thuc-2' },
              { title: 'Bài 8: Tổng và hiệu hai lập phương', href: '/lop8/bai-8-hang-dang-thuc-3' },
              { title: 'Bài 9: Phân tích đa thức thành nhân tử', href: '/lop8/bai-9-phan-tich-da-thuc' }
            ]
          },
          {
            title: 'Chương 3: Tứ giác',
            lessons: [
              { title: 'Bài 10: Tứ giác', href: '/lop8/bai-10-tu-giac' },
              { title: 'Bài 11: Hình thang cân', href: '/lop8/bai-11-hinh-thang-can' },
              { title: 'Bài 12: Hình bình hành', href: '/lop8/bai-12-hinh-binh-hanh' },
              { title: 'Bài 13: Hình chữ nhật', href: '/lop8/bai-13-hinh-chu-nhat' },
              { title: 'Bài 14: Hình thoi và hình vuông', href: '/lop8/bai-14-hinh-thoi-vuong' }
            ]
          },
          {
            title: 'Chương 4: Định lí Thales',
            lessons: [
              { title: 'Bài 15: Định lí Thales trong tam giác', href: '/lop8/bai-15-thales' },
              { title: 'Bài 16: Đường trung bình của tam giác', href: '/lop8/bai-16-trung-binh-tam-giac' },
              { title: 'Bài 17: Tính chất đường phân giác của tam giác', href: '/lop8/bai-17-phan-giac-tam-giac' }
            ]
          },
          {
            title: 'Chương 5: Dữ liệu và biểu đồ',
            lessons: [
              { title: 'Bài 18: Thu thập và phân loại dữ liệu', href: '/lop8/bai-18-thu-thap-du-lieu' },
              { title: 'Bài 19: Biểu diễn dữ liệu bằng bảng, biểu đồ', href: '/lop8/bai-19-bieu-dien-du-lieu' },
              { title: 'Bài 20: Phân tích dữ liệu thống kê dựa vào biểu đồ', href: '/lop8/bai-20-phan-tich-du-lieu' }
            ]
          }
        ]
      },
      {
        title: 'Tập 2',
        chapters: [
          {
            title: 'Chương 6: Phân thức đại số',
            lessons: [
              { title: 'Bài 21: Phân thức đại số', href: '/lop8/bai-21-phan-thuc-dai-so' },
              { title: 'Bài 22: Tính chất cơ bản của phân thức đại số', href: '/lop8/bai-22-tinh-chat-co-ban-cua-phan-thuc-dai-so' },
              { title: 'Bài 23: Phép cộng và phép trừ phân thức đại số', href: '/lop8/bai-23-phep-cong-va-phep-tru-phan-thuc-dai-so' },
              { title: 'Bài 24: Phép nhân và phép chia phân thức đại số', href: '/lop8/bai-24-phep-nhan-va-phep-chia-phan-thuc-dai-so' }
            ]
          },
          {
            title: 'Chương 7: Phương trình bậc nhất và hàm số bậc nhất',
            lessons: [
              { title: 'Bài 25: Phương trình bậc nhất một ẩn', href: '/lop8/bai-25-phuong-trinh-bac-nhat' },
              { title: 'Bài 26: Giải bài toán bằng cách lập phương trình', href: '/lop8/bai-26-giai-toan-pt' },
              { title: 'Bài 27: Khái niệm hàm số và đồ thị của hàm số', href: '/lop8/bai-27-ham-so' },
              { title: 'Bài 28: Hàm số bậc nhất và đồ thị của hàm số bậc nhất', href: '/lop8/bai-28-ham-so-bac-nhat' },
              { title: 'Bài 29: Hệ số góc của đường thẳng', href: '/lop8/bai-29-he-so-goc' }
            ]
          },
          {
            title: 'Chương 8: Mở đầu về tính xác suất của biến cố',
            lessons: [
              { title: 'Bài 30: Kết quả có thể và kết quả thuận lợi', href: '/lop8/bai-30-ket-qua' },
              { title: 'Bài 31: Cách tính xác suất của biến cố bằng tỉ số', href: '/lop8/bai-31-tinh-xac-suat' },
              { title: 'Bài 32: Mối liên hệ giữa xác suất thực nghiệm với xác suất ứng dụng', href: '/lop8/bai-32-moi-lien-he-xac-suat' }
            ]
          },
          {
            title: 'Chương 9: Tam giác đồng dạng',
            lessons: [
              { title: 'Bài 33: Hai tam giác đồng dạng', href: '/lop8/bai-33-tam-giac-dong-dang' },
              { title: 'Bài 34: Ba trường hợp đồng dạng của hai tam giác', href: '/lop8/bai-34-truong-hop-dong-dang' },
              { title: 'Bài 35: Định lí Pythagore và ứng dụng', href: '/lop8/bai-35-pythagore' },
              { title: 'Bài 36: Các trường hợp đồng dạng của hai tam giác vuông', href: '/lop8/bai-36-tam-giac-vuong-dong-dang' },
              { title: 'Bài 37: Hình đồng dạng', href: '/lop8/bai-37-hinh-dong-dang' }
            ]
          },
          {
            title: 'Chương 10: Một số hình khối trong thực tiễn',
            lessons: [
              { title: 'Bài 38: Hình chóp tam giác đều', href: '/lop8/bai-38-chop-tam-giac' },
              { title: 'Bài 39: Hình chóp tứ giác đều', href: '/lop8/bai-39-chop-tu-giac' }
            ]
          }
        ]
      }
    ]
  },
  lop9: {
    title: 'Toán 9',
    gradeStr: 'Lớp 9',
    slug: 'lop9',
    volumes: [
      {
        title: 'Tập 1',
        chapters: [
          {
            title: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
            lessons: [
              { title: 'Bài 1: Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn', href: '/lop9/bai-1-he-phuong-trinh' },
              { title: 'Bài 2: Giải hệ hai phương trình bậc nhất hai ẩn', href: '/lop9/bai-2-giai-he-phuong-trinh' },
              { title: 'Bài 3: Giải bài toán bằng cách lập hệ phương trình', href: '/lop9/bai-3-giai-toan-he-pt' }
            ]
          },
          {
            title: 'Chương II: Phương trình và bất phương trình bậc nhất một ẩn',
            lessons: [
              { title: 'Bài 4: Phương trình quy về phương trình bậc nhất một ẩn', href: '/lop9/bai-4-pt-quy-ve-bac-nhat' },
              { title: 'Bài 5: Bất đẳng thức và tính chất', href: '/lop9/bai-5-bat-dang-thuc' },
              { title: 'Bài 6: Bất phương trình bậc nhất một ẩn', href: '/lop9/bai-6-bat-phuong-trinh' }
            ]
          },
          {
            title: 'Chương III: Căn bậc hai và căn bậc ba',
            lessons: [
              { title: 'Bài 7: Căn bậc hai và căn thức bậc hai', href: '/lop9/bai-7-can-bac-hai' },
              { title: 'Bài 8: Khai căn bậc hai với phép nhân và phép chia', href: '/lop9/bai-8-khai-can-nhan-chia' },
              { title: 'Bài 9: Biến đổi đơn giản và rút gọn biểu thức chứa căn bậc hai', href: '/lop9/bai-9-rut-gon-can-thuc' },
              { title: 'Bài 10: Căn bậc ba và căn thức bậc ba', href: '/lop9/bai-10-can-bac-ba' }
            ]
          },
          {
            title: 'Chương IV: Hệ thức lượng trong tam giác vuông',
            lessons: [
              { title: 'Bài 11: Tỉ số lượng giác của góc nhọn', href: '/lop9/bai-11-ti-so-luong-giac' },
              { title: 'Bài 12: Một số hệ thức giữa cạnh, góc trong tam giác vuông', href: '/lop9/bai-12-he-thuc-canh-goc' }
            ]
          },
          {
            title: 'Chương V: Đường tròn',
            lessons: [
              { title: 'Bài 13: Mở đầu về đường tròn', href: '/lop9/bai-13-mo-dau-duong-tron' },
              { title: 'Bài 14: Cung và dây của một đường tròn', href: '/lop9/bai-14-cung-va-day' },
              { title: 'Bài 15: Độ dài của cung tròn. Diện tích hình quạt tròn', href: '/lop9/bai-15-cung-tron-quat-tron' },
              { title: 'Bài 16: Vị trí tương đối của đường thẳng và đường tròn', href: '/lop9/bai-16-vi-tri-tuong-doi-dt-dt' },
              { title: 'Bài 17: Vị trí tương đối của hai đường tròn', href: '/lop9/bai-17-vi-tri-tuong-doi-hai-duong-tron' }
            ]
          }
        ]
      },
      {
        title: 'Tập 2',
        chapters: [
          {
            title: 'Chương VI: Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn',
            lessons: [
              { title: 'Bài 18: Hàm số y = ax² (a ≠ 0)', href: '/lop9/bai-18-ham-so-bac-hai' },
              { title: 'Bài 19: Phương trình bậc hai một ẩn', href: '/lop9/bai-19-phuong-trinh-bac-hai' },
              { title: 'Bài 20: Định lí Viète và ứng dụng', href: '/lop9/bai-20-dinh-li-viete' },
              { title: 'Bài 21: Giải bài toán bằng cách lập phương trình', href: '/lop9/bai-21-giai-toan-bang-lap-pt' }
            ]
          },
          {
            title: 'Chương VII: Tần số và tần số tương đối',
            lessons: [
              { title: 'Bài 22: Bảng tần số và biểu đồ tần số', href: '/lop9/bai-22-bang-tan-so' },
              { title: 'Bài 23: Bảng tần số tương đối và biểu đồ tần số tương đối', href: '/lop9/bai-23-tan-so-tuong-doi' },
              { title: 'Bài 24: Bảng tần số, tần số tương đối ghép nhóm và biểu đồ', href: '/lop9/bai-24-ghep-nhom' }
            ]
          },
          {
            title: 'Chương VIII: Xác suất của biến cố trong một số mô hình xác suất đơn giản',
            lessons: [
              { title: 'Bài 25: Phép thử ngẫu nhiên và không gian mẫu', href: '/lop9/bai-25-phep-thu-ngau-nhien' },
              { title: 'Bài 26: Xác suất của biến cố liên quan tới phép thử', href: '/lop9/bai-26-xac-suat-bien-co' }
            ]
          },
          {
            title: 'Chương IX: Đường tròn ngoại tiếp và đường tròn nội tiếp',
            lessons: [
              { title: 'Bài 27: Góc nội tiếp', href: '/lop9/bai-27-goc-noi-tiep' },
              { title: 'Bài 28: Đường tròn ngoại tiếp và đường tròn nội tiếp của một tam giác', href: '/lop9/bai-28-dt-noi-ngoai-tiep-tam-giac' },
              { title: 'Bài 29: Tứ giác nội tiếp', href: '/lop9/bai-29-tu-giac-noi-tiep' },
              { title: 'Bài 30: Đa giác đều', href: '/lop9/bai-30-da-giac-deu' }
            ]
          },
          {
            title: 'Chương X: Một số hình khối trong thực tiễn',
            lessons: [
              { title: 'Bài 31: Hình trụ và hình nón', href: '/lop9/bai-31-hinh-tru-non' },
              { title: 'Bài 32: Hình cầu', href: '/lop9/bai-32-hinh-cau' }
            ]
          }
        ]
      }
    ]
  }
};
