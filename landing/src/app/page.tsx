'use client';

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Globe, Shield, Zap, Server, Users, Terminal, ChevronDown, BookOpen, Coins, Lock, Workflow } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

// Lazy load Spline
const Spline = lazy(() => import('@splinetool/react-spline'));

// Spline loader
function SplineLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-[#E53935]/30 border-t-[#E53935] animate-spin" />
    </div>
  );
}

// Features data
const features = [
  { icon: Cpu, title: 'Enterprise GPUs', description: 'Access NVIDIA A100/H100 GPUs at competitive prices for AI training and inference.' },
  { icon: Shield, title: 'Verifiable Computation', description: 'ECCVCC blockchain cryptographically proves GPU work was actually performed.' },
  { icon: Terminal, title: 'Instant SSH Access', description: 'Get immediate SSH access with pre-installed CUDA environments. Zero setup.' },
  { icon: Server, title: 'Kubernetes-Powered', description: 'Enterprise-grade infrastructure with high availability and auto-scaling.' },
  { icon: Zap, title: 'DePIN Architecture', description: 'Decentralized Physical Infrastructure Network for reliable GPU access.' },
  { icon: Users, title: '90% Revenue Share', description: 'GPU providers earn passive income from their idle resources.' },
];

// Stats data
const stats = [
  { value: '10K+', label: 'Active GPUs' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '90%', label: 'Provider Revenue' },
  { value: '<100ms', label: 'Latency' },
];

// Use cases
const useCases = [
  { icon: Cpu, title: 'AI Model Training', description: 'Train large language models and deep learning networks with powerful GPUs.' },
  { icon: Zap, title: 'AI Inference', description: 'Deploy models with sub-100ms latency for real-time applications.' },
  { icon: Workflow, title: 'Scientific Computing', description: 'Run complex simulations and research workloads with CUDA acceleration.' },
  { icon: Lock, title: 'Rendering & Graphics', description: 'Professional rendering and 3D graphics processing at scale.' },
];

// Ecosystem links
const ecosystemLinks = [
  { title: 'GPU Cloud', description: 'Rent enterprise-grade GPUs', href: 'https://cloud.worldland.foundation', icon: Cpu },
  { title: 'Explorer', description: 'Browse blockchain transactions', href: 'https://scan.worldland.foundation', icon: Globe },
  { title: 'Documentation', description: 'Learn how to get started', href: 'https://docs.worldland.foundation', icon: BookOpen },
  { title: 'DAO Vote', description: 'Participate in governance', href: 'https://dao.worldland.foundation', icon: Users },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<SplineLoader />}>
            <Spline
              scene="https://prod.spline.design/3PHhg6ZQXun6TJq9/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 text-sm text-[#E53935]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E53935] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E53935]" />
              </span>
              DePIN for AI Era
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-white mb-6"
            style={{ 
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(48px, 10vw, 120px)',
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-gradient-red">GPU</span> Power
            <br />for Everyone
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            WorldLand is a <span className="text-white">Decentralized GPU Infrastructure Network</span> that democratizes access to compute. 
            Built on <span className="text-white">ECCVCC blockchain</span> for verifiable computation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href="https://cloud.worldland.foundation"
              className="group flex items-center gap-2 px-8 py-4 bg-[#E53935] hover:bg-[#C62828] text-white font-semibold rounded-xl transition-all"
            >
              <Cpu className="w-5 h-5" />
              Launch Console
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://docs.worldland.foundation"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Read Docs
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </motion.div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#09090B]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-medium text-[#E53935] uppercase tracking-widest">Ecosystem</span>
            <h2 className="display-text text-white mt-4">
              Explore <span className="text-gradient-red">WorldLand</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemLinks.map((link, i) => (
              <motion.a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl bg-[#18181B] border border-[#27272A] hover:border-[#E53935]/50 hover:bg-[#1f1f23] transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E53935]/10 flex items-center justify-center mb-4 group-hover:bg-[#E53935]/20 transition-colors">
                  <link.icon className="w-6 h-6 text-[#E53935]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {link.title}
                </h3>
                <p className="text-sm text-gray-500">{link.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-medium text-[#E53935] uppercase tracking-widest">Why WorldLand</span>
            <h2 className="display-text text-white mt-4">
              Built for the <span className="text-gradient-red">AI Era</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group p-6 rounded-2xl bg-[#18181B] border border-[#27272A] hover:border-[#E53935]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E53935]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#E53935]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 bg-gradient-to-b from-[#09090B] to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-medium text-[#E53935] uppercase tracking-widest">Use Cases</span>
            <h2 className="display-text text-white mt-4">
              Power Your <span className="text-gradient-red">Workloads</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, i) => (
              <motion.div
                key={useCase.title}
                className="p-8 rounded-2xl bg-gradient-to-br from-[#18181B] to-[#0f0f11] border border-[#27272A] hover:border-[#E53935]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#E53935]/10 flex items-center justify-center shrink-0">
                    <useCase.icon className="w-7 h-7 text-[#E53935]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {useCase.title}
                    </h3>
                    <p className="text-gray-500">{useCase.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-medium text-[#E53935] uppercase tracking-widest">Our Vision</span>
              <h2 className="display-text text-white mt-4 mb-6">
                Personal AI for Everyone
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                We believe in a future where individuals can train, own, and run their AI models without relying on Big Tech infrastructure. 
                WorldLand bridges the gap between "GPU Rich" and "GPU Poor".
              </p>
              <div className="space-y-4">
                {['Individual Sovereignty', 'Verifiable Integrity', 'Privacy & Isolation', 'Democratized Access'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#E53935]" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="relative h-80 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ boxShadow: '0 0 80px rgba(229, 57, 53, 0.2)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/20 via-[#18181B] to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gradient-red mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    My AI
                  </div>
                  <div className="text-gray-500">Network</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Section */}
      <section className="relative h-[80vh] bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={<SplineLoader />}>
            <Spline
              scene="https://prod.spline.design/88t83udSe6eVbl9q/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
        </div>
        {/* Optional Overlay Content */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">Interact with the model</p>
            <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Experience the Future
            </h3>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-black to-[#09090B]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            className="display-text text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Access enterprise-grade GPUs or earn passive income by providing your resources.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="https://cloud.worldland.foundation"
              className="group flex items-center gap-2 px-8 py-4 bg-[#E53935] hover:bg-[#C62828] text-white font-semibold rounded-xl transition-all"
            >
              Rent GPU Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://docs.worldland.foundation"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
            >
              Read Documentation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#09090B] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Product</h4>
              <div className="space-y-2">
                <Link href="https://cloud.worldland.foundation" className="block text-gray-500 hover:text-white text-sm transition-colors">GPU Cloud</Link>
                <Link href="https://scan.worldland.foundation" className="block text-gray-500 hover:text-white text-sm transition-colors">Explorer</Link>
                <Link href="/bridge" className="block text-gray-500 hover:text-white text-sm transition-colors">Bridge</Link>
                <Link href="/swap" className="block text-gray-500 hover:text-white text-sm transition-colors">Swap</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Resources</h4>
              <div className="space-y-2">
                <Link href="https://docs.worldland.foundation" className="block text-gray-500 hover:text-white text-sm transition-colors">Documentation</Link>
                <Link href="https://github.com/cryptoecc/WorldLand" className="block text-gray-500 hover:text-white text-sm transition-colors">GitHub</Link>
                <Link href="/learn" className="block text-gray-500 hover:text-white text-sm transition-colors">Learn</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Community</h4>
              <div className="space-y-2">
                <Link href="https://dao.worldland.foundation" className="block text-gray-500 hover:text-white text-sm transition-colors">DAO Vote</Link>
                <Link href="https://discord.gg/yJERYVnE6a" className="block text-gray-500 hover:text-white text-sm transition-colors">Discord</Link>
                <Link href="https://twitter.com/Worldland_space" className="block text-gray-500 hover:text-white text-sm transition-colors">Twitter</Link>
                <Link href="https://medium.com/@worldland-official" className="block text-gray-500 hover:text-white text-sm transition-colors">Medium</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Company</h4>
              <div className="space-y-2">
                <Link href="/contact" className="block text-gray-500 hover:text-white text-sm transition-colors">Contact</Link>
                <Link href="https://www.youtube.com/@Worldland-2023" className="block text-gray-500 hover:text-white text-sm transition-colors">YouTube</Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#27272A]">
            <div className="text-2xl font-bold text-white mb-4 md:mb-0" style={{ fontFamily: 'var(--font-display)' }}>
              World<span className="text-[#E53935]">Land</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2026 WorldLand. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
