import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const r2Host = process.env.NEXT_PUBLIC_R2_HOST

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: r2Host ? [
      {
        protocol: 'https',
        hostname: r2Host,
        pathname: '/share/**',
      },
    ]
      : [],
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false, // viewBox 삭제되는 옵션 끄기
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Provide the path to the messages that you're using in `AppConfig`
    createMessagesDeclaration: './messages/en.json'
  }
});
export default withNextIntl(nextConfig);