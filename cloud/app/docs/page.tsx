'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRocket,
    faCode,
    faServer,
    faShieldAlt,
    faQuestionCircle,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import PublicLayout from '@/components/layouts/PublicLayout';

const docCategories = [
    {
        id: 'quickstart',
        icon: faRocket,
        title: 'Quick Start',
        description: 'Get up and running in 5 minutes',
        links: [
            { title: 'Introduction' },
            { title: 'Create Account' },
            { title: 'Deploy First Instance' },
        ],
    },
    {
        id: 'api',
        icon: faCode,
        title: 'API Reference',
        description: 'Complete API documentation',
        links: [
            { title: 'Authentication' },
            { title: 'Instances API' },
            { title: 'Billing API' },
        ],
    },
    {
        id: 'infrastructure',
        icon: faServer,
        title: 'Infrastructure',
        description: 'Learn about our GPU network',
        links: [
            { title: 'GPU Types' },
            { title: 'Regions' },
            { title: 'Templates' },
        ],
    },
    {
        id: 'security',
        icon: faShieldAlt,
        title: 'Security',
        description: 'Security and compliance',
        links: [
            { title: 'Data Protection' },
            { title: 'Verification' },
            { title: 'Best Practices' },
        ],
    },
];

export default function DocsPage() {
    return (
        <PublicLayout>
            <main className="px-8 md:px-16 lg:px-24 py-12">
                <div className="max-w-[1400px] mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Documentation
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Everything you need to know about deploying and managing GPU instances
                        </p>
                    </div>

                    {/* Doc Categories */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {docCategories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-[#111111] border border-[#222222] rounded-md p-6 hover:border-red-500/30 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-red-500/10 rounded flex items-center justify-center">
                                        <FontAwesomeIcon icon={category.icon} className="text-red-500 text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">{category.title}</h2>
                                        <p className="text-sm text-gray-500">{category.description}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 pl-16">
                                    {category.links.map((link, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 text-sm text-gray-500 cursor-default"
                                        >
                                            <span>{link.title}</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-[#222] text-gray-500 rounded-full">Coming Soon</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Help Section */}
                    <div className="bg-[#111111] border border-[#222222] rounded-md p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-md flex items-center justify-center mx-auto mb-6">
                            <FontAwesomeIcon icon={faQuestionCircle} className="text-red-500 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
                        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                        </p>
                        <a
                            href="mailto:support@worldland.foundation"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                        >
                            Contact Support
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
