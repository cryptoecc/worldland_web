'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthedLayoutProps {
    children: ReactNode;
}

/**
 * Shared layout wrapper for authenticated pages.
 * In beta mode, all pages are accessible without login.
 */
export default function AuthedLayout({ children }: AuthedLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-gray-800 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Image src="/worldland-logo.png" alt="Worldland" width={140} height={40} />
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/jobs" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Jobs
                        </Link>
                        <Link href="/deploy" className="text-sm text-gray-400 hover:text-white transition-colors">
                            GPUs
                        </Link>
                        <span className="text-xs px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full font-medium">
                            Beta
                        </span>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            {children}
        </div>
    );
}
