'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faGem, faTerminal, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PublicLayout from '@/components/layouts/PublicLayout';

export default function LoginPage() {
  const router = useRouter();

  // Auto-redirect to dashboard after a short delay (beta mode)
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <PublicLayout>
      <div className="flex items-center justify-center p-6 min-h-[80vh]">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/worldland-logo.png" alt="Worldland" width={180} height={50} />
          </div>
          <p className="text-gray-500 text-sm">Decentralized GPU Cloud Platform</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-[#111] border border-[#333] rounded-md p-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold text-center">Welcome to Beta</h2>
            <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full font-medium">
              Beta
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-8 text-center">No login required — explore the GPU cloud platform</p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: faRocket, text: 'Deploy GPU containers instantly' },
              { icon: faGem, text: 'Pay-as-you-go pricing' },
              { icon: faTerminal, text: 'SSH access to your containers' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]">
                <FontAwesomeIcon icon={feature.icon} className="text-red-400 w-5 h-5" />
                <span className="text-sm text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Enter Dashboard */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            Enter Dashboard
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-red-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-red-400 hover:underline">Privacy Policy</a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Back to Home</span>
          </Link>
        </div>
        </div>
      </div>
    </PublicLayout>
  );
}
