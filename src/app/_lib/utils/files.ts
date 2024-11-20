export async function parseFile(indexFile: FileSystemFileHandle) {
  const indexContent = await indexFile.getFile();
  return await indexContent.text();
}

export async function listFiles(directoryHandle: FileSystemDirectoryHandle) {
  const values = directoryHandle.values();

  const list: FileSystemFileHandle[] = [];

  for await (const value of values) {
    if (value.kind === "file") {
      list.push(value);
    }
  }

  return list;
}
