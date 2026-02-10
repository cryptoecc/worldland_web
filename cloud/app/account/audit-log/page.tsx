'use client';

import { useAuth } from '@/hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHistory,
    faSignInAlt,
    faSignOutAlt,
    faServer,
    faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import AuthedLayout from '@/components/layouts/AuthedLayout';

// Mock audit log data
const auditLogs = [
    { id: 1, action: 'Login', details: 'Logged in from Chrome on Windows', timestamp: '2024-12-16 14:32:15', icon: faSignInAlt, type: 'auth' },
    { id: 2, action: 'Instance Created', details: 'Created GPU instance #1234', timestamp: '2024-12-16 12:20:00', icon: faServer, type: 'instance' },
    { id: 3, action: 'Payment', details: 'Added $50.00 to balance', timestamp: '2024-12-15 18:45:30', icon: faMoneyBill, type: 'billing' },
    { id: 4, action: 'Login', details: 'Logged in from Safari on macOS', timestamp: '2024-12-15 09:12:45', icon: faSignInAlt, type: 'auth' },
    { id: 5, action: 'Instance Stopped', details: 'Stopped GPU instance #1233', timestamp: '2024-12-14 22:30:00', icon: faServer, type: 'instance' },
    { id: 6, action: 'Logout', details: 'Logged out', timestamp: '2024-12-14 18:00:00', icon: faSignOutAlt, type: 'auth' },
];

export default function AuditLogPage() {
    const { user } = useAuth();

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'auth': return 'bg-blue-500/20 text-blue-400';
            case 'instance': return 'bg-green-500/20 text-green-400';
            case 'billing': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <AuthedLayout>
            <main className="px-8 md:px-16 lg:px-24 py-12">
                    <div className="max-w-[1000px] mx-auto">
                        {/* Page Title */}
                        <div className="mb-12">
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <FontAwesomeIcon icon={faHistory} className="text-red-500" />
                                Audit Log
                            </h1>
                            <p className="text-gray-400">Your account activity history</p>
                        </div>

                        {/* Audit Log List */}
                        <div className="bg-[#111111] border border-[#222222] rounded-md overflow-hidden">
                            {auditLogs.map((log, index) => (
                                <div
                                    key={log.id}
                                    className={`p-6 flex items-center gap-4 ${index !== auditLogs.length - 1 ? 'border-b border-[#222]' : ''} hover:bg-[#1a1a1a] transition-colors`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(log.type)}`}>
                                        <FontAwesomeIcon icon={log.icon} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{log.action}</div>
                                        <div className="text-sm text-gray-500">{log.details}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">{log.timestamp}</div>
                                </div>
                            ))}
                        </div>
                </div>
            </main>
        </AuthedLayout>
    );
}
