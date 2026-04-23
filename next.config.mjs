import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: currentDirectory,
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
