"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, Globe, Users, Zap, Award, Layers } from 'lucide-react';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 rounded-xl border-b border-gray-800">
            <Link href="/" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Sách Trắng CONNECT
            </h1>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Title Section */}
            <section className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                    CONNECT - Web3 Social
                </h2>
                <p className="text-xl md:text-2xl text-purple-300 font-light">
                    Kiến tạo Vũ trụ Phi tập trung cho Sáng tạo, Kết nối và Kinh tế Mở trên Pi Network.
                </p>
                <div className="h-1 w-20 bg-purple-500 mx-auto rounded-full mt-6"></div>
            </section>

            {/* Abstract */}
            <Card className="bg-gray-900 border-purple-500/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <CardContent className="p-6 md:p-10 space-y-4 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="text-blue-400" size={28} />
                        <h3 className="text-2xl font-bold text-white">Tóm tắt Dự án</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        CONNECT là một siêu ứng dụng mạng xã hội video ngắn Web3 thế hệ mới, được thiết kế để trao quyền tối đa cho người dùng. Tích hợp sâu với hệ sinh thái Pi Network, CONNECT cung cấp một nền tảng toàn diện cho sáng tạo nội dung, thương mại điện tử phi tập trung, giải trí GameFi, và kết nối cộng đồng, tất cả được hỗ trợ bởi Trí tuệ Nhân tạo và công nghệ blockchain. Với khả năng tùy biến giao diện vô hạn, cơ chế bảo mật tài khoản hàng đầu, và một mô hình kinh tế công bằng, CONNECT hướng tới việc xây dựng một vũ trụ kỹ thuật số nơi người dùng là chủ thể sở hữu thực sự của giá trị và dữ liệu.
                    </p>
                </CardContent>
            </Card>

            {/* 1. Tech & UX */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-purple-400">
                    <Layers size={28} />
                    <h3 className="text-2xl font-bold text-white">1. Nền tảng Công nghệ & Trải nghiệm Người dùng Cốt lõi</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition duration-300">
                        <h4 className="font-bold text-white mb-2">Kiến trúc Next.js (13+ App Router)</h4>
                        <p className="text-gray-400 text-sm">Nền tảng phát triển tiên tiến, đảm bảo hiệu suất, khả năng mở rộng, SEO và trải nghiệm di động mượt mà. Tối ưu hóa tải trang bằng Server Components và hỗ trợ Progressive Web App (PWA).</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition duration-300">
                        <h4 className="font-bold text-white mb-2">Full UI Customization</h4>
                        <p className="text-gray-400 text-sm">Người dùng có toàn quyền tùy chỉnh giao diện: bảng màu, phông chữ, hình nền động. Marketplace cho phép giao dịch các chủ đề tùy chỉnh.</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition duration-300">
                        <h4 className="font-bold text-white mb-2">Mobile-First & Pi Browser</h4>
                        <p className="text-gray-400 text-sm">Tối ưu hóa tuyệt đối cho trải nghiệm trên di động và môi trường Pi Browser. Thanh thông báo trạng thái kết nối Pi SDK tường minh.</p>
                    </div>
                </div>
            </section>

            {/* 2. Security */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-green-400">
                    <Shield size={28} />
                    <h3 className="text-2xl font-bold text-white">2. Quản lý Tài khoản & Bảo mật Tối cao</h3>
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-900/80 p-6 rounded-xl border-l-4 border-green-500">
                        <h4 className="font-bold text-white text-lg mb-2">Đăng nhập Pi Network Liên thông</h4>
                        <p className="text-gray-300">Mọi tài khoản phải liên kết trực tiếp với Pi Network qua SDK. Hỗ trợ cả người dùng có và chưa có ví Mainnet, khuyến khích KYC.</p>
                    </div>
                    <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
                        <li className="bg-gray-900 p-4 rounded-lg flex items-start gap-3">
                            <span className="text-green-500 font-bold">•</span>
                            <span><strong>Tuân thủ Chính sách:</strong> Thực hiện nghiêm ngặt KYC, AML và quy định chống gian lận của Pi Core Team.</span>
                        </li>
                        <li className="bg-gray-900 p-4 rounded-lg flex items-start gap-3">
                            <span className="text-green-500 font-bold">•</span>
                            <span><strong>Bảo mật Đa lớp (MFA):</strong> Tích hợp 2FA, sinh trắc học và xác minh qua Email/SĐT cho giao dịch quan trọng.</span>
                        </li>
                        <li className="bg-gray-900 p-4 rounded-lg flex items-start gap-3">
                            <span className="text-green-500 font-bold">•</span>
                            <span><strong>AI Content Scan:</strong> Tự động quét và ngăn chặn nội dung độc hại, vi phạm bản quyền bằng AI.</span>
                        </li>
                        <li className="bg-gray-900 p-4 rounded-lg flex items-start gap-3">
                            <span className="text-green-500 font-bold">•</span>
                            <span><strong>Hệ thống Danh tiếng:</strong> Phân cấp người dùng dựa trên mức độ cống hiến và tuân thủ quy tắc.</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* 3. AI & Ecosystem */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-pink-400">
                    <Zap size={28} />
                    <h3 className="text-2xl font-bold text-white">3. Tích hợp Đa dạng & Sáng tạo với AI</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-purple-900/20 p-6 rounded-xl border border-purple-500/20">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-pink-300 text-lg mb-2">AI-Powered Creation Studio</h4>
                            <p className="text-gray-300 text-sm">Công cụ biên tập thông minh: tự động cắt ghép, thêm hiệu ứng, phụ đề, và trợ lý AI lên ý tưởng kịch bản (Script-to-Video).</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-pink-300 text-lg mb-2">Dynamic Pi Gifts & Custom Emojis</h4>
                            <p className="text-gray-300 text-sm">Hệ thống quà tặng 3D động, icon độc quyền Pi Network. Mở khóa hiệu ứng đặc biệt dựa trên cấp độ người dùng.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Economy */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-yellow-400">
                    <Users size={28} />
                    <h3 className="text-2xl font-bold text-white">4. Tương tác Cộng đồng & Kinh tế Pi</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                     <div className="bg-gray-900 p-4 rounded-xl text-center border border-gray-800">
                        <div className="text-4xl mb-2">📅</div>
                        <h4 className="font-bold text-white">Điểm danh & Streak</h4>
                        <p className="text-xs text-gray-400 mt-2">Nhận thưởng token, icon độc quyền khi điểm danh hàng ngày.</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center border border-gray-800">
                        <div className="text-4xl mb-2">🛒</div>
                        <h4 className="font-bold text-white">Marketplace Phi tập trung</h4>
                        <p className="text-xs text-gray-400 mt-2">Mua bán sản phẩm số/vật lý bằng Pi. Hỗ trợ Escrow an toàn.</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center border border-gray-800">
                        <div className="text-4xl mb-2">⚔️</div>
                        <h4 className="font-bold text-white">Live Battle & GameFi</h4>
                        <p className="text-xs text-gray-400 mt-2">Thi đấu trực tiếp, nhận quà tặng từ fan. Tích hợp game P2E.</p>
                    </div>
                </div>
            </section>

             {/* 5. Personalization */}
             <section className="space-y-4">
                <div className="flex items-center gap-3 text-blue-400">
                    <Award size={28} />
                    <h3 className="text-2xl font-bold text-white">5. Cá nhân hóa & CONNECT AI Assistant</h3>
                </div>
                <p className="text-gray-300">
                    Trợ lý AI ảo với giao diện tùy chỉnh (Avatar động), di chuyển tự do trên màn hình. Khung chat, màu sắc và khung hình đại diện thay đổi theo cấp độ cống hiến.
                </p>
            </section>

            {/* Disclaimer */}
            <section className="mt-12 pt-8 border-t border-gray-800">
                <div className="bg-red-950/30 p-6 rounded-xl border border-red-900/50">
                    <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                        <Shield size={20} /> Miễn Trừ Trách Nhiệm (Disclaimer)
                    </h4>
                    <div className="space-y-3 text-sm text-gray-400">
                        <p><strong>• Tính chất Thử nghiệm (Testnet):</strong> CONNECT đang trong giai đoạn phát triển Sandbox. Mọi giá trị Pi Coin và tài sản trong giai đoạn này chỉ mang tính minh họa.</p>
                        <p><strong>• Không phải Lời khuyên Tài chính:</strong> Thông tin này không cấu thành lời khuyên đầu tư. Người dùng tự chịu trách nhiệm về quyết định của mình.</p>
                        <p><strong>• Rủi ro:</strong> Tham gia Web3 và Crypto luôn tiềm ẩn rủi ro về công nghệ và thị trường.</p>
                    </div>
                </div>
            </section>

            <div className="text-center pt-8 pb-12 text-gray-500 text-sm">
                &copy; 2024 CONNECT Project. All rights reserved on Pi Network Ecosystem.
            </div>
        </motion.div>
      </div>
    </div>
  );
}
