"use client";
import React from 'react';
import { ArrowLeft, User, Bell, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const mockConversations = [
  { id: 1, type: 'system', sender: 'System Notification', message: 'Your order #12345 has been shipped!', time: '10:42 AM', unread: 1, avatar: <Bell className="w-6 h-6 text-yellow-400" /> },
  { id: 2, type: 'user', sender: 'TRQY1986', message: 'Hey, is this item still available?', time: '9:30 AM', unread: 2, avatar: <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=TRQY1986" className="w-10 h-10 rounded-full" alt="avatar" /> },
  { id: 3, type: 'user', sender: 'DANG21986', message: 'Thanks for the fast shipping!', time: 'Yesterday', unread: 0, avatar: <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DANG21986" className="w-10 h-10 rounded-full" alt="avatar" /> },
  { id: 4, type: 'order', sender: 'Order Confirmation', message: 'Your payment for order #12344 was successful.', time: 'Yesterday', unread: 0, avatar: <Package className="w-6 h-6 text-green-500" /> },
];

export default function InboxPage() {
  const router = useRouter();

  const handleConversationClick = () => {
    toast.info("This feature is under development.");
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm border-b border-white/10 pt-safe">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Inbox</h1>
        <div className="w-8"></div>
      </header>

      {/* Conversation List */}
      <main className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-white/10">
          {mockConversations.map((conv) => (
            <li
              key={conv.id}
              onClick={handleConversationClick}
              className="flex items-center p-4 space-x-4 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                {conv.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white truncate">{conv.sender}</p>
                  <p className="text-xs text-white/50">{conv.time}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-white/70 truncate">{conv.message}</p>
                    {conv.unread > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {conv.unread}
                        </span>
                    )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
