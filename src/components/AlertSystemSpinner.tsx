import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AlertSystemSpinnerProps {
    className?: string;
    autoHide?: boolean;
    autoHideDelay?: number;
    onHide?: () => void;
}

export const AlertSystemSpinner = ({
    className,
    autoHide = false,
    autoHideDelay = 3000,
    onHide
}: AlertSystemSpinnerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoHide) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onHide?.();
            }, autoHideDelay);

            return () => clearTimeout(timer);
        }
    }, [autoHide, autoHideDelay, onHide]);

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-background",
            className
        )}>
            <div className="flex gap-2 items-center justify-center">
                {/* A */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M10 56 L24 8 L38 56 M16 40 L32 40"
                        stroke="url(#alertsystem-a)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-a" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#FFD700" />
                            <stop offset="1" stopColor="#FF00CC" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* L */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M10 8 V56 H38"
                        stroke="url(#alertsystem-l)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-l" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#00DA72" />
                            <stop offset="1" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* E */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M38 8 H10 V56 H38 M10 32 H32"
                        stroke="url(#alertsystem-e)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-e" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#00bfff" />
                            <stop offset="1" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* R */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M10 56 V8 H32 Q38 8 38 24 Q38 40 32 40 H10 M32 40 L38 56"
                        stroke="url(#alertsystem-r)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-r" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#FF7F50" />
                            <stop offset="1" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* T */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M10 8 H38 M24 8 V56"
                        stroke="url(#alertsystem-t)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-t" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#00bfff" />
                            <stop offset="1" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* spacer between words */}
                <svg width="14" height="64" viewBox="0 0 14 64"></svg>

                {/* S */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M38 16 Q38 8 24 8 Q10 8 10 20 Q10 32 24 32 Q38 32 38 44 Q38 56 24 56 Q10 56 10 48"
                        stroke="url(#alertsystem-s)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-s" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#00E0ED" />
                            <stop offset="1" stopColor="#007CFF" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Y */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M10 8 L24 32 L38 8 M24 32 V56"
                        stroke="url(#alertsystem-y)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-y" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#973BED" />
                            <stop offset="1" stopColor="#00E0ED" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* S */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M38 16 Q38 8 24 8 Q10 8 10 20 Q10 32 24 32 Q38 32 38 44 Q38 56 24 56 Q10 56 10 48"
                        stroke="url(#alertsystem-s2)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-s2" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#FF00CC" />
                            <stop offset="1" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* T */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M10 8 H38 M24 8 V56"
                        stroke="url(#alertsystem-t2)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-t2" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#00bfff" />
                            <stop offset="1" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* E */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M38 8 H10 V56 H38 M10 32 H32"
                        stroke="url(#alertsystem-e2)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-e2" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#00bfff" />
                            <stop offset="1" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* M */}
                <svg width="48" height="64" viewBox="0 0 48 64" className="inline-block">
                    <path
                        d="M10 56 V8 L24 32 L38 8 V56"
                        stroke="url(#alertsystem-m)"
                        strokeWidth="6"
                        fill="none"
                        className="animate-dash stroke-linecap-round stroke-linejoin-round"
                    />
                    <defs>
                        <linearGradient id="alertsystem-m" x1="0" y1="0" x2="48" y2="64">
                            <stop stopColor="#973BED" />
                            <stop offset="1" stopColor="#00E0ED" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};
