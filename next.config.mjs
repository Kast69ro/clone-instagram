/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "tj"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    domains: ["37.27.29.18", "instagram-api.softclub.tj"],
  },
};

export default nextConfig;
