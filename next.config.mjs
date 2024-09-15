// import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['firebasestorage.googleapis.com'],
//   },
//   env: {
//     MONGODB_URI: process.env.MONGODB_URI,
//     NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
//     REDIS_URL: process.env.REDIS_URL,
//   },
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         timers: false,
//         'timers/promises': false,
//         net: false,
//         tls: false,
//         dns: false,
//         child_process: false,
//         fs: false,
//       };
//     }

//     // Add rule for CSS files
//     // config.module.rules.push({
//     //   test: /\.css$/,
//     //   use: [
//     //     'style-loader',
//     //     {
//     //       loader: 'css-loader',
//     //       options: {
//     //         importLoaders: 1,
//     //       },
//     //     },
//     //     'postcss-loader',
//     //   ],
//     // });

//     return config;
//   },
// };

// export default withTM(['ioredis', 'mongodb'])(nextConfig);
const nextConfig = {
  images: {
        domains: ['firebasestorage.googleapis.com'],
  },
};

export default nextConfig;