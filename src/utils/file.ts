import { join } from 'path';
import { readdirSync, statSync } from 'fs';

export const getDirectoryList = (p, recursion) => {
  try {
    const data = readdirSync(p);
    return data.map((n) => {
      const newFilePath = join(p, n);
      const fileStat = statSync(newFilePath);
      const isDirectory = fileStat.isDirectory();
      return {
        title: n,
        isLeaf: !isDirectory,
        // 将文件路径转化为 唯一值
        key: newFilePath.split('\\markdown\\')[1],
        children:
          recursion && isDirectory
            ? getDirectoryList(newFilePath, recursion)
            : [],
      };
    });
  } catch (e) {
    console.log('e', e);
    return [];
  }
};
