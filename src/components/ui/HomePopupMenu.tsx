"use client";

import React from 'react';
import Link from 'next/link';
import { User, Video } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

interface HomePopupMenuProps {
  children: React.ReactNode;
}

export const HomePopupMenu = ({ children }: HomePopupMenuProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={10}
          className="z-50 w-48 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 p-2 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <div className="flex flex-col gap-1">
            <Link
              href="/app/profile/me"
              className="flex items-center gap-3 p-2 text-sm text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Vào trang cá nhân</span>
            </Link>
            <Link
              href="/app"
              className="flex items-center gap-3 p-2 text-sm text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Quay lại video</span>
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};