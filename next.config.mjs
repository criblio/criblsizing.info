/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/stream",
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
