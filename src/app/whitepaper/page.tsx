import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Sách Trắng (Whitepaper)
            </h1>
        </div>

        <Card className="bg-gray-900 border-purple-500/30">
          <CardContent className="p-6 md:p-10 space-y-8 text-gray-200 leading-relaxed">

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white">DỰ ÁN "CONNECT": PHÁC THẢO SÁCH TRẮNG BAN ĐẦU</h2>
                <h3 className="text-xl font-semibold text-purple-300">KIẾN TRÚC ỨNG DỤNG TOÀN DIỆN & TỐI ƯU</h3>
                <p className="italic text-gray-400">Tiêu đề: CONNECT - Web3 Social: Kiến tạo Vũ trụ Phi tập trung cho Sáng tạo, Kết nối và Kinh tế Mở trên Pi Network.</p>

                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <h4 className="font-bold text-white mb-2">Tóm tắt Dự án</h4>
                    <p>CONNECT là một siêu ứng dụng mạng xã hội video ngắn Web3 thế hệ mới, được thiết kế để trao quyền tối đa cho người dùng. Tích hợp sâu với hệ sinh thái Pi Network, CONNECT cung cấp một nền tảng toàn diện cho sáng tạo nội dung, thương mại điện tử phi tập trung, giải trí GameFi, và kết nối cộng đồng, tất cả được hỗ trợ bởi Trí tuệ Nhân tạo và công nghệ blockchain. Với khả năng tùy biến giao diện vô hạn, cơ chế bảo mật tài khoản hàng đầu, và một mô hình kinh tế công bằng, CONNECT hướng tới việc xây dựng một vũ trụ kỹ thuật số nơi người dùng là chủ thể sở hữu thực sự của giá trị và dữ liệu.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">1. Nền tảng Công nghệ & Trải nghiệm Người dùng Cốt lõi</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Kiến trúc Next.js (Phiên bản 13+, App Router):</strong> Nền tảng phát triển tiên tiến, đảm bảo hiệu suất, khả năng mở rộng, SEO và trải nghiệm di động mượt mà. Tối ưu hóa tải trang bằng Server Components và hỗ trợ Progressive Web App (PWA).</li>
                    <li><strong>Thiết kế Giao diện Tùy chỉnh Toàn diện:</strong> Thế giới Chủ đề Động, Thư viện Theme & Marketplace, Tính năng Phân Cấp Giao diện.</li>
                    <li><strong>Tối ưu Di động & Pi Browser:</strong> Thiết kế "mobile-first", đảm bảo hiển thị tối ưu trên Pi Browser.</li>
                    <li><strong>Trạng thái Kết nối Pi SDK Tường minh:</strong> Thanh thông báo động hiển thị rõ ràng quá trình kết nối với Pi Network.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">2. Quản lý Tài khoản & Bảo mật Tối cao</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Đăng nhập Bằng Tài khoản Pi Network:</strong> Đồng bộ hóa User Pi, Hỗ trợ người dùng Pi đa trạng thái (có/chưa có ví Mainnet).</li>
                    <li><strong>Tuân thủ Chính sách Pi Network:</strong> Tuân thủ KYC, AML, chống gian lận của Pi Core Team.</li>
                    <li><strong>Xác minh Tiên tiến & Uy tín:</strong> Tích hợp KYC của Pi, Xác minh đa yếu tố (MFA).</li>
                    <li><strong>Quét Vi Phạm:</strong> AI-Powered Content Scan, Hệ thống báo cáo cộng đồng.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">3. Tích hợp Đa dạng & Sáng tạo với AI và Hệ sinh thái Pi</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Công cụ Sáng tạo Video Hỗ trợ AI:</strong> Biên tập AI-driven, Kịch bản & Ý tưởng AI, Tối ưu hóa đề xuất nội dung.</li>
                    <li><strong>Hệ thống Quà tặng & Icon Tùy chỉnh:</strong> Thư viện Icon đa dạng, Quà tặng 3D & Hiệu ứng động.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">4. Tương tác Cộng đồng & Mô hình Kinh tế Pi Toàn diện</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Tính năng Mạng xã hội Đầy đủ:</strong> Hồ sơ cá nhân, tương tác, theo dõi, nhóm cộng đồng.</li>
                    <li><strong>Chức năng Điểm danh:</strong> Phần thưởng đa dạng, Chuỗi điểm danh (Streak Bonus).</li>
                    <li><strong>Thương mại Điện tử Phi tập trung:</strong> Cửa hàng người bán hàng cá nhân, Tiếp thị liên kết.</li>
                    <li><strong>Thi đấu Live Trực Tiếp Nâng Cao:</strong> Tương tác đa chiều, Thử thách & Thi đấu đa người chơi.</li>
                    <li><strong>Tích hợp Trò chơi Bên thứ 3 (GameFi):</strong> Mô hình Play-to-Earn.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">5. Cá nhân hóa & Cộng đồng Mạnh mẽ</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Chatbot AI "CONNECT AI Assistant":</strong> Giao diện đẹp mắt, Di chuyển tự do, Trí tuệ kết nối toàn cầu.</li>
                    <li><strong>Khung Chat Riêng & Tùy chỉnh Màu sắc.</strong></li>
                    <li><strong>Khung Hình Đại diện Phân Cấp.</strong></li>
                </ul>
            </section>

            <section className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">6. Sách Trắng & Miễn Trừ Trách Nhiệm</h3>
                <div className="bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                    <h4 className="font-bold text-red-400 mb-2">Miễn Trừ Trách Nhiệm (Disclaimer)</h4>
                    <p className="text-sm">
                        <strong>Tính chất Thử nghiệm (Testnet):</strong> CONNECT đang trong giai đoạn phát triển và thử nghiệm. Mọi tính năng và giá trị Pi Coin chỉ mang tính minh họa.<br/><br/>
                        <strong>Không phải Lời khuyên Tài chính:</strong> Thông tin trong tài liệu này không cấu thành lời khuyên đầu tư.<br/><br/>
                        <strong>Rủi ro:</strong> Tham gia vào các dự án Web3 luôn tiềm ẩn rủi ro kỹ thuật và thị trường.
                    </p>
                </div>
            </section>

            <section className="pt-8 border-t border-gray-800">
                <h4 className="text-lg font-bold text-white mb-2">Tổng kết</h4>
                <p>CONNECT được hình dung là một siêu hệ sinh thái Web3 hoàn chỉnh, lấy người dùng làm trung tâm, nơi sự sáng tạo và giá trị được trao quyền thông qua công nghệ Pi Network, AI và blockchain. Mục tiêu là tạo ra một nền tảng không ngừng học hỏi, phát triển và tối ưu hóa để đáp ứng mọi nhu cầu của người dùng, đồng thời duy trì tính minh bạch, an toàn và tuân thủ các quy định cần thiết.</p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
