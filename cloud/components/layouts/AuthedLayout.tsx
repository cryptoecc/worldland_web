'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface AuthedLayoutProps {
    children: ReactNode;
}

/**
 * Shared layout wrapper for authenticated pages (dashboard, jobs, account, api-console).
 * Provides a consistent header with logo, Dashboard link, and user info.
 * Redirects to /auth/login if user is not authenticated.
 */
export default function AuthedLayout({ children }: AuthedLayoutProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-900/30 border-t-red-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

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
                        <span className="text-sm text-gray-500">{user.email || user.name}</span>
                        <button
                            onClick={logout}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            {children}
        </div>
    );
}
