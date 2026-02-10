'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faArrowRight,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import PublicLayout from '@/components/layouts/PublicLayout';

const pricingPlans = [
    {
        id: 'ondemand',
        name: 'On-Demand',
        description: 'Pay as you go',
        price: 'From $0.50',
        unit: '/hr',
        discount: null,
        features: [
            'No commitment required',
            'Pay only for what you use',
            'Start/stop anytime',
            'All GPU types available',
            'Basic support',
        ],
        highlighted: false,
    },
    {
        id: '3month',
        name: '3 Months',
        description: 'Short-term commitment',
        price: 'From $0.45',
        unit: '/hr',
        discount: '10% off',
        features: [
            'Reserved capacity',
            '10% discount',
            'Priority support',
            'All GPU types available',
            'Cancel anytime with notice',
        ],
        highlighted: false,
    },
    {
        id: '6month',
        name: '6 Months',
        description: 'Best value',
        price: 'From $0.40',
        unit: '/hr',
        discount: '20% off',
        features: [
            'Reserved capacity',
            '20% discount',
            'Priority support',
            'All GPU types available',
            'Dedicated account manager',
        ],
        highlighted: true,
    },
    {
        id: '1year',
        name: '1 Year',
        description: 'Enterprise commitment',
        price: 'From $0.35',
        unit: '/hr',
        discount: '30% off',
        features: [
            'Reserved capacity',
            '30% discount',
            '24/7 premium support',
            'Custom configurations',
            'SLA guarantee',
        ],
        highlighted: false,
    },
];

const gpuPricing = [
    { name: 'NVIDIA H100 80GB', ondemand: '$4.50', monthly: '$3.15' },
    { name: 'NVIDIA A100 80GB', ondemand: '$2.80', monthly: '$1.96' },
    { name: 'NVIDIA L40 48GB', ondemand: '$2.20', monthly: '$1.54' },
    { name: 'NVIDIA A40 48GB', ondemand: '$1.90', monthly: '$1.33' },
    { name: 'NVIDIA RTX 4090 24GB', ondemand: '$1.20', monthly: '$0.84' },
];

export default function PricingPage() {
    return (
        <PublicLayout>
            <main className="px-8 md:px-16 lg:px-24 py-12">
                <div className="max-w-[1400px] mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                Simple, Transparent Pricing
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Pay only for what you use. No hidden fees, no surprises.
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {pricingPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative bg-[#111111] border rounded-md p-6 transition-all ${plan.highlighted
                                        ? 'border-red-500 scale-105'
                                        : 'border-[#222222] hover:border-red-500/30'
                                        }`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                            <FontAwesomeIcon icon={faStar} />
                                            Best Value
                                        </div>
                                    )}

                                    <div className="text-center mb-6">
                                        <h2 className="text-lg font-bold mb-1">{plan.name}</h2>
                                        <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold text-white">{plan.price}</span>
                                            <span className="text-gray-500">{plan.unit}</span>
                                        </div>
                                        {plan.discount && (
                                            <span className="inline-block mt-2 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
                                                {plan.discount}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 text-sm text-gray-400">
                                                <FontAwesomeIcon icon={faCheck} className="text-red-500 text-xs" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href="/get-started"
                                        className={`w-full py-3 rounded-lg font-semibold text-center transition-all flex items-center justify-center gap-2 ${plan.highlighted
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333]'
                                            }`}
                                    >
                                        Get Started
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* GPU Pricing Table */}
                        <div className="bg-[#111111] border border-[#222222] rounded-md p-6">
                            <h2 className="text-xl font-bold mb-6 text-center">GPU Pricing</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#222]">
                                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">GPU Model</th>
                                            <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400">On-Demand</th>
                                            <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400">1 Year (30% off)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gpuPricing.map((gpu, index) => (
                                            <tr key={index} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                                                <td className="py-4 px-4 font-medium">{gpu.name}</td>
                                                <td className="py-4 px-4 text-center text-gray-400">{gpu.ondemand}/hr</td>
                                                <td className="py-4 px-4 text-center text-red-400 font-semibold">{gpu.monthly}/hr</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </div>
            </main>
        </PublicLayout>
    );
}
