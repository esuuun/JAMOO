import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nzaqbwphcltcplbdwxbk.supabase.co',
      },
    ],
  },
};

export default nextConfig;
