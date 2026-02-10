'use client';

import { useAuth } from '@/hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faBell,
    faKey,
    faSave,
} from '@fortawesome/free-solid-svg-icons';
import AuthedLayout from '@/components/layouts/AuthedLayout';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <AuthedLayout>
            <main className="px-8 md:px-16 lg:px-24 py-12">
                    <div className="max-w-[800px] mx-auto">
                        {/* Page Title */}
                        <div className="mb-12">
                            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                            <p className="text-gray-400">Manage your profile and preferences</p>
                        </div>

                        {/* Settings Sections */}
                        <div className="space-y-6">
                            {/* Profile Section */}
                            <div className="bg-[#111111] border border-[#222222] rounded-md p-6">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
                                    <FontAwesomeIcon icon={faUser} className="text-red-500" />
                                    Profile
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Username</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.email || user?.name || ''}
                                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-sm focus:border-red-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            defaultValue=""
                                            placeholder="email@example.com"
                                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-sm focus:border-red-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-[#111111] border border-[#222222] rounded-md p-6">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
                                    <FontAwesomeIcon icon={faBell} className="text-red-500" />
                                    Notifications
                                </h2>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Email notifications</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-red-500" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Instance alerts</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-red-500" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Billing reminders</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-red-500" />
                                    </label>
                                </div>
                            </div>

                            {/* Security */}
                            <div className="bg-[#111111] border border-[#222222] rounded-md p-6">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
                                    <FontAwesomeIcon icon={faKey} className="text-red-500" />
                                    Security
                                </h2>
                                <button className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm hover:bg-[#222] transition-all">
                                    Change Password
                                </button>
                            </div>

                            {/* Save Button */}
                            <button className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded transition-all flex items-center justify-center gap-2">
                                <FontAwesomeIcon icon={faSave} />
                                Save Changes
                            </button>
                        </div>
                </div>
            </main>
        </AuthedLayout>
    );
}
