'use client';

import Link from 'next/link';

export default function AuthHeader() {
    return (
        <div className="flex items-center gap-4">
            <Link
                href="/dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                Dashboard
            </Link>
            <span className="text-xs px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full font-medium">
                Beta
            </span>
        </div>
    );
}
