import crypto from 'crypto';

export * from './export';

export function jsonToMD5(jsonData: any) {
  if (!jsonData) {
    return null;
  }

  const strData = JSON.stringify(jsonData);
  const md5 = crypto.createHash('md5');
  const val = md5.update(strData).digest('hex');

  return val;
}
