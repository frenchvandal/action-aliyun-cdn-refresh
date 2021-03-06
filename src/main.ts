import { debug, endGroup, getInput, info, startGroup } from '@actions/core';
import { create, Globber } from '@actions/glob';
import Client, {
  DescribeRefreshQuotaRequest,
  DescribeRefreshQuotaResponse,
  RefreshObjectCachesRequest,
  RefreshObjectCachesResponse,
} from '@alicloud/cdn20180510';
import { Config } from '@alicloud/openapi-client';
import { toMap } from '@alicloud/tea-typescript';
import Util from '@alicloud/tea-util';
import { EOL } from 'os';
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
  splitSeparator: string,
  joinSeparator?: string,
  dir?: string,
  prefix?: string,
  suffix?: string,
): string {
  let fileToObject: string[] = filePath.split(splitSeparator);

  if (dir) {
    const removalList: string[] = dir.split(splitSeparator);
    fileToObject = fileToObject.filter((item) => !removalList.includes(item));
  }

  if (prefix) {
    fileToObject.unshift(prefix);
  }

  if (suffix) {
    fileToObject.push(suffix);
  }

  if (!joinSeparator) joinSeparator = splitSeparator;

  const objectFile: string = fileToObject.join(joinSeparator);

  return objectFile;
}

(async (): Promise<void> => {
  try {
    // let index = 0;
    // let percent = 0;

    const uploadDir: Globber = await create(`${homeDir}`);
    const size: number = (await uploadDir.glob()).length;
    // const localFiles: AsyncGenerator<
    //   string,
    //   void,
    //   unknown
    // > = uploadDir.globGenerator();

    const files: string[] = (await uploadDir.glob()).map((file) =>
      objectify(file, processSeparator),
    );

    const URL: string = files.join(EOL);

    startGroup(`${size} objects to refresh`);

    const RefreshQuotaRequest: DescribeRefreshQuotaRequest = new DescribeRefreshQuotaRequest(
      {},
    );

    const RefreshQuotaResponse: DescribeRefreshQuotaResponse = await client.describeRefreshQuota(
      RefreshQuotaRequest,
    );

    const remainQuota: number =
      Number(RefreshQuotaResponse.body.urlRemain) || 0;

    /*     for await (const file of localFiles) {
      const RefreshQuotaRequest: DescribeRefreshQuotaRequest = new DescribeRefreshQuotaRequest(
        {},
      );

      const RefreshQuotaResponse: DescribeRefreshQuotaResponse = await client.describeRefreshQuota(
        RefreshQuotaRequest,
      );

      const remainQuota: number =
        Number(RefreshQuotaResponse.body.urlRemain) || 0;

      debug(`file: ${file}`);
      debug(`homeDir: ${homeDir}`);
      debug(`cdnDomain: ${cdnDomain}`);

      let objectName: string = objectify(file, homeDir, cdnDomain);

      if (!extname(file)) objectName = `${objectName}${posixSeparator}`;

      debug(`URL: ${objectName}`);
      if (remainQuota) {
        const refreshRequest: RefreshObjectCachesRequest = new RefreshObjectCachesRequest(
          {
            objectPath: objectName,
          },
        );

        const refreshResponse: RefreshObjectCachesResponse = await client.refreshObjectCaches(
          refreshRequest,
        );

        debug(`URL: ${refreshResponse.body.refreshTaskId}`);

        const refreshTaskIdRequest: DescribeRefreshTaskByIdRequest = new DescribeRefreshTaskByIdRequest(
          {
            taskId: refreshResponse.body.refreshTaskId,
          },
        );

        const refreshTaskIdResponse: DescribeRefreshTaskByIdResponse = await client.describeRefreshTaskById(
          refreshTaskIdRequest,
        );
        info(Util.toJSONString(toMap(refreshTaskIdResponse)));

        info(
          `\u001b[38;2;0;128;0m[${index}/${size}, ${percent.toFixed(
            2,
          )}%] refreshed URL: ${objectName}`,
        );
      } else {
        info('Daily RefreshUrlQuota exceeded');
        break;
      }

      index += 1;
      percent = (index / size) * 100;
    } */

    endGroup();

    //info(`${index} URL refreshed`);
  } catch (error) {
    const { setFailed } = await import('@actions/core');
    setFailed(error.message);
  }
})();
