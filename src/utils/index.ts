import { yellowBright } from 'chalk';
import { mkdir, stat } from 'fs';
import { parse } from 'path';

export function l(v) {
  console.log(yellowBright(v));
}

function getStatByPath(filePath): Promise<any> {
  console.log(filePath);
  return new Promise((resolve) => {
    stat(filePath, (err, stats) => {
      err ? resolve(false) : resolve(stats);
    });
  });
}

export async function dirExists(dir) {
  const isExists = await getStatByPath(dir);
  // 如果路径存在且不是文件，返回 true
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {
    return false;
  }

  // 如果路径不存在
  const tempDir = parse(dir).dir; // 拿到上一级的路径

  // 递归判断，如果上级路径也不存在，则继续循环执行，知道存在
  const status = await dirExists(tempDir);
  console.log('status', status);
  let mkdirStatus;

  if (status) {
    mkdirStatus = await isMkdir(dir);
  }
  return mkdirStatus;
}

function isMkdir(dir) {
  return new Promise((resolve) => {
    mkdir(dir, (err) => {
      err ? resolve(false) : resolve(true);
    });
  });
}
