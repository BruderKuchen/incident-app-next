// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    // Nur im Client-Bundle (isServer===false) Fall-Backs definieren
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        net: false,
        tls: false,
        child_process: false,
        path: false,
      };
    }
    return config;
  },
};
