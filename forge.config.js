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
      /\.map$/,
      /\.md$/,
      /\.git/
    ]
  },

  rebuildConfig: {
    force: true
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
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          maintainer: 'Esteban Abaroa',
          categories: ['Network']
        }
      }
    }
  ]
};
