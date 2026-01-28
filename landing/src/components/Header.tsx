'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Twitter, Youtube, Menu, X } from 'lucide-react';

// Discord Icon
const DiscordIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

// Navigation data
const navItems = [
  {
    label: 'Learn',
    href: '/learn',
  },
  {
    label: 'User',
    items: [
      { label: 'Connect Worldland', href: 'https://docs.worldland.foundation/user/wallet', external: true },
      { label: 'Run Node', href: 'https://docs.worldland.foundation/miner/install-and-run-geth', external: true },
      { label: 'Add Network', href: '#', action: 'addNetwork' },

      { type: 'divider' },
      { label: 'Bridge', href: '/bridge' },
      { label: 'Faucet', href: '/faucet' },
      { type: 'divider' },
      { label: 'Scan', href: 'https://scan.worldland.foundation/', external: true },
    ],
  },
  {
    label: 'Developer',
    items: [
      { label: 'Docs', href: 'https://docs.worldland.foundation/', external: true },
      { label: 'GitHub', href: 'https://github.com/cryptoecc/WorldLand', external: true },
    ],
  },
  {
    label: 'Cloud',
    items: [
      { label: 'GPU Console', href: 'https://cloud.worldland.foundation', external: true },
      { label: 'Pricing', href: 'https://cloud.worldland.foundation/pricing', external: true },
      { label: 'Provider SDK', href: 'https://docs.worldland.foundation/cloud/provider-sdk', external: true },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'DAO Vote', href: 'https://dao.worldland.foundation', external: true },
      { label: 'Medium', href: 'https://medium.com/@worldland-official', external: true },
      { label: 'YouTube', href: 'https://www.youtube.com/@Worldland-2023', external: true, icon: Youtube },
      { label: 'Twitter', href: 'https://twitter.com/Worldland_space', external: true, icon: Twitter },
      { label: 'Discord', href: 'https://discord.gg/yJERYVnE6a', external: true, customIcon: DiscordIcon },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

interface NavItemProps {
  item: typeof navItems[0];
  isOpen: boolean;
  onClick: () => void;
}

function NavItem({ item, isOpen, onClick }: NavItemProps) {
  const hasDropdown = 'items' in item && item.items;

  return (
    <div className="relative">
      {hasDropdown ? (
        <button
          onClick={onClick}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
            isOpen ? 'text-[#E53935]' : 'text-gray-400 hover:text-white'
          }`}
        >
          {item.label}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <Link
          href={(item as any).href || '#'}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          {item.label}
        </Link>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {hasDropdown && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 min-w-[200px] py-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
          >
            {(item as any).items.map((subItem: any, i: number) => {
              if (subItem.type === 'divider') {
                return <div key={i} className="my-2 border-t border-gray-100" />;
              }
              
              if (subItem.submenu) {
                return (
                  <div key={i} className="px-4 py-2">
                    <span className="text-sm font-medium text-gray-900">{subItem.label}</span>
                    <div className="mt-1 space-y-1">
                      {subItem.submenu.map((sub: any) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block pl-4 py-1 text-sm text-gray-600 hover:text-[#E53935] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              const IconComponent = subItem.icon || subItem.customIcon;

              return (
                <Link
                  key={i}
                  href={subItem.href}
                  target={subItem.external ? '_blank' : undefined}
                  rel={subItem.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-[#E53935] hover:bg-gray-50 transition-colors"
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {subItem.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24 relative"> {/* h-16 -> h-24, relative 추가 */}
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-10"> {/* gap-1 -> gap-2로 조금 여유 줌 */}
            <div className="w-9 h-9 relative flex items-center justify-center overflow-hidden">
              <img 
                src="/images/logo.png" 
                alt="Worldland Logo" 
                className="w-full h-full object-contain scale-[1]"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Worldland
            </span>
          </Link>

          {/* Desktop Navigation - Absolute Center */}
          <nav className="hidden lg:flex items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isOpen={openMenu === item.label}
                onClick={() => handleMenuClick(item.label)}
              />
            ))}
          </nav>

          {/* Connect Button */}
          <div className="hidden lg:block">
            <button className="px-5 py-2 border border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white rounded-lg text-sm font-medium transition-all">
              Connect
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 border-t border-white/5"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.label} className="py-2">
                  {'items' in item ? (
                    <div>
                      <button
                        onClick={() => handleMenuClick(item.label)}
                        className="flex items-center justify-between w-full text-white font-medium"
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {openMenu === item.label && (
                        <div className="mt-2 pl-4 space-y-2">
                          {(item as any).items.filter((i: any) => i.type !== 'divider').map((subItem: any, i: number) => (
                            <Link
                              key={i}
                              href={subItem.href || '#'}
                              className="block py-1 text-gray-400 hover:text-white text-sm"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={(item as any).href} className="block text-white font-medium">
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <button className="w-full mt-4 px-5 py-3 bg-[#E53935] text-white rounded-lg font-medium">
                Connect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
