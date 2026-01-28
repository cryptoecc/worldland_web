import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 bg-black text-sm border-t border-[#27272A]">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 relative flex items-center justify-center overflow-hidden">
            <img 
              src="/images/logo.png" 
              alt="Worldland Logo" 
              className="w-full h-full object-contain scale-[3.5]"
            />
          </div>
          <div className="font-bold text-xl tracking-tight text-white -ml-0.5">
            Worldland
          </div>
          <span className="text-gray-600 mx-2">|</span>
          <span className="text-gray-500">Thinking for Everyone</span>
        </div>
        <div className="flex gap-8 text-gray-500">
          <Link href="https://docs.worldland.foundation" className="hover:text-white transition-colors">Docs</Link>
          <Link href="https://github.com/cryptoecc/WorldLand" className="hover:text-white transition-colors">GitHub</Link>
          <Link href="https://twitter.com/Worldland_space" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
        <div className="text-gray-600">
          © 2026 WorldLand Foundation
        </div>
      </div>
    </footer>
  );
}
