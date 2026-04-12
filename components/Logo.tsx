interface Props {
  className?: string
  showText?: boolean
}

export default function Logo({ className = 'w-7 h-7', showText = false }: Props) {
  return (
    <span className="flex items-center gap-2">
      <svg
        viewBox="0 0 36 36"
        className={className}
        fill="none"
        aria-label="DataGraph logo"
      >
        <defs>
          <linearGradient id="lg-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
          <linearGradient id="lg-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>

        {/* Three ascending bars */}
        <rect x="2"  y="22" width="8" height="12" rx="2" fill="url(#lg-bar)" opacity="0.55" />
        <rect x="14" y="14" width="8" height="20" rx="2" fill="url(#lg-bar)" opacity="0.78" />
        <rect x="26" y="6"  width="8" height="28" rx="2" fill="url(#lg-bar)" />

        {/* Trend line connecting bar tops */}
        <polyline
          points="6,21 18,13 30,5"
          stroke="url(#lg-line)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data-point dots */}
        <circle cx="6"  cy="21" r="2.2" fill="#DDD6FE" />
        <circle cx="18" cy="13" r="2.2" fill="#DDD6FE" />
        <circle cx="30" cy="5"  r="2.2" fill="#EDE9FE" />
      </svg>

      {showText && (
        <span className="font-heading font-semibold text-lg tracking-tight text-foreground">
          DataGraph
        </span>
      )}
    </span>
  )
}
