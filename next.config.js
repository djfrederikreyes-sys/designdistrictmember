/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.squarespace.com https://*.sqspcdn.com https://*.vercel.app https://*;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
