'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FaucetPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center relative overflow-hidden pt-24">
         {/* Background Elements */}
         <div className="absolute inset-0 z-0">
            <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-[#E53935] blur-[150px] rounded-full opacity-10 animate-pulse" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
         </div>

         <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 bg-[#E53935]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#E53935]/20"
            >
              <Droplets className="w-10 h-10 text-[#E53935]" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Faucet is Coming Soon
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg max-w-md mx-auto"
            >
              The WorldLand Testnet Faucet is under maintenance. Please check back later for WL tokens.
            </motion.p>
         </div>
      </div>

      <Footer />
    </main>
  );
}
