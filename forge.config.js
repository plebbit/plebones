export default {
  packagerConfig: {
    name: 'plebones',
    executableName: 'plebones',
    appBundleId: 'plebones.desktop',

    // Unpack native modules and kubo binary from ASAR so they can be executed
    asar: {
      unpack: '{*.node,*.dll,*.dylib,*.so,**/kubo/kubo/**}'
    },

    // Exclude unnecessary files
    ignore: [
      /^\/src$/,
      /^\/android$/,
      /^\/public$/,
      /^\/config$/,
      /^\/\.plebbit$/,
      /^\/dist$/,
      /^\/bin$/,
      /^\/out$/,
      /^\/squashfs-root$/,
      /^\/original-assets$/,
      /^\/scripts$/,
      /\.map$/,
      /\.md$/,
      /\.git/,
      /\.ts$/,
      /\.test\.js$/,
      /\.spec\.js$/,
      /tsconfig\.json$/,
      /\.eslintrc/,
      /\.prettierrc/,
      /CHANGELOG/
    ]
  },

  rebuildConfig: {
    force: true
  },

  hooks: {
    postPackage: async (config, options) => {
      const { execSync } = await import('child_process');
      const globPkg = await import('glob');
      const globSync = globPkg.sync || globPkg.default?.sync;

      for (const result of options.outputPaths) {
        // Strip .node files (native modules)
        const nodeFiles = globSync('**/*.node', { cwd: result, absolute: true });
        for (const file of nodeFiles) {
          try {
            execSync(`strip --strip-debug "${file}"`, { stdio: 'pipe' });
          } catch (e) { /* ignore failures */ }
        }

        // Strip kubo binary (executable files without extensions)
        const kuboFiles = globSync('**/kubo/kubo/**/!(*.*)' , { cwd: result, absolute: true });
        for (const file of kuboFiles) {
          try {
            execSync(`strip --strip-debug "${file}"`, { stdio: 'pipe' });
          } catch (e) { /* ignore failures */ }
        }
      }
    }
  },

  makers: [
    // Windows
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: { name: 'plebones' }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32']
    },

    // macOS
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: { format: 'ULFO' }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },

    // Linux
    {
      name: '@reforged/maker-appimage',
      platforms: ['linux'],
      config: {
        options: {
          categories: ['Network'],
          genericName: 'Plebbit Client'
        }
      }
    }
  ]
};
