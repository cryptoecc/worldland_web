'use client';

import { Suspense, lazy, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  ArrowRight, Cpu, Shield, Zap, Server, Terminal, 
  Lock, Globe, Database, Network, ChevronDown, 
  CheckCircle, AlertTriangle, Play, Pause, Brain,
  Activity, Layers, MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Lazy load Spline
const Spline = lazy(() => import('@splinetool/react-spline'));

// --- Components ---

function SplineLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-black/50 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-2 border-[#E53935] rounded-full animate-spin" />
        <div className="absolute inset-2 border-r-2 border-[#E53935]/50 rounded-full animate-spin reverse" />
      </div>
    </div>
  );
}

function SectionHeading({ subtitle, title, align = 'center', className="" }: { subtitle: string, title: React.ReactNode, align?: 'left' | 'center', className?: string }) {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block px-3 py-1 mb-4 text-xs font-mono text-[#E53935] border border-[#E53935]/30 rounded-full bg-[#E53935]/5"
      >
        {subtitle}
      </motion.span>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl text-white font-medium tracking-tight"
        style={{ fontFamily: "'Clash Display', system-ui, sans-serif" }}
      >
        {title}
      </motion.h2>
    </div>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-3xl bg-[#18181B] border border-[#27272A] hover:border-white/20 transition-colors ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(229, 57, 53, 0.15), transparent 40%)`,
        }}
      />
      <div className="relative h-full z-10">{children}</div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-full bg-[#E53935]/20 flex items-center justify-center text-[#E53935]">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white font-display">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="min-h-screen bg-black selection:bg-[#E53935]/30 selection:text-white">
      <Header />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#E53935] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-36">
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 z-0">
          {/* Static Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          {/* Moving Beam 1 (Horizontal) */}
          <motion.div 
            className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E53935] to-transparent opacity-50"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
           {/* Moving Beam 2 (Horizontal - Delayed) */}
           <motion.div 
            className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E53935] to-transparent opacity-30"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1, repeatDelay: 3 }}
          />
          {/* Moving Beam 3 (Vertical) */}
          <motion.div 
            className="absolute top-0 right-[30%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#E53935] to-transparent opacity-30"
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div
              className="order-2 lg:order-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E53935] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E53935]"></span>
                </span>
                <span className="text-sm font-medium text-gray-200 tracking-wide group-hover:text-white transition-colors">DePIN for AI Era</span>
              </div>

              <h1 className="hero-text text-white mb-6">
                The WEB3 Cloud <br />
                <span className="text-gray-400 font-normal">for</span> Decentralized AI
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-400 mb-10 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0 tracking-wide">
                WorldLand combines <span className="text-gray-200 font-medium">blockchain technology</span> with 
                <span className="text-gray-200 font-medium"> AI-native</span> distributed GPU infrastructure to create a verifiable, decentralized compute marketplace.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <Link href="https://cloud.worldland.foundation" className="group relative px-8 py-4 bg-[#E53935] text-white font-medium rounded-full overflow-hidden shadow-[0_0_30px_rgba(229,57,53,0.3)] hover:shadow-[0_0_50px_rgba(229,57,53,0.5)] transition-all">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-2">
                    Launch Console
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link href="https://docs.worldland.foundation" className="px-8 py-4 rounded-full border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:text-white hover:border-white/20 transition-all backdrop-blur-sm">
                  Read Documentation
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 font-mono">
                <div className="flex items-center gap-2 group cursor-help">
                  <Brain className="w-4 h-4 text-[#E53935] group-hover:scale-110 transition-transform" /> 
                  <span className="group-hover:text-gray-300 transition-colors">AI-Native</span>
                </div>
                <div className="flex items-center gap-2 group cursor-help">
                  <Shield className="w-4 h-4 text-[#E53935] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-gray-300 transition-colors">Verifiable</span>
                </div>
                <div className="flex items-center gap-2 group cursor-help">
                  <Globe className="w-4 h-4 text-[#E53935] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-gray-300 transition-colors">Global</span>
                </div>
              </div>
            </motion.div>

            {/* Right: 3D Object */}
            <motion.div
              className="order-1 lg:order-2 h-[50vh] lg:h-[80vh] relative z-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
               <div className="w-full h-full">
                 <Suspense fallback={<SplineLoader />}>
                  <Spline scene="https://prod.spline.design/88t83udSe6eVbl9q/scene.splinecode" className="w-full h-full" />
                </Suspense>
               </div>
              {/* Radial Gradient for blending */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black pointer-events-none opacity-50" />
            </motion.div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-gray-500 lg:left-10 lg:translate-x-0"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </motion.div>
      </section>

      {/* 01. Bento Grid Features */}
      <section className="py-32 bg-[#09090B] border-y border-[#27272A] relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E53935] blur-[150px] rounded-full opacity-20" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935] blur-[150px] rounded-full opacity-10" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading 
            subtitle="01. SYSTEM MECHANICS" 
            title="Engineered for Efficiency" 
          />

          <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-auto gap-4">
            
            {/* ECCVCC Consensus */}
            <SpotlightCard className="md:col-span-4 p-8 min-h-[300px] flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-xl bg-[#E53935]/10 flex items-center justify-center mb-6 text-[#E53935]">
                    <Network className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400">
                    Patent Pending
                  </div>
                </div>
               
                <h3 className="text-2xl font-medium text-white mb-2 font-display">ECCVCC Consensus</h3>
                <p className="text-gray-400 max-w-md">
                  Proof-of-Work purpose-built for the GPU era. ASIC-resistant, efficient verification, 
                  and integrating computation directly into network security.
                </p>
              </div>
              <div className="mt-8 flex gap-2">
                {['ASIC-Resistant', 'Tunable Difficulty', 'VCT Randomness'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full border border-gray-700 hover:border-white/30 text-xs text-gray-300 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>

            {/* VCC Badge */}
            <SpotlightCard className="md:col-span-2 p-8 min-h-[300px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#18181B] to-[#E53935]/5">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-[#E53935] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <Lock className="relative w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Verified Credits</h3>
              <p className="text-sm text-gray-500">
                On-chain reputation system. Only successfully verified work earns VCC.
              </p>
            </SpotlightCard>

            {/* Dual Mode Switch */}
            <SpotlightCard className="md:col-span-3 p-8 min-h-[300px] flex flex-col justify-between bg-[#18181B]">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-medium text-white">Dual-Mode Operation</h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-mono border border-green-500/20">
                  <Zap className="w-3 h-3" /> Zero Idle
                </div>
              </div>
              
              <div className="relative h-32 flex items-center justify-center gap-8 group">
                <div className="text-center opacity-50 group-hover:opacity-30 transition-opacity">
                  <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-xs uppercase tracking-wider">Mining</span>
                </div>
                <div className="relative">
                  <ArrowRight className="text-gray-600" />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/2 h-full -skew-x-12"
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="text-center text-[#E53935] scale-110 group-hover:scale-125 transition-transform duration-300">
                  <Cpu className="w-10 h-10 mx-auto mb-2" />
                  <span className="text-xs uppercase tracking-wider font-bold">Service</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                Automatically switches between Mining (Security) and Service (AI Jobs) modes to maximize revenue.
              </p>
            </SpotlightCard>

            {/* Economic Security */}
            <SpotlightCard className="md:col-span-3 p-8 min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-medium text-white mb-4">Economic Security</h3>
                <ul className="space-y-3">
                  {[
                    "Collateral Staking",
                    "Slashing Penalties",
                    "Delayed Finality",
                    "Clawback Mechanism"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-[#E53935]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-black/50 border border-white/5 mt-6 border-l-2 border-l-[#E53935]">
                <p className="text-xs text-gray-500 italic">
                  "The expected value of honest execution always exceeds the expected value of cheating."
                </p>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </section>

      {/* NEW: Global Infrastructure (Added) */}
      <section className="py-32 relative overflow-hidden">
        {/* Map Dots Background (Abstract) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-[800px] h-[400px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-repeat-x bg-contain opacity-30 invert" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading 
             subtitle="02. GLOBAL SCALE" 
             title="Powering AI Worldwide" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <StatCard label="Active Nodes" value="10,000+" icon={Server} />
            <StatCard label="Countries" value="45+" icon={Globe} />
            <StatCard label="Compute Power" value="240 PetaFLOPS" icon={Cpu} />
          </div>

          <div className="relative rounded-3xl bg-[#09090B] border border-[#27272A] overflow-hidden p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(229,57,53,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,57,53,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-medium text-white mb-6">Join the Network</h3>
              <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                Turn your idle GPU into a revenue stream. Join thousands of providers building the world's largest verifiable compute cluster.
              </p>
              <Link href="https://cloud.worldland.foundation/provider" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">
                Become a Provider
              </Link>
            </motion.div>

            {/* Pulsing Dots on Map (Abstract representation) */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#E53935] rounded-full animate-ping" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#E53935] rounded-full animate-ping delay-300" />
            <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-[#E53935] rounded-full animate-ping delay-700" />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#E53935] rounded-full animate-ping delay-500" />
          </div>
        </div>
      </section>

      {/* 03. Developer Experience (Was 02) */}
      <section className="py-32 bg-[#09090B] border-y border-[#27272A]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <SectionHeading 
                align="left"
                subtitle="03. DEVELOPER EXPERIENCE" 
                title="Instant GPU Access" 
                className="mb-8"
              />
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Get on-demand GPU containers with full SSH root access. 
                Pre-installed CUDA drivers means you start training in minutes, not days.
                <br /><br />
                <span className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-4 h-4 text-[#E53935]" /> No Long-term Contracts
                </span>
              </p>
              
              <div className="flex gap-4">
                <Link href="https://cloud.worldland.foundation" className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Deploy Server
                </Link>
                <Link href="https://docs.worldland.foundation" className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors">
                  View Specs
                </Link>
              </div>
            </div>

            {/* Code Window */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="w-full md:w-1/2"
            >
              <div className="rounded-xl overflow-hidden bg-[#1E1E1E] border border-[#333] shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-[#333]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="text-xs text-gray-500 ml-2 font-mono">root@worldland-gpu-node:~</div>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed text-gray-300">
                  <p>$ ssh root@gpu-node-a100.worldland.cloud</p>
                  <p className="text-green-500">Authenticated.</p>
                  <br />
                  <p>$ nvidia-smi</p>
                  <div className="p-3 my-2 bg-black rounded border border-gray-800 text-xs text-gray-400">
                    <p>+-------------------------------------------------+</p>
                    <p>| NVIDIA-SMI 535.104.05   Driver Version: 535.104 |</p>
                    <p>|-------------------------------------------------|</p>
                    <p>| GPU  Name        Persistence-M | Bus-Id         |</p>
                    <p>|   0  NVIDIA A100       On      | 00000000:00:04 |</p>
                    <p>+-------------------------------------------------+</p>
                  </div>
                  <p>$ python3 train_model.py <span className="animate-pulse">_</span></p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 04. Verifiable Computation */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <SectionHeading 
            subtitle="04. CORE ARCHITECTURE" 
            title={<span>Trustless via <span className="text-[#E53935]">Proof</span></span>} 
          />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <p className="text-xl text-gray-300 font-light leading-relaxed">
                Traditional clouds require trust. WorldLand eliminates it. 
                Our <span className="text-white font-medium">Verification Layer</span> ensures honest execution 
                through a cryptographic commit-challenge-response protocol.
              </p>
              
              <div className="grid gap-6">
                {[
                  { title: "Commit", desc: "Provider commits execution evidence to chain" },
                  { title: "Challenge", desc: "Random audits using verifiable randomness" },
                  { title: "Respond", desc: "Provider reveals proof fragments" },
                  { title: "Verify", desc: "Deterministic on-chain verdict" }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-full border border-[#E53935] text-[#E53935] group-hover:bg-[#E53935] group-hover:text-white transition-colors flex items-center justify-center font-mono text-sm shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{step.title}</h4>
                      <p className="text-gray-500 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Visualization */}
            <SpotlightCard className="aspect-square md:aspect-video lg:aspect-square bg-black p-6 font-mono text-sm">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="space-y-2 text-green-500/80">
                <p><span className="text-blue-500">➜</span> <span className="text-white">init_verification_protocol()</span></p>
                <p className="text-gray-500">→ Generating challenge seed (ECCVCC)...</p>
                <p className="text-gray-500">→ Difficulty target: 0x0000ffff...</p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="pl-4 py-2 border-l border-gray-800 my-2"
                >
                  <p className="text-yellow-500">Wait: Provider Commitment...</p>
                  <p>Hash: 0x7f8a...9c2d [MATCH]</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                >
                  <p><span className="text-blue-500">✓</span> <span className="text-white font-bold">VERIFICATION_SUCCESS</span></p>
                  <p className="text-xs text-gray-600 mt-2">// Workload validated on block #42921</p>
                </motion.div>
              </div>
              
              <div className="absolute bottom-6 right-6">
                 <Shield className="w-16 h-16 text-[#E53935]/10" />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#E53935]" style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 80%, 0 100%)', opacity: 0.05 }} />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-medium text-white mb-8" style={{ fontFamily: "'Clash Display', system-ui, sans-serif" }}>
            Ready to <span className="text-gradient-red">Scale?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the decentralized compute revolution. Access enterprise-grade GPUs or monetize your idle hardware.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="https://cloud.worldland.foundation" className="px-10 py-5 bg-[#E53935] text-white rounded-full text-lg font-medium hover:bg-[#C62828] transition-all shadow-[0_0_40px_rgba(229,57,53,0.3)] hover:shadow-[0_0_60px_rgba(229,57,53,0.5)]">
              Start Building
            </Link>
            <Link href="https://discord.gg/yJERYVnE6a" className="px-10 py-5 bg-black border border-gray-800 text-white rounded-full text-lg font-medium hover:bg-gray-900 transition-all flex items-center gap-2">
              Join Discord
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-[#27272A]">
        <Footer />
      </div>
    </main>
  );
}



