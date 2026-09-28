export const GET = () =>
  new Response(
    JSON.stringify({
      name: 'Dembinszky utca 18. – egy ház története',
      short_name: 'D18',
      lang: 'hu',
      start_url: '/',
      display: 'browser',
      background_color: '#f5f1e8',
      theme_color: '#f5f1e8',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
