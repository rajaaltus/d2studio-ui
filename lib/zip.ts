// A minimal store-only (uncompressed) zip writer, so a multi-file block can be
// saved as one archive without pulling in a zip library. Source files are a
// few KB each, so skipping compression costs nothing that matters.
//
// Layout per the PKWARE APPNOTE: a local header + data for each entry, then a
// central directory listing them, then the end-of-central-directory record.

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

export function zipFiles(files: { path: string; content: string }[]): Blob {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = enc.encode(file.path);
    const data = enc.encode(file.content);
    const crc = crc32(data);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true); // local file header signature
    local.setUint16(4, 20, true); // version needed
    local.setUint16(6, 0x0800, true); // flags: names are UTF-8
    local.setUint16(8, 0, true); // method: stored
    local.setUint16(10, 0, true); // mod time
    local.setUint16(12, 0x21, true); // mod date: 1980-01-01
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true); // compressed size
    local.setUint32(22, data.length, true); // uncompressed size
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true); // extra length
    chunks.push(new Uint8Array(local.buffer), name, data);

    const dir = new DataView(new ArrayBuffer(46));
    dir.setUint32(0, 0x02014b50, true); // central directory signature
    dir.setUint16(4, 20, true); // version made by
    dir.setUint16(6, 20, true); // version needed
    dir.setUint16(8, 0x0800, true);
    dir.setUint16(10, 0, true);
    dir.setUint16(12, 0, true);
    dir.setUint16(14, 0x21, true);
    dir.setUint32(16, crc, true);
    dir.setUint32(20, data.length, true);
    dir.setUint32(24, data.length, true);
    dir.setUint16(28, name.length, true);
    // extra, comment, disk number, internal and external attributes stay 0
    dir.setUint32(42, offset, true); // where this entry's local header starts
    central.push(new Uint8Array(dir.buffer), name);

    offset += 30 + name.length + data.length;
  }

  const dirSize = central.reduce((n, c) => n + c.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); // end of central directory signature
  end.setUint16(8, files.length, true); // entries on this disk
  end.setUint16(10, files.length, true); // entries in total
  end.setUint32(12, dirSize, true);
  end.setUint32(16, offset, true); // central directory offset

  return new Blob([...chunks, ...central, new Uint8Array(end.buffer)] as BlobPart[], {
    type: "application/zip",
  });
}
