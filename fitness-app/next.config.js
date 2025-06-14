const isDev = process.env.NODE_ENV === 'development';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: !isDev,        // ⛔ disable in dev
  skipWaiting: true,
  disable: isDev,          // ✅ this is the key line
});

const nextConfig = {
  // any other Next.js config here
};

module.exports = withPWA(nextConfig);
