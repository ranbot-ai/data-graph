'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import LangSwitcher from './LangSwitcher'
import { useTranslations } from '@/lib/i18n'

export default function Navbar() {
  const pathname = usePathname()
  const t = useTranslations()

  const links = [
    { href: '/', label: t('nav.upload') },
    { href: '/dashboard', label: t('nav.dashboard') },
  ]

  return (
    <nav className="bg-surface/80 backdrop-blur border-b border-slate-200 dark:border-white/5 text-foreground h-16 px-6 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="w-7 h-7" />
        <span className="font-heading font-semibold text-lg tracking-tight">DataGraph</span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Page links */}
        <div className="flex gap-5 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'text-violet-500 font-semibold'
                  : 'text-muted hover:text-foreground transition-colors'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />

        {/* Language + theme controls */}
        <LangSwitcher />
        <ThemeToggle />
      </div>
    </nav>
  )
}
