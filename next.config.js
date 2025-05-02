const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disables ESLint errors during Vercel build
  },
};

export default nextConfig;
