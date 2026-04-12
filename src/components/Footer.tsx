import Link from "next/link";

export default function Footer() {

    return (
        <>
            <footer className="border-t border-theme py-14 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
                        <div>
                            <p className="font-serif text-xl font-light mb-2" style={{ color: 'var(--text-primary)' }}>
                                Travel <span style={{ color: 'var(--sand)' }}>Stories</span>
                            </p>
                            <p className="text-xs leading-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
                                Emotional travel storytelling.<br />Real places. Real questions. Real feelings.
                            </p>
                        </div>
                        <div className="flex gap-14">
                            <div>
                                <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>Navigate</p>
                                <nav className="flex flex-col gap-3">
                                    {[{ label: 'Home', href: '/' }, { label: 'Stories', href: '/stories' }, { label: 'Map', href: '/map' }, { label: 'About', href: '/about' }].map((l) => (
                                        <Link key={l.href} href={l.href} className="text-sm transition-opacity hover:opacity-80"
                                            style={{ color: 'var(--text-secondary)' }}>{l.label}</Link>
                                    ))}
                                </nav>
                            </div>
                            <div>
                                <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>Connect</p>
                                <div className="gap-3 flex flex-col justify-center items-center">
                                    <a
                                        href="https://instagram.com/theroamingpostcards"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 transition-all hover:scale-110 hover:text-pink-500"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <circle cx="12" cy="12" r="4" />
                                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://youtube.com/@YOUR_HANDLE"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 transition-all hover:scale-110 hover:text-red-500"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                                            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                                        </svg>
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-theme flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            © {new Date().getFullYear()} Travel Stories. All rights reserved.
                        </p>
                        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-primary)', opacity: 0.4 }}>
                            Made with quiet curiosity ❤️
                        </p>
                    </div>
                </div>
            </footer></>
    )
}
