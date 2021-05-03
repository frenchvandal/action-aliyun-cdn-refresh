import { getInput, info } from '@actions/core';
import { exec, ExecOptions } from '@actions/exec';

interface RefreshQuota {
  BlockQuota: string;
  BlockRemain: string;
  DirQuota: string;
  DirRemain: string;
  PreloadEdgeQuota: string;
  PreloadEdgeRemain: string;
  PreloadQuota: string;
  PreloadRemain: string;
  RegexQuota: string;
  RegexRemain: string;
  RequestId: string;
  UrlQuota: string;
  UrlRemain: string;
}

const accessKeyId: string = getInput('accessKeyId', { required: true });
const accessKeySecret: string = getInput('accessKeySecret', { required: true });

(async (): Promise<void> => {
  try {
    /*     let output = '';

    const options: ExecOptions = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    }; */
    exec('aliyun', [
      'configure',
      'set',
      '--profile',
      'akProfile',
      '--region',
      'eu-west-1',
      '--access-key-id',
      accessKeyId,
      '--access-key-secret',
      accessKeySecret,
    ]);

    exec('aliyun', ['cdn', 'DescribeRefreshQuota']);

    //info(`${output}`);

    //const quota: RefreshQuota = JSON.parse(output);

    //info(`${quota.UrlRemain}`);
  } catch (error) {
    const { setFailed } = await import('@actions/core');
    setFailed(error.message);
  }
})();
