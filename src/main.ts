import { info } from '@actions/core';
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

(async (): Promise<void> => {
  try {
    let output = '';

    const options: ExecOptions = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    };

    exec('aliyun', ['DescribeRefreshQuota'], options);

    info(`${output}`);

    const quota: RefreshQuota = JSON.parse(output);

    info(`${quota.UrlRemain}`);
  } catch (error) {
    const { setFailed } = await import('@actions/core');
    setFailed(error.message);
  }
})();
