/* eslint-disable jest/no-conditional-expect */
import { DeployStatus } from './types';
import { formatDate } from '../utils';
import { DEFAULT_NUM_TO_SHOW, RpcApi, RpcApiError } from './rpc-client';
import {
  addToAccountWhitelist,
  approveDeploy,
  bid,
  bridgeOut,
  burn,
  claim,
  delegate,
  mint,
  mintCopies,
  mintOne,
  revokeBid,
  transfer,
  transferToken,
  undelegate,
  wasmDeploy,
} from './rpc-client-tests';

describe('rpc-client', () => {
  describe('getBlock', () => {
    it('should return a block', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockRawBlockData = {
        hash: '',
        header: {
          timestamp: dateTimeString,
          height: 1,
          era_id: 1,
          state_root_hash: '',
          parent_hash: '',
        },
        body: {
          proposer: '',
          deploy_hashes: [''],
          transfer_hashes: [''],
        },
      };

      const mockJsonRpc = {
        getBlockInfo: jest.fn().mockResolvedValue({
          block: mockRawBlockData,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const mockBlockHash = 'block-hash';

      const block = await mockRpcClient.getBlock(mockBlockHash);

      const mockBlock = {
        timestamp: dateTimeString,
        // we have to use the returned timeSince as mocking it will inevitably be unreliable
        timeSince: block?.timeSince,
        readableTimestamp: formatDate(dateTime),
        height: 1,
        eraID: 1,
        hash: '',
        validatorPublicKey: '',
        deployCount: 2,
        transferHashes: [''],
        deployHashes: [''],
        stateRootHash: '',
        parentHash: '',
        rawBlock: JSON.stringify(mockRawBlockData),
      };

      expect(mockJsonRpc.getBlockInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getBlockInfo).toHaveBeenCalledWith(mockBlockHash);
      expect(block).toEqual(mockBlock);
    });

    it('should throw a BlockFetchFailed ApiError if an Error is thrown', async () => {
      const mockJsonRpc = {
        getBlockInfo: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong.')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const mockBlockHash = 'block-hash';

      expect.assertions(1);

      try {
        await mockRpcClient.getBlock(mockBlockHash);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.BlockFetchFailed);
      }
    });

    it('should throw a BlockMissing ApiError when no block data is returned from sdk', async () => {
      const mockJsonRpc = {
        getBlockInfo: jest.fn().mockResolvedValue({ block: undefined }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const mockBlockHash = 'non-existing-block-hash';

      expect.assertions(1);

      try {
        await mockRpcClient.getBlock(mockBlockHash);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.BlockMissing);
      }
    });
  });

  describe('getPeers', () => {
    it('should return a list of peers', async () => {
      const mockRawPeer = {
        node_id: 1,
        address: 'address',
      };

      const mockPeer = {
        id: 1,
        address: 'address',
      };

      const mockRawPeers = [mockRawPeer, mockRawPeer, mockRawPeer];
      const mockPeers = [mockPeer, mockPeer, mockPeer];

      const mockJsonRpc = {
        getPeers: jest.fn().mockResolvedValue({
          peers: mockRawPeers,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const peers = await mockRpcClient.getPeers();

      expect(mockJsonRpc.getPeers).toHaveBeenCalledTimes(1);
      expect(peers).toEqual(mockPeers);
    });

    it('should return an empty list of peers', async () => {
      const mockPeers: [] = [];

      const mockJsonRpc = {
        getPeers: jest.fn().mockResolvedValue({
          peers: mockPeers,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const peers = await mockRpcClient.getPeers();

      expect(mockJsonRpc.getPeers).toHaveBeenCalledTimes(1);
      expect(peers).toEqual(mockPeers);
    });

    it('should throw PeersFetchFailed ApiError when an Error is caught', async () => {
      const mockJsonRpc = {
        getPeers: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong.')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getPeers();
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.PeersFetchFailed);
      }
    });
  });

  describe('getDeploy', () => {
    it('should return a deploy', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        '74f59c19a24996714645f160363235e582c23fc8c95765a6df13b19089a1c162';
      const mockBlockHash =
        '05ebc114e9c28b22dc9830b561b02569642698358a100b4c0f1123766d3a73bd';
      const mockPublicKey =
        '01b426de500f84ff4f2d765928fb8053539cf10dd917fb1ff6104eda48a2759e10';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          account:
            '01b426de500f84ff4f2d765928fb8053539cf10dd917fb1ff6104eda48a2759e10',
          timestamp: dateTimeString,
          ttl: '30m',
          gas_price: 1,
          body_hash:
            '30122952305bf5e157b31559eee71189ffba2f81c737d72d18616e30d8d92842',
          dependencies: [],
          chain_name: 'casper-test',
        },
        payment: {
          ModuleBytes: {
            module_bytes: '',
            args: [
              [
                'amount',
                {
                  cl_type: 'U512',
                  bytes: '05005847f80d',
                  parsed: '60000000000',
                },
              ],
            ],
          },
        },
        session: {
          StoredContractByHash: {
            hash: '730b9041acfd3c9d674d2d9ed6e8b12cec6f6140063bf7fea6063b8612277014',
            entry_point: 'init',
            args: [
              [
                'scontract-hash',
                {
                  cl_type: 'String',
                  bytes:
                    '55000000636f6e74726163742d7061636b6167652d7761736d37613739663134633261366534313934656239396630616230383237313262363564393361396437323463333930343132393532313236393937373631373437',
                  parsed:
                    'contract-package-wasm7a79f14c2a6e4194eb99f0ab082712b65d93a9d724c390412952126997761747',
                },
              ],
              [
                'token-hash',
                {
                  cl_type: 'String',
                  bytes:
                    '49000000636f6e74726163742d62303265633966653433396139343562636330636334613738366632326661623761653431383239653130656130323965366638326166316233383333623630',
                  parsed:
                    'contract-b02ec9fe439a945bcc0cc4a786f22fab7ae41829e10ea029e6f82af1b3833b60',
                },
              ],
            ],
          },
        },
        approvals: [
          {
            signer:
              '01b426de500f84ff4f2d765928fb8053539cf10dd917fb1ff6104eda48a2759e10',
            signature: mockPublicKey,
          },
        ],
      };

      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Failure: {
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'balance-72fb48a79750b7ed2ce11dafd9f7e1420980f40afbb0385637aba83e4b22f82c',
                    transform: {
                      WriteCLValue: {
                        cl_type: 'U512',
                        bytes: '0500dd0ee902',
                        parsed: '12500000000',
                      },
                    },
                  },
                  {
                    key: 'balance-62f7fe1cecb1a4c600ffa791479ce52fb8cbda408815f4dd1b1e0d82e704579a',
                    transform: {
                      AddUInt512: '2500000000',
                    },
                  },
                ],
              },
              transfers: [],
              cost: '2500000000',
              error_message: 'Mint error: 0',
            },
          },
        },
      ];

      const mockJsonRpc = {
        getDeployInfo: jest.fn().mockResolvedValue({
          deploy: mockRawDeploy,
          execution_results: mockRawExecutionResults,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const deploy = await mockRpcClient.getDeploy(mockDeployHash);

      const mockDeploy = {
        timestamp: dateTimeString,
        timeSince: deploy?.timeSince,
        readableTimestamp: formatDate(dateTime),
        deployHash: mockDeployHash,
        blockHash: mockBlockHash,
        publicKey: mockPublicKey,
        action: 'init',
        amount: undefined,
        deployType: 'StoredContractByHash',
        paymentAmount: '60000000000',
        cost: '2500000000',
        status: DeployStatus.Failed,
        rawDeploy: JSON.stringify({
          deploy: mockRawDeploy,
          execution_results: mockRawExecutionResults,
        }),
      };

      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledWith(mockDeployHash);
      expect(deploy).toEqual(mockDeploy);
    });

    it('should throw a DeployFetchFailed ApiError when an Error is caught', async () => {
      const mockDeployHash =
        '74f59c19a24996714645f160363235e582c23fc8c95765a6df13b19089a1c162';

      const mockJsonRpc = {
        getDeployInfo: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong.')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getDeploy(mockDeployHash);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.DeployFetchFailed);
      }
    });

    it(
      'should return a deploy of type add_to_account_whitelist',
      addToAccountWhitelist,
    );

    it('should return a deploy of type approve_deploy', approveDeploy);

    it('should return a deploy of type bid', bid);

    it('should return a deploy of type bridge_out', bridgeOut);

    it('should return a deploy of type burn', burn);

    it('should return a deploy of type claim', claim);

    it('should return a deploy of type delegate', delegate);

    it('should return a deploy of type mint_copies', mintCopies);

    it('should return a deploy of type mint_one', mintOne);

    it('should return a deploy of type mint', mint);

    it('should return a deploy of type revoke_bid', revokeBid);

    it('should return a deploy of type transfer_token', transferToken);

    it('should return a deploy of type Transfer', transfer);

    it('should return a deploy of type undelegate', undelegate);

    it('should return a deploy of type WASM deploy', wasmDeploy);
  });

  describe('getAccount', () => {
    it('should return an account', async () => {
      const mockPublicKeyHex =
        '017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e';
      const mockStateRootHash = 'state-root-hash';
      const mockAccountHash =
        'account-hash-21eaea584903e79365bcb1f7607179cc118807033c8919cff7489a91c3a822d1';
      const mockMainPurse =
        'uref-62f7fe1cecb1a4c600ffa791479ce52fb8cbda408815f4dd1b1e0d82e704579a-007';

      const mockRawAccount = {
        _accountHash: mockAccountHash,
        namedKeys: [],
        mainPurse: mockMainPurse,
        associatedKeys: [
          {
            accountHash: mockAccountHash,
            weight: 1,
          },
        ],
        actionThresholds: {
          deployment: 1,
          keyManagement: 1,
        },
      };

      const mockJsonRpc = {
        getStateRootHash: jest.fn().mockResolvedValue(mockStateRootHash),
        getBlockState: jest.fn().mockResolvedValue({
          Account: mockRawAccount,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const mockAccount = {
        rawAccountHash: mockAccountHash,
        trimmedAccountHash: mockAccountHash.slice(13),
        publicKey: mockPublicKeyHex,
        mainPurse: mockMainPurse,
        rawAccount: JSON.stringify(mockRawAccount),
      };

      const account = await mockRpcClient.getAccount(mockPublicKeyHex);

      expect(account).toEqual(mockAccount);
      expect(mockJsonRpc.getStateRootHash).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getBlockState).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getBlockState).toHaveBeenCalledWith(
        mockStateRootHash,
        mockAccountHash,
        [],
      );
    });

    it('should throw an AccountFetchFailed ApiError if an Error is caught', async () => {
      const mockPublicKeyHex =
        '017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e';
      const mockJsonRpc = {
        getStateRootHash: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong.')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getAccount(mockPublicKeyHex);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.AccountFetchFailed);
      }
    });

    it('should throw an AccountMissing ApiError if SDK does not return account', async () => {
      const mockPublicKeyHex =
        '017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e';

      const mockJsonRpc = {
        getStateRootHash: jest.fn().mockResolvedValue(mockPublicKeyHex),
        getBlockState: jest.fn().mockResolvedValue({
          Account: undefined,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getAccount(mockPublicKeyHex);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.AccountMissing);
      }
    });
  });

  describe('getBalance', () => {
    it('should return a balance', async () => {
      const mockUref =
        'uref-62f7fe1cecb1a4c600ffa791479ce52fb8cbda408815f4dd1b1e0d82e704579a-007';
      const mockStateRootHash = 'state-root-hash';
      const mockBalance = 1000;

      const mockJsonRpc = {
        getStateRootHash: jest.fn().mockResolvedValue(mockStateRootHash),
        getAccountBalance: jest.fn().mockResolvedValue(mockBalance),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const balance = await mockRpcClient.getBalance(mockUref);

      expect(balance).toEqual(mockBalance.toString());
      expect(mockJsonRpc.getStateRootHash).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getAccountBalance).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getAccountBalance).toHaveBeenCalledWith(
        mockStateRootHash,
        mockUref,
      );
    });

    it('should return null when no balance is returned from the SDK', async () => {
      const mockUref =
        'uref-62f7fe1cecb1a4c600ffa791479ce52fb8cbda408815f4dd1b1e0d82e704579a-007';
      const mockStateRootHash = 'state-root-hash';

      const mockJsonRpc = {
        getStateRootHash: jest.fn().mockResolvedValue(mockStateRootHash),
        getAccountBalance: jest.fn().mockResolvedValue(undefined),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const balance = await mockRpcClient.getBalance(mockUref);

      expect(balance).toEqual(null);
      expect(mockJsonRpc.getStateRootHash).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getAccountBalance).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getAccountBalance).toHaveBeenCalledWith(
        mockStateRootHash,
        mockUref,
      );
    });

    it('should throw an BalanceFetchFailed ApiError if an Error is caught', async () => {
      const mockUref =
        'uref-62f7fe1cecb1a4c600ffa791479ce52fb8cbda408815f4dd1b1e0d82e704579a-007';
      const mockStateRootHash = 'state-root-hash';

      const mockJsonRpc = {
        getStateRootHash: jest.fn().mockResolvedValue(mockStateRootHash),
        getAccountBalance: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong.')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getBalance(mockUref);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.BalanceFetchFailed);
      }
    });
  });

  describe('getCurrentBlockHeight', () => {
    it('should return current block height', async () => {
      const mockCurrentBlockHeight = 1;

      const mockJsonRpc = {
        getLatestBlockInfo: jest.fn().mockResolvedValue({
          block: {
            header: {
              height: mockCurrentBlockHeight,
            },
          },
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const currentBlockHeight = await mockRpcClient.getCurrentBlockHeight();

      expect(mockJsonRpc.getLatestBlockInfo).toHaveBeenCalledTimes(1);
      expect(currentBlockHeight).toBe(mockCurrentBlockHeight);
    });

    it('should throw CurrentBlockHeightFailed ApiError when an Error is caught', async () => {
      const mockJsonRpc = {
        getLatestBlockInfo: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getCurrentBlockHeight();
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.CurrentBlockHeightFailed);
      }
    });
  });

  describe('getBlockByHeight', () => {
    it('should return block by height', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockBlockHeight = 1;

      const mockRawBlockData = {
        hash: '',
        header: {
          timestamp: dateTimeString,
          height: 1,
          era_id: 1,
          state_root_hash: '',
          parent_hash: '',
        },
        body: {
          proposer: '',
          deploy_hashes: [''],
          transfer_hashes: [''],
        },
      };

      const mockJsonRpc = {
        getBlockInfoByHeight: jest.fn().mockResolvedValue({
          block: mockRawBlockData,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const block = await mockRpcClient.getBlockByHeight(mockBlockHeight);

      const mockBlock = {
        timestamp: dateTimeString,
        // we have to use the returned timeSince as mocking it will inevitably be unreliable
        timeSince: block?.timeSince,
        readableTimestamp: formatDate(dateTime),
        height: 1,
        eraID: 1,
        hash: '',
        validatorPublicKey: '',
        deployCount: 2,
        transferHashes: [''],
        deployHashes: [''],
        stateRootHash: '',
        parentHash: '',
        rawBlock: JSON.stringify(mockRawBlockData),
      };

      expect(mockJsonRpc.getBlockInfoByHeight).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getBlockInfoByHeight).toHaveBeenCalledWith(
        mockBlockHeight,
      );
      expect(block).toEqual(mockBlock);
    });

    it('should throw a BlockByHeightFailed ApiError if an Error is thrown', async () => {
      const mockJsonRpc = {
        getBlockInfoByHeight: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong.')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const mockBlockHeight = 1;

      expect.assertions(1);

      try {
        await mockRpcClient.getBlockByHeight(mockBlockHeight);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.BlockByHeightFailed);
      }
    });

    it('should throw a BlockByHeightMissing ApiError when no block data is returned from sdk', async () => {
      const mockJsonRpc = {
        getBlockInfoByHeight: jest.fn().mockResolvedValue({ block: undefined }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const mockBlockHeight = 1;

      expect.assertions(1);

      try {
        await mockRpcClient.getBlockByHeight(mockBlockHeight);
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.BlockByHeightMissing);
      }
    });
  });

  describe('getBlocks', () => {
    it('should return 1 block when asked for 1 block', async () => {
      const currentBlockHeight = 1;
      const numToShow = 1;

      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockRawBlockData = {
        hash: '',
        header: {
          timestamp: dateTimeString,
          height: 1,
          era_id: 1,
          state_root_hash: '',
          parent_hash: '',
        },
        body: {
          proposer: '',
          deploy_hashes: [''],
          transfer_hashes: [''],
        },
      };

      const mockJsonRpc = {
        getLatestBlockInfo: jest.fn().mockResolvedValue({
          block: {
            header: {
              height: currentBlockHeight,
            },
          },
        }),
        getBlockInfoByHeight: jest.fn().mockResolvedValue({
          block: mockRawBlockData,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const blocks = await mockRpcClient.getBlocks(undefined, numToShow);

      expect(mockJsonRpc.getLatestBlockInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getBlockInfoByHeight).toHaveBeenCalledTimes(1);
      expect(blocks.length).toBe(1);
    });

    it('should not call getLatestBlockInfo info if given block height', async () => {
      const currentBlockHeight = 1;
      const numToShow = 1;

      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockRawBlockData = {
        hash: '',
        header: {
          timestamp: dateTimeString,
          height: 1,
          era_id: 1,
          state_root_hash: '',
          parent_hash: '',
        },
        body: {
          proposer: '',
          deploy_hashes: [''],
          transfer_hashes: [''],
        },
      };

      const mockJsonRpc = {
        getLatestBlockInfo: jest.fn().mockResolvedValue({
          block: {
            header: {
              height: currentBlockHeight,
            },
          },
        }),
        getBlockInfoByHeight: jest.fn().mockResolvedValue({
          block: mockRawBlockData,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const blocks = await mockRpcClient.getBlocks(
        currentBlockHeight,
        numToShow,
      );

      expect(mockJsonRpc.getLatestBlockInfo).toHaveBeenCalledTimes(0);
      expect(mockJsonRpc.getBlockInfoByHeight).toHaveBeenCalledTimes(1);
      expect(blocks.length).toBe(1);
    });

    it('should call getCurrentBlockHeight when not given a block height', async () => {
      const numToShow = 1;

      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockRawBlockData = {
        hash: '',
        header: {
          timestamp: dateTimeString,
          height: 1,
          era_id: 1,
          state_root_hash: '',
          parent_hash: '',
        },
        body: {
          proposer: '',
          deploy_hashes: [''],
          transfer_hashes: [''],
        },
      };

      const mockJsonRpc = {
        getLatestBlockInfo: jest.fn().mockResolvedValue({
          block: {
            header: {
              height: 1,
            },
          },
        }),
        getBlockInfoByHeight: jest.fn().mockResolvedValue({
          block: mockRawBlockData,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const blocks = await mockRpcClient.getBlocks(undefined, numToShow);

      expect(mockJsonRpc.getLatestBlockInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getBlockInfoByHeight).toHaveBeenCalledTimes(1);
      expect(blocks.length).toBe(1);
    });

    it('should return DEFAULT_NUM_TO_SHOW blocks when not given numToShow param', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockRawBlockData = {
        hash: '',
        header: {
          timestamp: dateTimeString,
          height: 1,
          era_id: 1,
          state_root_hash: '',
          parent_hash: '',
        },
        body: {
          proposer: '',
          deploy_hashes: [''],
          transfer_hashes: [''],
        },
      };

      const mockJsonRpc = {
        getLatestBlockInfo: jest.fn().mockResolvedValue({
          block: {
            header: {
              height: DEFAULT_NUM_TO_SHOW,
            },
          },
        }),
        getBlockInfoByHeight: jest.fn().mockResolvedValue({
          block: mockRawBlockData,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const blocks = await mockRpcClient.getBlocks();

      expect(mockJsonRpc.getLatestBlockInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getBlockInfoByHeight).toHaveBeenCalledTimes(
        DEFAULT_NUM_TO_SHOW,
      );
      expect(blocks.length).toBe(DEFAULT_NUM_TO_SHOW);
    });

    it('should throw a GetBlocksFailed ApiError if an Error is caught', async () => {
      const mockJsonRpc = {
        getLatestBlockInfo: jest.fn().mockResolvedValue({
          block: {
            header: {
              height: DEFAULT_NUM_TO_SHOW,
            },
          },
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getBlocks();
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.GetBlocksFailed);
      }
    });
  });

  describe('getStatus', () => {
    it('should return network status data', async () => {
      const api = '1.4.10';
      const build = '1.3.2';
      const chainspecName = 'integration-test';

      const mockJsonRpc = {
        getStatus: jest.fn().mockResolvedValue({
          api_version: `${api}`,
          build_version: `${build}`,
          chainspec_name: chainspecName,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const currentStatus = await mockRpcClient.getStatus();

      expect(mockJsonRpc.getStatus).toHaveBeenCalledTimes(1);
      expect(currentStatus.api).toBe(api);
      expect(currentStatus.build).toBe(build);
      expect(currentStatus.networkName).toBe(chainspecName);
    });

    it('should throw GetStatusFailed ApiError when an Error is caught', async () => {
      const mockJsonRpc = {
        getStatus: jest
          .fn()
          .mockRejectedValue(new Error('something went wrong')),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      expect.assertions(1);

      try {
        await mockRpcClient.getStatus();
      } catch (err: any) {
        expect(err.type).toBe(RpcApiError.GetStatusFailed);
      }
    });
  });
});

export {};
