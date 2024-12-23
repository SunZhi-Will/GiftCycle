'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: '傳送禮物' },
        { href: '/draw', label: '抽取禮物' },
        { href: '/gifts', label: '我的禮物' },
        { href: '/tree', label: '願望樹' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold text-white hover:text-white/80 transition-colors"
                    >
                        聖誕交換樂
                    </Link>

                    {/* 導航連結 */}
                    <div className="flex items-center gap-2">
                        {navItems.map(({ href, label }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="relative px-4 py-2 text-sm"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-white/10 rounded-lg"
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                    <span className={`relative z-10 ${isActive
                                        ? 'text-white'
                                        : 'text-white/70 hover:text-white'
                                        }`}>
                                        {label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
} 