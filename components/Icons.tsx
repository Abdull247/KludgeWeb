type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function Svg({ size = 16, className, strokeWidth = 2, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={`icon ${className ?? ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function ArrowDown({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </Svg>
  );
}

export function ArrowRight({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Svg>
  );
}

export function ArrowUpRight({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </Svg>
  );
}

export function ArrowLeft({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Svg>
  );
}

export function ChevronDown({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function Github({ size, className }: IconProps) {
  return (
    <svg
      className={`icon ${className ?? ""}`}
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function Star({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function Check({ size, className, strokeWidth }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function Hourglass({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </Svg>
  );
}

export function X({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} className="icon" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
