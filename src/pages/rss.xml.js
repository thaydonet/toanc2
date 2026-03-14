import rss from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Toán THCS KNTT',
    description: 'Hệ thống học toán THCS Kết nối tri thức với cuộc sống',
    site: context.site,
    items: [
      {
        title: 'Toán Lớp 6 - Tập hợp & Phân số',
        link: '/lop6/',
        description: 'Khám phá tập hợp số tự nhiên, tính chia hết, số nguyên, phân số và các hình học phẳng cơ bản.',
        pubDate: new Date('2024-01-01'),
      },
      {
        title: 'Toán Lớp 7 - Đại số & Tam giác',
        link: '/lop7/',
        description: 'Số hữu tỉ, số thực, góc và đường thẳng song song, các trường hợp bằng nhau của tam giác, biểu thức đại số.',
        pubDate: new Date('2024-01-01'),
      },
      {
        title: 'Toán Lớp 8 - Hàm số & Tứ giác',
        link: '/lop8/',
        description: 'Đa thức, hằng đẳng thức, hàm số bậc nhất và đồ thị, định lý Thalès, tứ giác và tam giác đồng dạng.',
        pubDate: new Date('2024-01-01'),
      },
      {
        title: 'Toán Lớp 9 - Hệ phương trình & Đường tròn',
        link: '/lop9/',
        description: 'Căn thức, hệ phương trình, phương trình bậc hai, hệ thức lượng, đường tròn nội tiếp và ngoại tiếp.',
        pubDate: new Date('2024-01-01'),
      },
    ],
    customData: `<language>vi-VN</language>`,
  });
}
