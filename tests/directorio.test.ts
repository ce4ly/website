import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { urlQrz } from '../src/lib/directorio.ts'

describe('directorio', () => {
  it('enlaza a QRZ con el indicativo que QRZ tiene registrado', () => {
    assert.equal(urlQrz('CA4DJF'), 'https://www.qrz.com/db/CA4DJF')
    // Licencia mal emitida: SUBTEL dice CA5NFS, QRZ lo tiene como CA4NFS.
    assert.equal(urlQrz('CA5NFS'), 'https://www.qrz.com/db/CA4NFS')
  })
})
