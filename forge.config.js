import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

// @electron/rebuild's dep walker doesn't reach transitive native modules.
// Scan node_modules for all packages with binding.gyp so they get rebuilt for Electron's ABI.
function findNativeModules(dir = 'node_modules', prefix = '') {
    const result = [];
    for (const entry of readdirSync(dir)) {
        if (entry.startsWith('.')) continue;
        const fullPath = join(dir, entry);
        if (entry.startsWith('@')) {
            result.push(...findNativeModules(fullPath, entry + '/'));
        } else if (existsSync(join(fullPath, 'binding.gyp'))) {
            result.push(prefix + entry);
        }
    }
    return result;
}

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
    force: true,
    extraModules: findNativeModules()
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
    },

    postMake: async (config, makeResults) => {
      // Only create HTML archive on Linux (to avoid duplicates across platforms)
      if (process.platform !== 'linux') {
        return makeResults;
      }

      const fs = await import('fs');
      const fsPromises = await import('fs/promises');
      const path = await import('path');
      const { spawnSync } = await import('child_process');
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

      const buildFolder = path.resolve('.', 'build');
      const folderName = `plebones-html-${packageJson.version}`;
      const tempFolder = path.resolve('.', 'out', 'make', folderName);
      const outputFile = path.resolve('.', 'out', 'make', `${folderName}.zip`);

      // Copy build folder to temp folder with correct name
      await fsPromises.cp(buildFolder, tempFolder, { recursive: true });

      // Create zip from parent directory so folder name is included
      const result = spawnSync('zip', ['-r', `${folderName}.zip`, folderName], {
        cwd: path.resolve('.', 'out', 'make'),
        stdio: 'inherit'
      });

      // Clean up temp folder
      await fsPromises.rm(tempFolder, { recursive: true });

      if (result.status !== 0) {
        throw new Error(`Failed to create HTML archive: zip exited with code ${result.status}`);
      }
      console.log(`Created HTML archive: ${outputFile}`);

      return makeResults;
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
