import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // テスト環境としてjsdomを指定
    setupFiles: "./vitest.setup.ts", // セットアップファイルへのパス
  },
});
