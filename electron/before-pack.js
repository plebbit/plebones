// copy the ipfs binary from kubo package before building the electron clients

import {path as kuboPath} from 'kubo'
import fs from 'fs-extra'
import path from 'path'
import {fileURLToPath} from 'url'
import {execSync} from 'child_process'

const ipfsClientsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin')

const getDestinationPath = () => {
  if (process.platform === 'win32') return path.join(ipfsClientsPath, 'win')
  if (process.platform === 'darwin') return path.join(ipfsClientsPath, 'mac')
  return path.join(ipfsClientsPath, 'linux')
}

export const downloadIpfsClients = async () => {
  const kuboBinaryPath = kuboPath()
  const destPath = getDestinationPath()
  const binName = process.platform === 'win32' ? 'ipfs.exe' : 'ipfs'
  const destBinPath = path.join(destPath, binName)

  fs.ensureDirSync(destPath)
  fs.copyFileSync(kuboBinaryPath, destBinPath)
  if (process.platform !== 'win32') {
    fs.chmodSync(destBinPath, 0o755)
  }

  // strip debug symbols to reduce binary size (115MB -> ~50MB)
  if (process.platform === 'linux') {
    execSync(`strip "${destBinPath}"`)
  }
}

export default async (context) => {
  await downloadIpfsClients()
}
