import dns from 'node:dns';

// Forzar prioridad IPv4 en resolución DNS para evitar cuellos de botella de IPv6 en Windows / proveedores chilenos
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignorar si no está soportado en la versión de Node
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
