import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const title    = searchParams.get('title')    ?? 'Stories from the Road'
  const city     = searchParams.get('city')     ?? 'India'
  const state    = searchParams.get('state')    ?? ''
  const country  = searchParams.get('country')  ?? 'India'
  const image    = searchParams.get('image')    ?? ''
  const coords   = searchParams.get('coords')   ?? ''

  const subtitle = [state, country].filter(Boolean).join(' · ').toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#06060a',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* cover image — left half, dimmed */}
        {image && (
          <img
            src={image}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '55%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.55,
            }}
          />
        )}

        {/* dark overlay over image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(6,6,10,0.3) 0%, rgba(6,6,10,0.75) 45%, rgba(6,6,10,0.98) 62%, #06060a 100%)',
            display: 'flex',
          }}
        />

        {/* diagonal stamp border — top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '10px',
            background:
              'repeating-linear-gradient(90deg, #c8a96e 0, #c8a96e 8px, transparent 8px, transparent 18px)',
            opacity: 0.55,
            display: 'flex',
          }}
        />
        {/* diagonal stamp border — bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '10px',
            background:
              'repeating-linear-gradient(90deg, #c8a96e 0, #c8a96e 8px, transparent 8px, transparent 18px)',
            opacity: 0.55,
            display: 'flex',
          }}
        />

        {/* dotted vertical divider */}
        <div
          style={{
            position: 'absolute',
            left: '58%',
            top: '32px',
            bottom: '32px',
            width: '1px',
            background:
              'repeating-linear-gradient(to bottom, rgba(200,169,110,0.45) 0, rgba(200,169,110,0.45) 6px, transparent 6px, transparent 13px)',
            display: 'flex',
          }}
        />

        {/* right content panel */}
        <div
          style={{
            position: 'absolute',
            left: '60%',
            top: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px 64px 48px 52px',
          }}
        >
          {/* brand label */}
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(200,169,110,0.5)',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            TheRoamingPostcards
          </div>

          {/* main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* city */}
            <div
              style={{
                fontSize: '68px',
                fontWeight: 500,
                color: '#f0e8d8',
                lineHeight: 1.0,
                letterSpacing: '-0.01em',
                display: 'flex',
              }}
            >
              {city}
            </div>

            {/* state · country */}
            {subtitle && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '1px',
                    background: '#c8a96e',
                    opacity: 0.5,
                    display: 'flex',
                  }}
                />
                <div
                  style={{
                    fontSize: '13px',
                    color: '#7a5a30',
                    letterSpacing: '0.2em',
                    fontFamily: 'monospace',
                    display: 'flex',
                  }}
                >
                  {subtitle}
                </div>
              </div>
            )}

            {/* story title */}
            <div
              style={{
                fontSize: '20px',
                fontStyle: 'italic',
                color: '#9a7850',
                lineHeight: 1.5,
                marginTop: '4px',
                display: 'flex',
                maxWidth: '340px',
              }}
            >
              {title}
            </div>
          </div>

          {/* bottom: tagline + coords */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                height: '1px',
                background:
                  'linear-gradient(to right, rgba(200,169,110,0.5), transparent)',
                display: 'flex',
                marginBottom: '10px',
              }}
            />
            <div
              style={{
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'rgba(200,169,110,0.4)',
                display: 'flex',
              }}
            >
              Stories from the road, by Gargi
            </div>
            {coords && (
              <div
                style={{
                  fontSize: '10px',
                  color: 'rgba(200,169,110,0.22)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  display: 'flex',
                }}
              >
                {coords}
              </div>
            )}
          </div>
        </div>

        {/* postmark circle — over image, bottom-left area */}
        <div
          style={{
            position: 'absolute',
            left: '32%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: '1.5px solid rgba(200,169,110,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              color: 'rgba(200,169,110,0.25)',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {city.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}