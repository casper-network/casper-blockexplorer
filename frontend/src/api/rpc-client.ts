import {
  CLValueParsers,
  CasperServiceByJsonRPC,
  CLPublicKey,
} from 'casper-js-sdk';
import { Block, Deploy, DeployStatus, Peer, NetworkStatus } from './types';
import { formatDate, formatTimeAgo, loadConfig } from '../utils';
import { ApiError } from './api-error';
import {
  JsonBlockWithBody,
  JsonDeployPayment,
  GetStatusResultExtended,
  JsonDeploySession,
} from './missing-sdk-types';
import { determineDeploySessionData } from './utils';

export const DEFAULT_NUM_TO_SHOW = 10;

const { webServerUrl } = loadConfig();

export enum RpcApiError {
  BlockMissing = 'getBlock/missing',
  AccountMissing = 'getAccount/missing',
  BlockByHeightMissing = 'getBlockByHeight/missing',
  BlockFetchFailed = 'getBlock/fetch-failed',
  AccountFetchFailed = 'getAccount/fetch-failed',
  DeployFetchFailed = 'getDeploy/fetch-failed',
  PeersFetchFailed = 'getPeers/fetch-failed',
  BalanceFetchFailed = 'getBalance/fetch-failed',
  CurrentBlockHeightFailed = 'getCurrentBlockHeight/fetch-failed',
  BlockByHeightFailed = 'getBlockByHeight/fetch-failed',
  GetBlocksFailed = 'getBlocks/fetch-failed',
  GetStatusFailed = 'getStatus/fetch-failed',
}

export class RpcApi {
  constructor(
    private readonly rpcClient: CasperServiceByJsonRPC,
    private readonly defaultPagination: number = DEFAULT_NUM_TO_SHOW,
  ) {}

  getBlock: (blockHash: string) => Promise<Block | undefined> =
    async blockHash => {
      try {
        const blockResult = await this.rpcClient.getBlockInfo(blockHash);

        const { block: rawBlockData } = blockResult;

        if (!rawBlockData) {
          throw new ApiError({
            type: RpcApiError.BlockMissing,
            message: 'Failed to find block data',
            data: { blockHash },
          });
        }

        const { hash, header } = rawBlockData;

        const {
          timestamp,
          height,
          era_id: eraID,
          state_root_hash: stateRootHash,
          parent_hash: parentHash,
        } = header;

        const {
          proposer: validatorPublicKey,
          deploy_hashes: deployHashes,
          transfer_hashes: transferHashes,
        } = (rawBlockData as JsonBlockWithBody).body;

        const deployHashCount = deployHashes?.length || 0;
        const transferHashCount = transferHashes?.length || 0;
        const deployCount = deployHashCount + transferHashCount;

        const dateTime = new Date(timestamp);

        const timeSince = formatTimeAgo(dateTime);
        const readableTimestamp = formatDate(dateTime);

        const tailoredBlock = {
          timestamp,
          timeSince,
          readableTimestamp,
          height,
          eraID,
          hash,
          validatorPublicKey,
          deployCount,
          transferHashes,
          deployHashes,
          stateRootHash,
          parentHash,
          rawBlock: JSON.stringify(rawBlockData),
        };

        return tailoredBlock;
      } catch (err) {
        if ((err as ApiError).type === RpcApiError.BlockMissing) {
          throw err;
        }

        throw new ApiError({
          type: RpcApiError.BlockFetchFailed,
          message: 'An error occurred while fetching block',
          data: {
            err,
            blockHash,
          },
        });
      }
    };

  getPeers: () => Promise<Peer[]> = async () => {
    try {
      const { peers } = await this.rpcClient.getPeers();

      return peers.map(p => ({ id: p.node_id, address: p.address }));
    } catch (err) {
      throw new ApiError({
        type: RpcApiError.PeersFetchFailed,
        message: 'An error occurred while fetching peers',
        data: {
          err,
        },
      });
    }
  };

  getDeploy: (deployHash: string) => Promise<Deploy | undefined> =
    async deployHash => {
      try {
        const { deploy, execution_results: executionResults } =
          await this.rpcClient.getDeployInfo(deployHash);

        const paymentMap = new Map(
          (deploy.payment as JsonDeployPayment).ModuleBytes.args,
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const paymentAmount = CLValueParsers.fromJSON(paymentMap.get('amount'))
          .unwrap()
          .value()
          .toString() as string;

        const { timestamp, account: publicKey } = deploy.header;

        const { block_hash: blockHash, result: executionResult } =
          executionResults[0];

        const status = executionResult.Success
          ? DeployStatus.Success
          : DeployStatus.Failed;

        const deploySession = deploy.session as JsonDeploySession;

        const { action, deployType, amount } = determineDeploySessionData(
          deploySession,
          status,
        );

        const cost = executionResult.Success
          ? executionResult.Success.cost
          : executionResult.Failure?.cost ?? 0;

        const dateTime = new Date(timestamp);

        const timeSince = formatTimeAgo(dateTime);
        const readableTimestamp = formatDate(dateTime);

        return {
          timestamp,
          timeSince,
          readableTimestamp,
          deployHash,
          blockHash,
          publicKey,
          action,
          deployType,
          amount,
          paymentAmount,
          cost: cost.toString(),
          status,
          rawDeploy: JSON.stringify({
            deploy,
            execution_results: executionResults,
          }),
        };
      } catch (err) {
        throw new ApiError({
          type: RpcApiError.DeployFetchFailed,
          message: 'An error occurred while fetching deploy with hash',
          data: {
            deployHash,
            err,
          },
        });
      }
    };

  getAccount = async (publicKeyHex: string) => {
    try {
      const stateRootHash = await this.rpcClient.getStateRootHash();
      const accountHash = CLPublicKey.fromHex(publicKeyHex).toAccountHashStr();

      const { Account: account } = await this.rpcClient.getBlockState(
        stateRootHash,
        accountHash,
        [],
      );

      if (!account) {
        throw new ApiError({
          type: RpcApiError.AccountMissing,
          message: 'Unable to find account',
          data: {
            publicKeyHex,
            stateRootHash,
            accountHash,
          },
        });
      }

      return {
        rawAccountHash: accountHash,
        trimmedAccountHash: accountHash.slice(13),
        publicKey: publicKeyHex,
        mainPurse: account.mainPurse,
        rawAccount: JSON.stringify(account),
      };
    } catch (err) {
      if ((err as ApiError).type === RpcApiError.AccountMissing) {
        throw err;
      }

      throw new ApiError({
        type: RpcApiError.AccountFetchFailed,
        message: 'An error occurred while fetching account',
        data: {
          publicKeyHex,
          err,
        },
      });
    }
  };

  getBalance: (uref: string) => Promise<string | null> = async uref => {
    try {
      const stateRootHash = await this.rpcClient.getStateRootHash();
      const balance = await this.rpcClient.getAccountBalance(
        stateRootHash,
        uref,
      );

      if (!!balance) {
        return balance.toString();
      }

      return null;
    } catch (err) {
      throw new ApiError({
        type: RpcApiError.BalanceFetchFailed,
        message: 'An error occurred while fetching account balance',
        data: {
          err,
          uref,
        },
      });
    }
  };

  getCurrentBlockHeight: () => Promise<number> = async () => {
    try {
      const { block } = await this.rpcClient.getLatestBlockInfo();

      return block!.header.height;
    } catch (err) {
      throw new ApiError({
        type: RpcApiError.CurrentBlockHeightFailed,
        message: 'An error occurred while fetching current block height',
        data: {
          err,
        },
      });
    }
  };

  getBlockByHeight: (height: number) => Promise<Block> = async height => {
    try {
      const { block } = await this.rpcClient.getBlockInfoByHeight(height);

      if (!block) {
        throw new ApiError({
          type: RpcApiError.BlockByHeightMissing,
          message: 'We could not find a block at this height',
          data: { height },
        });
      }

      const { hash, header } = block;

      const {
        timestamp,
        era_id: eraID,
        state_root_hash: stateRootHash,
        parent_hash: parentHash,
      } = header;

      const {
        proposer: validatorPublicKey,
        deploy_hashes: deployHashes,
        transfer_hashes: transferHashes,
      } = (block as JsonBlockWithBody).body;

      const deployHashCount = deployHashes?.length || 0;
      const transferHashCount = transferHashes?.length || 0;
      const deployCount = deployHashCount + transferHashCount;

      const dateTime = new Date(timestamp);

      const timeSince = formatTimeAgo(dateTime);
      const readableTimestamp = formatDate(dateTime);

      return {
        hash,
        height,
        eraID,
        deployCount,
        readableTimestamp,
        timestamp,
        timeSince,
        transferHashes,
        deployHashes,
        validatorPublicKey,
        stateRootHash,
        parentHash,
        rawBlock: JSON.stringify(block),
      };
    } catch (err) {
      if ((err as ApiError).type === RpcApiError.BlockByHeightMissing) {
        throw err;
      }

      throw new ApiError({
        type: RpcApiError.BlockByHeightFailed,
        message: 'An error occurred while fetching block by height',
        data: {
          height,
          err,
        },
      });
    }
  };

  getBlocks: (fromHeight?: number, numToShow?: number) => Promise<Block[]> =
    async (fromHeight, numToShow = this.defaultPagination) => {
      try {
        const currentHeight =
          fromHeight || (await this.getCurrentBlockHeight());

        const blocks: Block[] = [];

        for (let i = currentHeight; i > currentHeight - numToShow; i--) {
          const block = await this.getBlockByHeight(i);

          blocks.push({ ...block, rawBlock: JSON.stringify(block) });
        }

        return blocks;
      } catch (err) {
        throw new ApiError({
          type: RpcApiError.GetBlocksFailed,
          message: 'An error occurred while fetching blocks',
          data: {
            err,
          },
        });
      }
    };

  getStatus: () => Promise<NetworkStatus> = async () => {
    try {
      const {
        api_version: apiVersion,
        build_version: buildVersion,
        chainspec_name: networkName,
      } = (await this.rpcClient.getStatus()) as GetStatusResultExtended;

      const build = buildVersion.slice(0, 5);
      const api = apiVersion;

      return {
        api,
        build,
        networkName,
      };
    } catch (err) {
      throw new ApiError({
        type: RpcApiError.GetStatusFailed,
        message: 'An error occurred while fetching blocks',
        data: {
          err,
        },
      });
    }
  };
}

const casperJsonRpcService = new CasperServiceByJsonRPC(webServerUrl);

export const casperApi = new RpcApi(casperJsonRpcService);
