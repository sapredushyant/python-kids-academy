/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for Pyodide WASM loading
    config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };
    return config;
  },
};

export default nextConfig;
