// src/components/SongPlayer.tsx
export default function SongPlayer({
  songName,
  embedUrl,
}: {
  songName: string
  embedUrl: string
}) {
  const isSpotify = embedUrl.includes('spotify')
  const isYouTube = embedUrl.includes('youtube') || embedUrl.includes('youtu.be')

  // Convert any Spotify URL to an embed URL
  // e.g. https://open.spotify.com/track/xxx → https://open.spotify.com/embed/track/xxx
  const resolvedUrl = (() => {
    if (isSpotify) {
      // Already an embed URL
      if (embedUrl.includes('/embed/')) return embedUrl
      // Convert open.spotify.com/track/... → open.spotify.com/embed/track/...
      return embedUrl.replace(
        /https:\/\/open\.spotify\.com\/(track|album|playlist|episode)\//,
        'https://open.spotify.com/embed/$1/'
      )
    }
    if (isYouTube) {
      // Convert youtu.be short links
      const shortMatch = embedUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
      if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
      // Convert watch?v= links
      const watchMatch = embedUrl.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
      if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
      // Already an embed URL
      return embedUrl
    }
    return embedUrl
  })()

  return (
    <div className="py-4">
      <p className="text-sand-400 tracking-[0.3em] text-xs uppercase mb-4">
        This city sounds like:
      </p>
      <p className="text-white font-serif text-2xl mb-6 italic">{songName}</p>

      {isSpotify && (
        <div className="rounded-lg overflow-hidden">
          <iframe
            src={resolvedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full"
            title={`Listen to ${songName}`}
          />
        </div>
      )}

      {isYouTube && (
        <div className="rounded-lg overflow-hidden">
          <iframe
            src={resolvedUrl}
            width="100%"
            height="160"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full"
            title={`Listen to ${songName}`}
          />
        </div>
      )}
    </div>
  )
}