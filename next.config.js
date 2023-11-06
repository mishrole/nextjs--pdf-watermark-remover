/** @type {import('next').NextConfig} */
const nextConfig = {
  // server: {
  //   fs: {
  //     allow: ["public"]
  //   }
  // }
  webpack: (config) => {
    // https://www.npmjs.com/package/react-pdf#nextjs
    config.resolve.alias.canvas = false;
    // Reference: https://github.com/wojtekmaj/react-pdf/issues/136#issuecomment-812095633
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker"
          }
        }
      ]
    });

    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas"
    });

    return config;
  },
  // Configura la carpeta "public" para servir archivos estáticos
  async rewrites() {
    return [
      {
        source: "/static/worker/:path*",
        destination: "/_next/static/worker/:path*"
      }
    ];
  }
};

module.exports = nextConfig;
