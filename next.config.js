/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ebooksdl.cti.gr' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};
export default nextConfig;
