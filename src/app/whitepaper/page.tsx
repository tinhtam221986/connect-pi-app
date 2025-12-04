import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/profile" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                    <ArrowLeft className="text-white" />
                </Link>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    CONNECT Whitepaper
                </h1>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-purple-400">
                        DỰ ÁN "CONNECT": PHÁC THẢO SÁCH TRẮNG BAN ĐẦU
                    </CardTitle>
                    <p className="text-gray-400 italic">
                        Web3 Social: Kiến tạo Vũ trụ Phi tập trung cho Sáng tạo, Kết nối và Kinh tế Mở trên Pi Network.
                    </p>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
                    
                    <section>
                        <h3 className="text-xl font-bold text-white mb-2">Tóm tắt Dự án</h3>
                        <p>
                            CONNECT là một siêu ứng dụng mạng xã hội video ngắn Web3 thế hệ mới, được thiết kế để trao quyền tối đa cho người dùng. 
                            Tích hợp sâu với hệ sinh thái Pi Network, CONNECT cung cấp một nền tảng toàn diện cho sáng tạo nội dung, 
                            thương mại điện tử phi tập trung, giải trí GameFi, và kết nối cộng đồng, tất cả được hỗ trợ bởi Trí tuệ Nhân tạo và công nghệ blockchain.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-2">1. Nền tảng Công nghệ & Trải nghiệm Người dùng Cốt lõi</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong className="text-purple-300">Kiến trúc Next.js (App Router):</strong> 
                                Nền tảng phát triển tiên tiến, đảm bảo hiệu suất, khả năng mở rộng, SEO và trải nghiệm di động mượt mà. PWA Ready.
                            </li>
                            <li>
                                <strong className="text-purple-300">Thiết kế Giao diện Tùy chỉnh (Full UI Customization):</strong>
                                Người dùng có toàn quyền tùy chỉnh bảng màu, phông chữ, và hình nền. Marketplace nội bộ cho phép mua bán Themes.
                            </li>
                            <li>
                                <strong className="text-purple-300">Tối ưu Di động & Pi Browser:</strong>
                                Thiết kế "mobile-first", hoạt động hoàn hảo trong môi trường Pi Browser.
                            </li>
                            <li>
                                <strong className="text-purple-300">Trạng thái Kết nối Pi SDK Tường minh:</strong>
                                Hiển thị rõ ràng quá trình kết nối với Pi Network ("Đang tìm kiếm...", "Đã kết nối").
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-2">2. Quản lý Tài khoản & Bảo mật (Đăng ký & Tuân thủ)</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong className="text-purple-300">Đăng nhập Bằng Pi Network:</strong>
                                Bắt buộc liên kết tài khoản Pi. Hỗ trợ cả người dùng chưa có ví Mainnet (khuyến khích KYC).
                            </li>
                            <li>
                                <strong className="text-purple-300">Tuân thủ Chính sách Pi Core Team:</strong>
                                Nghiêm ngặt tuân thủ KYC, chống rửa tiền (AML), và các quy định về tokenomics.
                            </li>
                            <li>
                                <strong className="text-purple-300">Xác minh Tiên tiến (Enhanced Verification):</strong>
                                Tích hợp kết quả KYC từ Pi. Hỗ trợ 2FA và xác minh sinh trắc học.
                            </li>
                            <li>
                                <strong className="text-purple-300">Quét Vi Phạm (Content Moderation):</strong>
                                AI tự động quét nội dung vi phạm (bạo lực, 18+, lừa đảo). Hệ thống báo cáo từ cộng đồng.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-2">3. Tích hợp Đa dạng & Sáng tạo với AI</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong className="text-purple-300">AI Creation Studio:</strong>
                                Công cụ biên tập video thông minh, tự động cắt ghép, thêm hiệu ứng, phụ đề. Trợ lý AI lên ý tưởng kịch bản.
                            </li>
                            <li>
                                <strong className="text-purple-300">Hệ thống Quà tặng 3D & Emoji:</strong>
                                Bộ sưu tập icon Pi độc quyền và quà tặng 3D động hiển thị tức thì trên màn hình livestream.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-2">4. Mô hình Kinh tế Pi & Tương tác Cộng đồng</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong className="text-purple-300">Điểm danh (Daily Rewards):</strong>
                                Nhận token tiện ích và quyền lợi khi điểm danh hàng ngày (Streak Bonus).
                            </li>
                            <li>
                                <strong className="text-purple-300">Marketplace Phi tập trung:</strong>
                                Creator Storefronts cho phép bán sản phẩm vật lý/số bằng Pi. Hỗ trợ Tiếp thị liên kết (Affiliate).
                            </li>
                            <li>
                                <strong className="text-purple-300">Live Streaming Battles:</strong>
                                Thi đấu trực tiếp, PK giữa các Creator với sự ủng hộ (Donate/Boost) từ khán giả.
                            </li>
                             <li>
                                <strong className="text-purple-300">GameFi Ecosystem:</strong>
                                Tích hợp game Play-to-Earn bên thứ 3.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-2">5. Cá nhân hóa & CONNECT AI Assistant</h3>
                        <p>
                            Chatbot AI với giao diện Hologram, có thể di chuyển tự do trên màn hình. Hỗ trợ giải đáp thông tin và tương tác thông minh.
                            Khung Avatar phân cấp theo mức độ cống hiến.
                        </p>
                    </section>

                    <section className="bg-red-950/30 p-4 rounded-lg border border-red-900/50">
                        <h3 className="text-xl font-bold text-red-400 mb-2">6. Miễn Trừ Trách Nhiệm (Disclaimer)</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                            <li>
                                <strong>Tính chất Thử nghiệm:</strong> CONNECT đang chạy trên Pi Testnet. Mọi giá trị Pi Coin chỉ mang tính minh họa.
                            </li>
                            <li>
                                <strong>Không phải Lời khuyên Tài chính:</strong> Thông tin không cấu thành lời khuyên đầu tư.
                            </li>
                            <li>
                                <strong>Rủi ro:</strong> Tham gia Web3 luôn tiềm ẩn rủi ro kỹ thuật và pháp lý. Người dùng tự chịu trách nhiệm về hành động của mình.
                            </li>
                        </ul>
                    </section>

                </CardContent>
            </Card>
        </div>
    </div>
  );
}
