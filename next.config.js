/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ebooksdl.cti.gr' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Ship only the psma-shards directory with the ai-chat function's deployment
  // bundle — it reads shard files with fs at request time (see app/api/ai-chat/route.js),
  // which Next's default static-import tracing can't discover on its own.
  outputFileTracingIncludes: {
    'app/api/ai-chat/route': ['./src/data/psma-shards/**/*.json'],
  },
};
export default nextConfig;
