'use client';

import Link from 'next/link';
import Image from 'next/image';
import HeaderNav from '@/components/HeaderNav';
import AuthHeader from '@/components/AuthHeader';
import BackgroundTerminal from '@/components/BackgroundTerminal';
import { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    /** If true, skip the animated terminal background (e.g. for pages with their own bg) */
    noBackground?: boolean;
}

/**
 * Shared layout wrapper for all public (non-authenticated) pages.
 * Provides a consistent header with dropdown navigation and auth controls,
 * plus an optional BackgroundTerminal + gradient overlay.
 */
export default function PublicLayout({ children, noBackground }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Background */}
            {!noBackground && (
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 z-10 pointer-events-none" />
                    <BackgroundTerminal />
                </div>
            )}

            {/* Content */}
            <div className="relative z-20 pointer-events-none">
                {/* Header */}
                <header className="relative z-50 px-8 md:px-16 lg:px-24 py-6 pointer-events-auto">
                    <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <Image src="/worldland-logo.png" alt="Worldland" width={140} height={40} />
                        </Link>
                        <HeaderNav />
                        <AuthHeader />
                    </div>
                </header>

                {/* Page Content */}
                <div className="pointer-events-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
