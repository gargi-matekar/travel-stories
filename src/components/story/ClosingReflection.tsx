interface Props {
    reflection: string
    city: string
  }
  
  export default function ClosingReflection({ reflection, city }: Props) {
    return (
      <section
        className="py-24 text-center"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ background: 'var(--accent)' }}
          />
          <blockquote
            className="text-2xl md:text-3xl leading-relaxed italic"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Georgia, serif',
            }}
          >
            "{reflection}"
          </blockquote>
          <p className="mt-6 text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            — {city}
          </p>
          <div
            className="w-8 h-px mx-auto mt-8"
            style={{ background: 'var(--accent)' }}
          />
        </div>
      </section>
    )
  }