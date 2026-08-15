import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que Next infiera mal la raíz cuando hay varios lockfiles en el árbol.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
