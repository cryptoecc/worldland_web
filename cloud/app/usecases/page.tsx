'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBrain,
    faRobot,
    faBullseye,
    faBolt,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import PublicLayout from '@/components/layouts/PublicLayout';

const usecases = [
    {
        id: 'inference',
        icon: faBrain,
        title: 'AI Inference',
        description: 'Run large language models and AI inference at scale. Deploy models like LLaMA, GPT, or custom models with optimized GPU acceleration.',
        features: ['Low latency inference', 'Auto-scaling', 'Model caching'],
    },
    {
        id: 'agent',
        icon: faRobot,
        title: 'AI Agents',
        description: 'Deploy autonomous AI agents that can perform complex tasks, interact with APIs, and execute workflows 24/7.',
        features: ['Persistent execution', 'API integrations', 'Task orchestration'],
    },
    {
        id: 'finetuning',
        icon: faBullseye,
        title: 'Fine-tuning',
        description: 'Fine-tune foundation models on your custom datasets. Train LoRA adapters, full fine-tuning, or RLHF with enterprise GPUs.',
        features: ['Multi-GPU training', 'Checkpointing', 'Distributed training'],
    },
    {
        id: 'compute',
        icon: faBolt,
        title: 'Compute-Heavy Tasks',
        description: 'Run compute-intensive workloads like scientific simulations, rendering, video processing, and cryptographic operations.',
        features: ['Batch processing', 'High throughput', 'Cost-effective scaling'],
    },
];

export default function UsecasesPage() {
    return (
        <PublicLayout>
            <main className="px-8 md:px-16 lg:px-24 py-12">
                <div className="max-w-[1400px] mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                Use Cases
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Discover how enterprises and developers leverage our GPU infrastructure for AI and compute workloads
                            </p>
                        </div>

                        {/* Usecase Cards */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {usecases.map((usecase) => (
                                <div
                                    key={usecase.id}
                                    className="bg-[#111111] border border-[#222222] rounded-md p-8 hover:border-red-500/30 transition-all group"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-red-500/10 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                                            <FontAwesomeIcon icon={usecase.icon} className="text-red-500 text-2xl" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-3">{usecase.title}</h2>
                                            <p className="text-gray-400 mb-6 leading-relaxed">{usecase.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {usecase.features.map((feature, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded-full text-xs text-gray-300"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                            <Link
                                                href="/get-started"
                                                className="text-red-500 text-sm font-semibold hover:text-red-400 transition-colors flex items-center gap-2"
                                            >
                                                Get Started
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="mt-16 text-center">
                            <div className="bg-[#111111] border border-[#222222] rounded-md p-12 max-w-2xl mx-auto">
                                <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                                <p className="text-gray-400 mb-8">Deploy your first GPU instance in minutes</p>
                                <Link
                                    href="/get-started"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-all"
                                >
                                    Start Now
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                            </div>
                        </div>
                </div>
            </main>
        </PublicLayout>
    );
}
