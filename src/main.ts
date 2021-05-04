import { debug, endGroup, getInput, info, startGroup } from '@actions/core';
import { create, Globber } from '@actions/glob';
import Client, {
  DescribeRefreshQuotaRequest,
  DescribeRefreshQuotaResponse,
  RefreshObjectCachesRequest,
  RefreshObjectCachesResponse,
} from '@alicloud/cdn20180510';
import { Config } from '@alicloud/openapi-client';
import { extname, join, posix, sep } from 'path';

const processSeparator: string = sep;
const posixSeparator: string = posix.sep;

const homeDir: string = join(
  process.cwd(),
  getInput('source', { required: false }) || 'public',
  processSeparator,
);

const cdnDomain: string = getInput('cdnDomain', { required: true });

const credentials: Config = new Config({
  accessKeyId: getInput('accessKeyId', { required: true }),
  accessKeySecret: getInput('accessKeySecret', { required: true }),
});

const client: Client = new Client(credentials);

function objectify(
  filePath: string,
  dir?: string,
  prefix?: string,
  suffix?: string,
): string {
  let fileToObject: string[] = filePath.split(processSeparator);

  if (dir) {
    const removalList: string[] = dir.split(processSeparator);
    fileToObject = fileToObject.filter((item) => !removalList.includes(item));
  }

  if (prefix) {
    fileToObject.unshift(prefix);
  }

  if (suffix) {
    fileToObject.push(suffix);
  }

  const objectFile: string = fileToObject.join(posixSeparator);

  return objectFile;
}

function myFunc(arg: string) {
  info(arg);
}

(async (): Promise<void> => {
  try {
    let index = 0;
    let percent = 0;

    const uploadDir: Globber = await create(`${homeDir}`);
    const size: number = (await uploadDir.glob()).length;
    const localFiles: AsyncGenerator<
      string,
      void,
      unknown
    > = uploadDir.globGenerator();

    startGroup(`${size} objects to refresh`);

    for await (const file of localFiles) {
      const RefreshQuotaRequest: DescribeRefreshQuotaRequest = new DescribeRefreshQuotaRequest(
        {},
      );

      const RefreshQuotaResponse: DescribeRefreshQuotaResponse = await client.describeRefreshQuota(
        RefreshQuotaRequest,
      );

      const remainQuota: number =
        Number(RefreshQuotaResponse.body.urlRemain) || 0;

      let trailingSlash: string | undefined;

      const extension: string = extname(file);
      info(`ext: ${extension}`);
      if (!extension) {
        trailingSlash = processSeparator;
      } else {
        trailingSlash = undefined;
      }
      debug(`trailingSlash: ${trailingSlash}`);
      debug(`file: ${file}`);
      debug(`homeDir: ${homeDir}`);
      debug(`cdnDomain: ${cdnDomain}`);

      const objectName: string = objectify(
        file,
        homeDir,
        cdnDomain,
        trailingSlash,
      );
      debug(`URL: ${objectName}`);
      if (remainQuota) {
        const refreshRequest = new RefreshObjectCachesRequest({
          objectPath: objectName,
        });
        const refreshResponse: RefreshObjectCachesResponse = await client.refreshObjectCaches(
          refreshRequest,
        );
        info(
          `\u001b[38;2;0;128;0m[${index}/${size}, ${percent.toFixed(
            2,
          )}%] refreshed: ${objectName} ${refreshResponse.body.refreshTaskId}`,
        );
        setTimeout(myFunc, 1500, 'just wait');
      } else {
        info('Daily RefreshUrlQuota exceeded');
        break;
      }

      index += 1;
      percent = (index / size) * 100;
    }

    endGroup();

    info(`${index} URL refreshed`);
  } catch (error) {
    const { setFailed } = await import('@actions/core');
    setFailed(error.message);
  }
})();
