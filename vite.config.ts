import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import obfuscator from 'rollup-plugin-obfuscator'

export default defineConfig(({ command }) => ({
=======

export default defineConfig({
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
<<<<<<< HEAD
    // Ofuscação apenas no build de produção
    ...(command === 'build' ? [obfuscator({
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        stringEncryption: true,
        stringEncryptionThreshold: 0.75,
        renameGlobals: false,
        selfDefending: true,
        disableConsoleOutput: true,
      },
    })] : []),
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

<<<<<<< HEAD
  build: {
    sourcemap: false, // Sem source maps — impede ver o código original no DevTools
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
}))
=======
  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
