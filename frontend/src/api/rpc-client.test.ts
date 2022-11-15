/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { DeployStatus } from './types';
import { formatDate } from '../utils';
import { DEFAULT_NUM_TO_SHOW, RpcApi, RpcApiError } from './rpc-client';

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

    it('should throw n PeersFetchFailed ApiError when an Error is caught', async () => {
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

    it('should return a deploy of type Transfer', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        'af1cd0ba8f8b0af8ad3dfdb1b9a9a35d2bf3cf3d56392a5d530104ec9330d9e0';
      const mockBlockHash =
        '5f0ff357108e012876247567b8f7e8ad188e1d39d89a1dd13e013e2b8fff42ae';
      const mockPublicKey =
        '0203338734fc43ca8c73511b84d6be160f35e7421271fb6d22461ff9640993652a51';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '0203338734fc43ca8c73511b84d6be160f35e7421271fb6d22461ff9640993652a51',
          body_hash:
            '10a0780a6da88bbb4183b50d13a3a43ac0ed4daa22015686f4b8062a81c1f932',
          gas_price: 1,
          timestamp: dateTimeString,
          dependencies: [],
          chain_name: 'casper-test',
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '0400e1f505',
                  parsed: '0400e1f505',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          Transfer: {
            args: [
              [
                'amount',
                {
                  bytes: '05002fafcee8',
                  parsed: '999900000000',
                  cl_type: 'U512',
                },
              ],
              [
                'target',
                {
                  bytes:
                    '020377bc3ad54b5505971e001044ea822a3f6f307f8dc93fa45a05b7463c0a053bed',
                  parsed:
                    '020377bc3ad54b5505971e001044ea822a3f6f307f8dc93fa45a05b7463c0a053bed',
                  cl_type: 'PublicKey',
                },
              ],
              [
                'id',
                {
                  bytes: '01b992355484010000',
                  parsed: '1667860107961',
                  cl_type: {
                    option: 'U64',
                  },
                },
              ],
            ],
          },
        },
        approvals: [
          {
            signer:
              '0203338734fc43ca8c73511b84d6be160f35e7421271fb6d22461ff9640993652a51',
            signature: mockPublicKey,
          },
        ],
      };
      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Success: {
              cost: '100000000',
              effect: {
                operations: [],
                tranforms: [
                  {
                    key: 'account-hash-82dee24436178b6d45ba241743f44e456ba64af0abc53f35f7cc3ab39e25fd7c',
                    transform: 'Identity',
                  },
                  {
                    key: 'account-hash-82dee24436178b6d45ba241743f44e456ba64af0abc53f35f7cc3ab39e25fd7c',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce',
                    transform: {
                      WriteCLValue: {
                        bytes: '05002fafcee8',
                        parsed: '999900000000',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddUInt512: '100000000',
                    },
                  },
                  {
                    key: 'account-hash-82dee24436178b6d45ba241743f44e456ba64af0abc53f35f7cc3ab39e25fd7c',
                    transform: 'Identity',
                  },
                  {
                    key: 'account-hash-82dee24436178b6d45ba241743f44e456ba64af0abc53f35f7cc3ab39e25fd7c',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865 243b7c02c0417ab6eac361c5c56602fd4 2 ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce',
                    transform: {
                      WriteCLValue: {
                        bytes: '05002fafcee8',
                        parsed: '999900000000',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddUInt512: '100000000',
                    },
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-3bf63df27941be80790301f35b67b083536f8c4f275526c4e9b3105087c35768',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-3bf63df27941be80790301f35b67b083536f8c4f275526c4e9b3105087c35768',
                    transform: {
                      AddUInt512: '999900000000',
                    },
                  },
                  {
                    key: 'transfer-c4b26991c9acf838f9bcc81fac1c4f6dc9755115f5a78d5d8d0cac092a95fc13',
                    transform: {
                      WriteTransfer: {
                        id: '1667860107961',
                        to: 'account-hash-82dee24436178b6d45ba241743f44e456ba64af0abc53f35f7cc3ab39e25fd7c',
                        gas: '0',
                        from: 'account-hash-2193d1cbfe55e8221376da5ca1cd514307135473d3c3f6411a8b4d0647e039ad',
                        amount: '999900000000',
                        source:
                          'uref-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce-007',
                        target:
                          'uref-3bf63df27941be80790301f35b67b083536f8c4f275526c4e9b3105087c35768-004',
                        deploy_hash: mockDeployHash,
                      },
                    },
                  },
                  {
                    key: 'deploy-af1cd0ba8f8b0af8ad3dfdb1b9a9a35d2bf3cf3d56392a5d530104ec9330d9e0',
                    transform: {
                      WriteDeployInfo: {
                        gas: '100000000',
                        from: 'account-hash-2193d1cbfe55e8221376da5ca1cd514307135473d3c3f6411a8b4d0647e039ad',
                        source:
                          'uref-bf0a60f9064e3fb0a6dd51f8a049bb0e9aa4ebb4ae100146c3150f4a1d30ebce-007',
                        transfers: [
                          'transfer-c4b26991c9acf838f9bcc81fac1c4f6dc9755115f5a78d5d8d0cac092a95fc13',
                        ],
                        deploy_hash: mockDeployHash,
                      },
                    },
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-0a24ef56971d46bfefbd5590afe20e5f3482299aba74e1a0fc33a55008cf9453',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-0a24ef56971d46bfefbd5590afe20e5f3482299aba74e1a0fc33a55008cf9453',
                    transform: {
                      AddUInt512: '100000000',
                    },
                  },
                ],
              },
              transfers: [
                'transfer-c4b26991c9acf838f9bcc81fac1c4f6dc9755115f5a78d5d8d0cac092a95fc13',
              ],
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
        action: 'Transfer',
        amount: '999900000000',
        deployType: undefined,
        paymentAmount: '100000000',
        cost: '100000000',
        status: DeployStatus.Success,
        rawDeploy: JSON.stringify({
          deploy: mockRawDeploy,
          execution_results: mockRawExecutionResults,
        }),
      };
      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledWith(mockDeployHash);
      expect(deploy).toEqual(mockDeploy);
    });

    it('should return a deploy of type bridge_out', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        '3609df6a9c574adb250e8e9c4dd8924d58df0c6fe2fe96fbb5f9da2ba2f8b76f';
      const mockBlockHash =
        '90ee41e9cbb324488ab98644578ad74cf6ea90613c64d1bf847ba15577c316d2';
      const mockPublicKey =
        '010ad302bfc22c0e606d94d98a3baa2c8eeedd1e148d9a20a4453bb8cc5e530a19';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '010ad302bfc22c0e606d94d98a3baa2c8eeedd1e148d9a20a4453bb8cc5e530a19',
          body_hash:
            'ace4d860e62bfe26baa5a6030ff5ef4512669f08910eeae738ba57e94565f88b',
          gas_price: 1,
          timestamp: dateTimeString,
          chain_name: 'casper-test',
          dependencies: [],
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '040084d717',
                  parsed: '400000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          StoredContractByHash: {
            args: [
              [
                'token_contract',
                {
                  bytes:
                    '3c0c1847d1c410338ab9b4ee0919c181cf26085997ff9c797e8a1ae5b02ddf23',
                  parsed:
                    '3c0c1847d1c410338ab9b4ee0919c181cf26085997ff9c797e8a1ae5b02ddf23',
                  cl_type: {
                    ByteArray: 32,
                  },
                },
              ],
              [
                'amount',
                {
                  bytes: '021027',
                  parsed: '10000',
                  cl_type: 'U256',
                },
              ],
              [
                'source_chain',
                {
                  bytes: '06000000474f45524c49',
                  parsed: 'GOERLI',
                  cl_type: 'String',
                },
              ],
              [
                'source_address',
                {
                  bytes:
                    '2800000033303935663935356461373030623936323135636666633962633634616232653639656237646162',
                  parsed: '3095f955da700b96215cffc9bc64ab2e69eb7dab',
                  cl_type: 'String',
                },
              ],
              [
                'recipient',
                {
                  bytes:
                    '009060c0820b5156b1620c8e3344d17f9fad5108f5dc2672f2308439e84363c88e',
                  parsed: {
                    Account:
                      'account-hash-9060c0820b5156b1620c8e3344d17f9fad5108f5dc2672f2308439e84363c88e',
                  },
                  cl_type: 'Key',
                },
              ],
            ],
            hash: 'a1b6e284312a6dd8eea114f03000afeb5a5a674c8eb6033d27464f009ea46267',
            entry_point: 'bridge_out',
          },
        },
        approvals: [
          {
            signer:
              '8153c553e8339fb87224097e4a3a2d8e4d8f49fbacee5c192e039709bc4211ba',
            signature: mockPublicKey,
          },
        ],
      };

      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Success: {
              cost: '302543230',
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-12440b9a3d73c22bc1e2f379a50fd4a3fb8a7dbe33da29e88c50b7e85c2e6526',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-12440b9a3d73c22bc1e2f379a50fd4a3fb8a7dbe33da29e88c50b7e85c2e6526',
                    transform: {
                      WriteCLValue: {
                        bytes: '05809fadb905',
                        parsed: '24590000000',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddUInt512: '400000000',
                    },
                  },
                  {
                    key: 'hash-8153c553e8339fb87224097e4a3a2d8e4d8f49fbacee5c192e039709bc4211ba',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-706db5910ae6f53c9cb9e5f7881e6b78037b5c643ceb65ff1678581270395622',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-68ec682c63fdd5dca32fcceb05c8d76e5612081d4a65a1ad0b5ad284d58df56b',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-3c0c1847d1c410338ab9b4ee0919c181cf26085997ff9c797e8a1ae5b02ddf23',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-7bca8ff28e2d3c26d77b144664142cce5c02fabd69e5dcd0d4899e2c0c19dfe9',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-5eb30f70b6e0f4199c9c20cd4f7e8cec2a981dc9a731d9f9e29d3b6745101d34',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-1e46c1b33d81cdf4069cb97580dc8d2640bb57ded9d9a3342db1e50e97f6de7f',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-3c0c1847d1c410338ab9b4ee0919c181cf26085997ff9c797e8a1ae5b02ddf23',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-7bca8ff28e2d3c26d77b144664142cce5c02fabd69e5dcd0d4899e2c0c19dfe9',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-5eb30f70b6e0f4199c9c20cd4f7e8cec2a981dc9a731d9f9e29d3b6745101d34',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-1e46c1b33d81cdf4069cb97580dc8d2640bb57ded9d9a3342db1e50e97f6de7f',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-4ad5a92bdfbe2b4d517b62804142020197a7ef651e1cf9cc716caf2a5ef476ad',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-1e46c1b33d81cdf4069cb97580dc8d2640bb57ded9d9a3342db1e50e97f6de7f',
                    transform: {
                      WriteCLValue: {
                        bytes:
                          '050000000476998b0a072000000028952e8490e629d4e7de058769a0a2ad9c2fa804ac871dc2d5a576f9721316072c00000041584274745a454b357655386e4c6e6c39346765613367446531786b504f746c2f785a3457424a774f565969',
                        parsed: null,
                        cl_type: 'Any',
                      },
                    },
                  },
                  {
                    key: 'dictionary-4ad5a92bdfbe2b4d517b62804142020197a7ef651e1cf9cc716caf2a5ef476ad',
                    transform: {
                      WriteCLValue: {
                        bytes:
                          '0500000004c02f5501072000000028952e8490e629d4e7de058769a0a2ad9c2fa804ac871dc2d5a576f9721316072c000000414a42677749494c555661785967794f4d30545266352b7455516a3133435a79386a43454f6568445938694f',
                        parsed: null,
                        cl_type: 'Any',
                      },
                    },
                  },
                  {
                    key: 'hash-3c0c1847d1c410338ab9b4ee0919c181cf26085997ff9c797e8a1ae5b02ddf23',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-7bca8ff28e2d3c26d77b144664142cce5c02fabd69e5dcd0d4899e2c0c19dfe9',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-5eb30f70b6e0f4199c9c20cd4f7e8cec2a981dc9a731d9f9e29d3b6745101d34',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-1e46c1b33d81cdf4069cb97580dc8d2640bb57ded9d9a3342db1e50e97f6de7f',
                    transform: 'Identity',
                  },
                  {
                    key: 'uref-8edab0198ac7b91c0c1dd34a81d17dc14f801141402f8f85f2038c9e5b5ea9f8-000',
                    transform: {
                      WriteCLValue: {
                        bytes:
                          '7b000000013c0c1847d1c410338ab9b4ee0919c181cf26085997ff9c797e8a1ae5b02ddf2306000000474f45524c492800000033303935663935356461373030623936323135636666633962633634616232653639656237646162021027009060c0820b5156b1620c8e3344d17f9fad5108f5dc2672f2308439e84363c88e',
                        parsed: [
                          1, 60, 12, 24, 71, 209, 196, 16, 51, 138, 185, 180,
                          238, 9, 25, 193, 129, 207, 38, 8, 89, 151, 255, 156,
                          121, 126, 138, 26, 229, 176, 45, 223, 35, 6, 0, 0, 0,
                          71, 79, 69, 82, 76, 73, 40, 0, 0, 0, 51, 48, 57, 53,
                          102, 57, 53, 53, 100, 97, 55, 48, 48, 98, 57, 54, 50,
                          49, 53, 99, 102, 102, 99, 57, 98, 99, 54, 52, 97, 98,
                          50, 101, 54, 57, 101, 98, 55, 100, 97, 98, 2, 16, 39,
                          0, 144, 96, 192, 130, 11, 81, 86, 177, 98, 12, 142,
                          51, 68, 209, 127, 159, 173, 81, 8, 245, 220, 38, 114,
                          242, 48, 132, 57, 232, 67, 99, 200, 142,
                        ],
                        cl_type: {
                          List: 'U8',
                        },
                      },
                    },
                  },
                  {
                    key: 'deploy-3609df6a9c574a db250e8e9c4dd8924d58df0c6fe2fe96f b b5f9da2ba2f8b76f',
                    transform: {
                      WriteDeployInfo: {
                        gas: '302543230',
                        from: 'account-hash-daa2b596e0a496b04933e241e0567f2bcbecc829aa57d88cab096c28fd07dee2',
                        source:
                          'uref-12440b9a3d73c22bc1e2f379a50fd4a3fb8a7dbe33da29e88c50b7e85c2e6526-007',
                        transfers: [],
                        deploy_hash:
                          '3609df6a9c574adb250e8e9c4dd8924d58df0c6fe2fe96fbb5f9da2ba2f8b76f',
                      },
                    },
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1',
                    transform: {
                      AddUInt512: '400000000',
                    },
                  },
                ],
              },
              transfers: [],
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
        action: 'bridge_out',
        amount: undefined,
        deployType: 'StoredContractByHash',
        paymentAmount: '400000000',
        cost: '302543230',
        status: DeployStatus.Success,
        rawDeploy: JSON.stringify({
          deploy: mockRawDeploy,
          execution_results: mockRawExecutionResults,
        }),
      };

      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledWith(mockDeployHash);
      expect(deploy).toEqual(mockDeploy);
    });

    it('should return a deploy of type bid', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        'a75b0cb859efdcba04228e22867ae8a6b286ec4a7a7d28f8f786ec2b131a93ca';
      const mockBlockHash =
        'f0e9c9af0b17988c2b4ee1c9ae090a767068442f8bbe82d8c6b86793515f0b0f';
      const mockPublicKey =
        '017e80955a6d493a4a4b9f1b5dd23d2edcdc2c8b00fcd9689f2f735f501bd088c5';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '017e80955a6d493a4a4b9f1b5dd23d2edcdc2c8b00fcd9689f2f735f501bd088c5',
          body_hash:
            '6d08bcf54cebd97ecbd0cb711497292c274d05583189775db8c167c732c7ada3',
          gas_price: 1,
          timestamp: dateTimeString,
          chain_name: 'casper-test',
          dependencies: [],
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '0400ca9a3b',
                  parsed: '1000000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          StoredContractByHash: {
            args: [
              [
                'token_id',
                {
                  bytes: '0300000000000000',
                  parsed: 3,
                  cl_type: 'U64',
                },
              ],
              [
                'nft_contract_hash',
                {
                  bytes:
                    '0197ec1fdd4281b3ea73039f749fc784d80c3a7c562eba5a6a9adca223e3b5aca2',
                  parsed: {
                    Hash: 'hash-97ec1fdd4281b3ea73039f749fc784d80c3a7c562eba5a6a9adca223e3b5aca2',
                  },
                  cl_type: 'Key',
                },
              ],
              [
                'bidding_offer',
                {
                  bytes: '0500e40b5402',
                  parsed: '10000000000',
                  cl_type: 'U256',
                },
              ],
              [
                'identifier_mode',
                {
                  bytes: '00',
                  parsed: 0,
                  cl_type: 'U8',
                },
              ],
            ],
            hash: 'a1b6e284312a6dd8eea114f03000afeb5a5a674c8eb6033d27464f009ea46267',
            entry_point: 'bid',
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
              cost: '327107450',
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-beba664d16798fd6f33c8867d7c81706bab79ef2408be9ed31b81657a1dcec59',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-beba664d167 98fd6f33c88 6 7d7c81706bab79ef2408be9ed31b81657a1dcec59',
                    transform: {
                      WriteCLValue: {
                        bytes: '06e3518f97ad0b',
                        parsed: '12840199999971',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddUInt512: '1000000000',
                    },
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1',
                    transform: {
                      AddUInt512: '1000000000',
                    },
                  },
                ],
              },
              transfers: [],
              error_message: 'User error: 65533',
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
        action: 'bid',
        amount: undefined,
        deployType: 'StoredContractByHash',
        paymentAmount: '1000000000',
        cost: '327107450',
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

    it('should return a deploy of type mint', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        'dc5e7244f76a7f2968cf7b6f30d939d790d3ec38676b61ece3ed53403ecfba11';
      const mockBlockHash =
        'a5b97dc530a6474074d8d04c3fcd3cc6f335cc15f9b0e1dda13b404fcb4c5f7a';
      const mockPublicKey =
        '01ff85d8d335d2e5e1a8ba3554b447e2a61853971fc2a5bf9f1302557ef5eb2d4f';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '01ff85d8d335d2e5e1a8ba3554b447e2a61853971fc2a5bf9f1302557ef5eb2d4f',
          body_hash:
            '95c775b707844baae03c585994584aa0147e7d0f55b1556c97c3e053414c7897',
          gas_price: 1,
          timestamp: dateTimeString,
          chain_name: 'casper-test',
          dependencies: [],
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '04807c814a',
                  parsed: '1250000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          StoredContractByHash: {
            args: [
              [
                'recipient',
                {
                  bytes:
                    '005eb516c63517df710028e09d07a4f8309e5f9cd840bed71f3b507c7bf5da2d13',
                  parsed: {
                    Account:
                      'account-hash-5eb516c63517df710028e09d07a4f8309e5f9cd840bed71f3b507c7bf5da2d13',
                  },
                  cl_type: 'Key',
                },
              ],
              [
                'token_ids',
                {
                  bytes: '0100000006956c15778401',
                  parsed: ['1668445203605'],
                  cl_type: {
                    List: 'U256',
                  },
                },
              ],
              [
                'token_metas',
                {
                  bytes:
                    '0100000005000000040000006e616d650b000000436f6f6c204e46542023320b0000006465736372697074696f6e060000003338346477710b000000636f6e74656e744970667342000000636f6e74656e74666a66777765727533383431383469666b6a617366776f6c76766d32393233666e753275666966786e78687577656866327232776b666a656638340b000000706963747572654970667340000000696d616765666a66777765727533383431383469666b6a617366776f6c76766d32393233666e753275666966786e78687577656866327232776b666a656638340b000000736e69707065744970667342000000736e6970706574666a66777765727533383431383469666b6a617366776f6c76766d32393233666e753275666966786e78687577656866327232776b666a65663834',
                  parsed: [
                    [
                      {
                        key: 'name',
                        value: 'Cool NFT #2',
                      },
                      {
                        key: 'description',
                        value: '384dwq',
                      },
                      {
                        key: 'contentIpfs',
                        value:
                          'contentfjfwweru384184ifkjasfwolvvm2923fnu2ufifxnxhuwehf2r2wkfjef84',
                      },
                      {
                        key: 'pictureIpfs',
                        value:
                          'imagefjfwweru384184ifkjasfwolvvm2923fnu2ufifxnxhuwehf2r2wkfjef84',
                      },
                      {
                        key: 'snippetIpfs',
                        value:
                          'snippetfjfwweru384184ifkjasfwolvvm2923fnu2ufifxnxhuwehf2r2wkfjef84',
                      },
                    ],
                  ],
                  cl_type: {
                    List: {
                      Map: {
                        key: 'String',
                        value: 'String',
                      },
                    },
                  },
                },
              ],
            ],
            hash: 'aa769fb091e3617e8cfaf336b803bcc13b2e08ca60de7cd427949af38d69f549',
            entry_point: 'mint',
          },
          approvals: [
            {
              signer:
                '01ff85d8d335d2e5e1a8ba3554b447e2a61853971fc2a5bf9f1302557ef5eb2d4f',
              signature: mockPublicKey,
            },
          ],
        },
      };

      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Failure: {
              cost: '0',
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'balance-5707d2dcddb038629e589c5ee830ac73b15e82c3e299f7e08998e0c704ad294f',
                    transform: {
                      WriteCLValue: {
                        bytes: '05007fa30320',
                        parsed: '137500000000',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1',
                    transform: {
                      AddUInt512: '2500000000',
                    },
                  },
                ],
              },
              transfers: [],
              error_message: 'User error: 65533',
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
        action: 'mint',
        amount: undefined,
        deployType: 'StoredContractByHash',
        paymentAmount: '1250000000',
        cost: '0',
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

    it('should return a deploy of type WASM deploy', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        'd880c5fc1175d30870377f78aecf04856bbbb4801830932dcc02cf2455f75b50';
      const mockBlockHash =
        '8900f7fafac9ceb6efe1b6d47e24e212bdf9d2b226ecc6408a2fb4daec8d35a5';
      const mockPublicKey =
        '018afa98ca4be12d613617f7339a2d576950a2f9a92102ca4d6508ee31b54d2c02';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '018afa98ca4be12d613617f7339a2d576950a2f9a92102ca4d6508ee31b54d2c02',
          body_hash:
            'fc2edc834563354c9745656e5101be36f095bc6fcd09d21f6b281618c09a9807',
          gas_price: 1,
          timestamp: dateTimeString,
          chain_name: 'casper-test',
          dependencies: [],
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '04005ed0b2',
                  parsed: '3000000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          ModuleBytes: {
            args: [
              [
                'target',
                {
                  bytes:
                    '0720e7344d6e3972089fe7f4c1e9dd4b4503ea8f77e2e74f33eadabbe05d8589',
                  parsed:
                    '0720e7344d6e3972089fe7f4c1e9dd4b4503ea8f77e2e74f33eadabbe05d8589',
                  cl_type: {
                    ByteArray: 32,
                  },
                },
              ],
              [
                'amount',
                {
                  bytes: '050010a5d4e8',
                  parsed: '1000000000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes:
              '0061736d0100000001781260027f7f017f60037f7f7f017f60047f7f7f7f017f60017f0060037f7f7f0060077f7f7f7f7f7f7f017f60057f7f7f7f7f017f60047f7f7f7f0060000060027f7f0060017f017f60037f7e7e0060047f7f7e7e017e6000017f60017f017e60057f7f7f7f7f0060067f7f7f7f7f7f017f60037e7f7f017f02b1010703656e76146361737065725f6765745f6e616d65645f617267000203656e760d6361737065725f726576657274000303656e760f6361737065725f6e65775f75726566000403656e761a6361737065725f7472616e736665725f746f5f6163636f756e74000503656e76196361737065725f6765745f6e616d65645f6172675f73697a65000103656e760e6361737065725f6765745f6b6579000603656e760e6361737065725f7075745f6b65790007036e6d08000402000904030a04040308030a0a03030307040303090a0b0c030404040a0a0309000402000307000a0307000a060107090409090a040003090407040d0904000309090009040e030a0a0a0a09030009000104090908090700030404010009010e00000f100201110001010405017001161605030100110619037f01418080c0000b7f0041b88ec0000b7f0041b88ec0000b073705066d656d6f727902000463616c6c00070864656c656761746500130a5f5f646174615f656e6403010b5f5f686561705f626173650302091b010041010b152e333435322f30314c48565a57597166616b6a62690abdce016d08001093808080000b1301017f2000200110aa80808000210220020f0b0f0020002001200210ab808080000f0b1701017f200020012002200310ac80808000210420040f0b1301017f2000200110ad80808000210220020f0b0d002000200110dd808080000f0b72000240024020014100480d0002400240024020020d0020010d01410121020c040b024020010d00410121020c040b20014101108b808080002202450d010c030b2001410110888080800022020d020b2001410110dc80808000000b10de80808000000b20002001360204200020023602000b0b002000109280808000000b0a00200010d3808080000b980503087f027e027f2380808080004180016b2203248080808000200341086a2001200210a3808080000240024002402003280208450d0002400240200328020c22040d00410028028080c0800021050c010b20012002200410a6808080002205200410808080800010d480808000220141ff0171412a470d020b200341d0006a2005200410ce808080000240024020032d005022064101470d000c010b200341f4006a28020021072003200341f8006a28020022014100108d8080800020032802042102200328020022082007200110f2808080001a200341386a200341dd006a290000370300200341c0006a200341e5006a290000370300200341c7006a200341ec006a2900003700002003200329005537033020032d005421070b02402004450d002005200441011089808080000b20064101460d02200341106a41176a2204200341306a41176a2206290000370000200341106a41106a2205200341306a41106a2209290300370300200341106a41086a200341306a41086a220a290300220b37030020032003290330220c370310200341d0006a41176a220d2004290000370000200341d0006a41106a220e2005290300370300200341d0006a41086a2205200b3703002003200c37035041022104024020010d002006200d2900003700002009200e290300370300200a200529030037030020032003290350370330200721040b02402002450d002008200241011089808080000b20010d02200020043a000020002003290330370001200041096a200341386a290300370000200041116a200341c0006a290300370000200041186a200341c7006a29000037000020034180016a2480808080000f0b4101108e80808000000b2005200441011089808080002001109980808000000b4102109980808000000b92080d067f017e017f017e017f017e017f017e017f017e017f027e077f23808080800041f0016b2203248080808000200341086a2001200210a38080800002400240024002402003280208450d0002400240200328020c22040d00410028028080c0800021050c010b20012002200410a6808080002205200410808080800010d480808000220141ff0171412a470d020b200341a0016a2005200410ba808080000240024020032d00a00122014101470d000c010b200341e8016a28020021062003200341ec016a28020022024100108d8080800020032802042107200328020022082006200210f2808080001a20034198016a200341e0016a29030037010020034190016a200341d8016a29030037010020034188016a200341d0016a29030037010020034180016a200341c8016a290300370100200341f8006a200341c0016a290300370100200341f0006a200341b8016a290300370100200341e8006a200341b0016a2903003701002003200341a8016a2903003701600b02402004450d002005200441011089808080000b4101210420014101460d02200341146a413e6a2201200341da006a413e6a2205290100370100200341146a41366a200341da006a41366a22062901002209370100200341146a412e6a200341da006a412e6a220a290100220b370100200341146a41266a200341da006a41266a220c290100220d370100200341146a411e6a200341da006a411e6a220e290100220f370100200341146a41166a200341da006a41166a22102901002211370100200341146a410e6a200341da006a410e6a2212290100221337010020032003290160221437011a200341d0016a22152009370300200341c8016a2216200b370300200341c0016a2217200d370300200341b8016a2218200f370300200341b0016a22192011370300200341a8016a221a2013370300200341d8016a221b2001290100370300200320143703a001024020020d002005201b29030037010020062015290300370100200a2016290300370100200c2017290300370100200e2018290300370100201020192903003701002012201a290300370100200320032903a001370160410021040b2007450d032008200741011089808080000c030b4101108e80808000000b2005200441011089808080002001109980808000000b410121040b200341a0016a200341da006a41c60010f2808080001a024020040d00200020032900a601370000200041386a200341de016a290000370000200041306a200341d6016a290000370000200041286a200341ce016a290000370000200041206a200341c6016a290000370000200041186a200341be016a290000370000200041106a200341b6016a290000370000200041086a200341ae016a290000370000200341f0016a2480808080000f0b4102109980808000000b11002000108f80808000108180808000000b9e0402047f017e23808080800041c0016b22002480808080002000418880c080004106109080808000200041206a418e80c080004106109180808000200041e0006a200010cd8080800020004180016a20002802602201200028026810a4808080002000280280012102024020002802642203450d002001200341011089808080000b024002402002410a470d00200041e0006a41186a200041186a290300370300200041e0006a41106a200041106a290300370300200041e0006a41086a200041086a2903003703002000200029030037036020004180016a41386a200041206a41386a29030037030020004180016a41306a200041206a41306a29030037030020004180016a41286a200041206a41286a29030037030020004180016a41206a200041206a41206a29030037030020004180016a41186a200041206a41186a29030037030020004180016a41106a200041206a41106a290 30037030020004180016a41086a2201200041206a41086a2903003703002000200029032037038001200041e0006a20004180016a4200200410a180808000220442ffff038350450d01200041e0006a200010cd808080002000280268210320002802602102200110948080800020004102360280012002200320004180016a10a580808000024020002802642201450d002002200141011089808080000b200041c0016a2480808080000f0b41a98004109280808000000b2004421088a7109980808000000b900803047f037e0c7f23808080800041b0016b2201248080808000412110a680808000210220014180016a200141e0006a10bb80808000024002400240024020012d0080014101460d00200141286a41086a220320014180016a410c6a2802003602002001200129028401370328200141386a10c080808000200141e0006a41086a200328020036020020012001290328370360200141386a41106a2203200141e0006a10d580808000200141086a41086a200141386a41086a22042903002205370300200141086a41106a20032903002206370300200141086a41186a200141386a41186a2802002203360200200120012903382207370284012001200737030820014180016a41186a200336020020014180016a41106a200637030020014180016a41086a20053703002001200737038001200141386a20014180016a10cb8080800020012d00384101460d01200428020021042002200128023c2208200141386a410c6a28020010828080800020014180016a2002412110c2808080004101210320012d0080014101460d02200141a8016a2802002109200141ac016a280200210a200141386a41086a220b2001418d016a290000370300200141386a41106a220c20014195016a290000370300200141386a41186a220d2001419d016a290000370300200120012900850137033820012d008401210e2001200a4100108d808080002001280204210f20012802002009200a10f2808080002110200141e0006a41186a2209200d290300370300200141e0006a41106a2211200c290300370300200141e0006a41086a2212200b2903003703002001200129033837036020024121410110898080800020014180016a41186a2202200929030037030020014180016a41106a2213201129030037030020014180016a41086a221120122903003703002001200129036037038001410221090240200a0d00200d2002290300370300200c2013290300370300200b20112903003703002001200129038001370338200e2109410021030b200f450d032010200f41011089808080000c030b20014180016a41047220012d00810110ca80808000200141d8006a200141a4016a280200360200200141d0006a2001419c016a290200370300200141c8006a20014194016a290200370300200141c0006a2001418c016a2902003703002001200129028401370338200141386a109880808000000b20012d0039109780808000000b20012d0081012109410121032002412141011089808080000b024020030d00200020093a000020002001290338370001200041096a200141c0006a290300370000200041116a200141c8006a290300370000200041196a200141d0006a29030037000002402004450d002008200441011089808080000b200141b0016a2480808080000f0b2009109780808000000b0a00200010d1808080000b850101017f23808080800041306b2201248080808000200141086a41206a200041206a280200360200200141086a41186a200041186a290200370300200141086a41106a200041106a290200370300200141086a41086a200041086a29020037030020012000290200370308200141086a10d2808080002100200141306a24808080800020000b11002000109580808000109280808000000b7d01017f23808080800041306b2201248080808000200141086a41206a200041206a280200360200200141086a41186a200041186a290200370300200141086a41106a200041106a290200370300200141086a41086a200041086a29020037030020012000290200370308200141086a109680808000109280808000000b0b002000109280808000000bb00101027f0240024002400240024002400240024002402002450d004101210420014100480d0120032802002205450d02200328020422030d042001450d030c050b20002001360204410121040b410021010c060b20010d020b200221030c020b2005200320022001108a8080800022030d010c020b200120021088808080002203450d010b20002003360204410021040c010b20002001360204200221010b20002004360200200041086a20013602000bcf0101027f23808080800041206b22032480808080000240200120026a22022001490d00200041046a280200220141017422042002200420024b1b22024108200241084b1b2102024002402001450d00200341106a41086a410136020020032001360214200320002802003602100c010b200341003602100b200320024101200341106a109a80808000024020032802004101470d00200341086a2802002200450d012003280204200010dc80808000000b20002003290204370200200341206a2480808080000f0b10de80808000000b0b00200010a280808000000b11002000109f8080800010a280808000000ba70503067f067e017f23808080800041b0016b220224808080800020012802042103200241f0006a20012802002204200128020810c780808000024002400240024020022d007022054101460d00024002400240200241ac016a28020022014100480d00200241a8016a280200210620010d01410121070c020b10de80808000000b200141011088808080002207450d030b20072006200110f2808080001a200241e8006a200241a0016a290300370100200241e0006a20024198016a290300370100200241d8006a20024190016a290300370100200241d0006a20024188016a290300370100200241c8006a20024180016a2903003701002002200241f8006a2903003701400c010b20022d007121060b02402003450d002004200341011089808080000b0240024020054101460d00200241046a412e6a2002413a6a412e6a2901002208370100200241046a41266a2002413a6a41266a2901002209370100200241046a411e6a2002413a6a411e6a290100220a370100200241046a41166a2002413a6a41166a290100220b370100200241046a410e6a2002413a6a410e6a290100220c37010020022002290140220d37010a200241f0006a41286a22032008370300200241f0006a41206a22052009370300200241f0006a41186a2204200a370300200241f0006a41106a2206200b370300200241f0006a41086a220e200c3703002002200d37037020010d01200041003a0000200041086a2002290370370300200041306a2003290300370300200041286a2005290300370300200041206a2004290300370300200041186a2006290300370300200041106a200e2903003703000c030b200041013a0000200020063a00010c020b20004181043b01002007200141011089808080000c010b2001410110dc80808000000b200241b0016a2480808080000b0a00200010d1808080000b9b0401057f23808080800041306b220324808080800020032002370308200320013703000240024002400240024020014201510d00410141011088808080002204450d02200441003a0000200041003a0000200041086a428180808010370200200041046a20043602000c010b200341086a220510bd8080800041016a22044100480d02024002402004450d00200441011088808080002206450d05410021072003410036021820032004360214200320063602100c010b200341003602182003200436021420034101360210200341106a41004101109b8080800020032802102106200328021821070b200620076a41013a00002003200328021841016a360218200341206a200510bc80808000024020032d00204101460d00200341206a41086a28020021062003280224210502402003280214200328021822076b200341206a410c6a28020022044f0d00200341106a20072004109b80808000200328021821070b200328021020076a2005200410f2808080001a200041003a0000200041046a2003290310370200200341106a41086a2207200728020020046a22043602002000410c6a20043602002006450d012005200641011089808080000c010b20032d00212104200041013a0000200020043a000120032802142200450d002003280210200041011089808080000b200341306a2480808080000f0b4101410110dc80808000000b10de80808000000b2004410110dc80808000000bb70401067f23808080800041d0006b2204248080808000024002400240412041011088808080002205450d0020052000290000370000200541186a200041186a290000370000200541106a200041106a290000370000200541086a200041086a290000370000200441106a41386a200141386a290300370300200441106a41306a200141306a290300370300200441106a41286a200141286a290300370300200441106a41206a200141206a290300370300200441106a41186a200141186a290300370300200441106a41106a200141106a290300370300200441106a41086a200141086a290300370300200420012903003703102004200441106a10b98080800020042d00004101460d012004410c6a280200210620042802042101200441086a2802002100200441106a2002200310a08080800020042d00104101460d02200441186a28020021070240024002402005412020012006200428021422082004411c6a280200200441106a10838080800010d480808000220941ff01712206412a460d002006412a470d010b200428021010cf80808000210202402007450d002008200741011089808080000b2000450d012001200041011089808080000c010b2009ad421086210202402007450d002008200741011089808080000b200242018421022000450d002001200041011089808080000b200541204101108980808000200441d0006a24808080800020020f0b4120410110dc80808000000b20042d0001109d80808000000b20042d0011109d80808000000b1100200010a780808000108180808000000b7e01037f23808080800041106b2203248080808000410021042003410036020c02400240200120022003410c6a10848080800010d480808000220541ff01712202412a470d0041012104200328020c21010c010b20024101460d00200510a280808000000b2000200136020420002004360200200341106a2480808080000bdd0401057f2380808080004180016b2203248080808000200341106a2001200210be80808000024002400240024020032d00104101460d002003411c6a280200210420032802142105200341186a280200210602400240024010c58080800022014100480d0020010d01410121020c020b10de80808000000b20014101108b808080002202450d020b2003410036020c0240024020052004200220012003410c6a10858080800010d480808000220741ff01712204412a470d00200328020c2104200320023602482003200136024c20032001200420012004491b360250200341106a200341c8006a109e80808000200341c8006a41086a2003411a6a290100370300200341c8006a41106a200341226a290100370300200341c8006a41186a2003412a6a290100370300200341c8006a41206a200341326a290100370300200341c8006a41286a200341106a412a6a290100370300200341f6006a2201200341c0006a2901003701002003200329011237034820032d00104101460d042000200329014e370100200041286a2001290100370100200041206a200341ee006a290100370100200041186a200341e6006a290100370100200041106a200341de006a290100370100200041086a200341d6006a2901003701002006450d012005200641011089808080000c010b20044117470d042000410a36020002402001450d002002200141011089808080000b2006450d002005200641011089808080000b20034180016a2480808080000f0b20032d0011109d80808000000b2001410110dc80808000000b20032d0011109d80808000000b200710a280808000000bbf0201037f23808080800041c0006b2203248080808000200341106a2000200110be808080000240024020032d00104101460d002003411c6a280200210420032802142100200341106a41086a22052802002101200341106a41286a200241286a290300370300200341106a41206a200241206a290300370300200341106a41186a200241186a290300370300200341106a41106a200241106a2903003703002005200241086a290300370300200320022903003703102003200341106a10c68080800020032d00004101460d01200341086a280200210220002004200328020422052003410c6a28020010868080800002402002450d002005200241011089808080000b02402001450d002000200141011089808080000b200341c0006a2480808080000f0b20032d0011109d80808000000b20032d0001109d80808000000b240002402000410110888080800022000d002000411074411372109c80808000000b20000b0a00200010d3808080000b040000000b040000000b120041b486c080002000200110b7808080000b140041b486c0800020002001200210b8808080000b4501017f024041b486c080002003200210b7808080002204450d002004200020032001200120034b1b10f2808080001a41b486c0800020002001200210b8808080000b20040b2900024041b486c080002000200110b7808080002201450d0020014100200010f3808080001a0b20010b02000b960201027f23808080800041106b220424808080800020042001280200220528020036020c024002400240200241026a220220026c220241801020024180104b1b220141042004410c6a419480c08000419480c0800010b6808080002202450d002005200428020c3602000c010b2004419480c080002001410410b380808000024002402004280200450d002005200428020c3602000c010b20042802042202200428020c3602082004200236020c200141042004410c6a419480c08000419480c0800010b68080800021022005200428020c36020020020d010b410121010c010b200242003702042002200220014102746a410272360200410021010b2000200236020420002001360200200441106a2480808080000b040020010b040041000b02000b7701017f02400240200241027422022003410374418080016a2203200220034b1b418780046a220441107640002203417f470d0041012102410021030c010b20034110742203420037030041002102200341003602082003200320044180807c716a4102723602000b20002003360204200020023602000b05004180040b040041010bea0401087f024020022802002205450d002001417f6a210620004102742107410020016b21080340200541086a2109024002402005280208220a4101710d00200521010c010b03402009200a417e71360200024002402005280204220a417c7122090d00410021010c010b4100200920092d00004101711b21010b02402005280200220b417c71220c450d004100200c200b4102711b220b450d00200b200b2802044103712009723602042005280204220a417c7121090b02402009450d00200920092802004103712005280200417c71723602002005280204210a0b2005200a41037136020420052005280200220941037136020002402009410271450d00200120012802004102723602000b20022001360200200141086a2109200121052001280208220a4101710d000b0b02402001280200417c71220520096b2007490d00024002402009200320002004280210118080808000004102746a41086a200520076b20087122054d0d0020062009710d0220022009280200417c7136020020012001280200410172360200200121050c010b20054100360200200541786a2205420037020020052001280200417c7136020002402001280200220a417c71220b450d004100200b200a4102711b220a450d00200a200a2802044103712005723602040b2005200528020441037120017236020420092009280200417e71360200200120012802002209410371200572220a3602000240024020094102710d00200528020021010c010b2001200a417d713602002005200528020041027222013602000b200520014101723602000b200541086a0f0b20022001280208220536020020050d000b0b41000ba30301037f23808080800041106b22032480808080000240024020010d00200221010c010b200141036a220441027621050240200241044b0d002005417f6a220141ff014b0d00200320003602082003200020014102746a41046a220028020036020c0240200520022003410c6a200341086a41c480c0800010b68080800022010d002003200341086a2005200210af808080004100210120032802000d0020032802042201200328020c3602082003200136020c200520022003410c6a200341086a41c480c0800010b68080800021010b2000200328020c3602000c010b2003200028020036020c0240200520022003410c6a41ac80c0800041ac80c0800010b68080800022010d0002402004417c7122012002410374418080016a2204200120044b1b418780046a220441107640002201417f470d00410021010c010b2001411074220142003703002001200120044180807c716a4102723602002001200328020c3602082003200136020c200520022003410c6a41ac80c0800041ac80c0800010b68080800021010b2000200328020c3602000b200341106a24808080800020010bee0501067f23808080800041106b220424808080800002402001450d002002450d000240200341044b0d00200241036a410276417f6a220341ff014b0d0020014100360200200141786a22022002280200417e713602002004200036020c200020034102746a41046a22032802002100024002402004410c6a10b180808000450d0002402001417c6a2205280200417c712206450d00200628020022074101710d0002400240024020022802002208417c7122010d00200621090c010b200621094100200120084102711b2208450d002008200828020441037120067236020420052802002201417c712209450d012002280200417c712101200928020021070b20092001200741037172360200200528020021010b20052001410371360200200220022802002201410371360200200021022001410271450d0220062006280200410272360200200320003602000c040b20022802002206417c712205450d004100200520064102711b2206450d0020062d00004101710d0020012006280208417c7136020020062002410172360208200320003602000c030b200120003602000b200320023602000c010b20014100360200200141786a220220022802002206417e7136020020002802002103024002402001417c6a2207280200417c712205450d00200528020022094101710d000240024002402006417c7122010d00200521080c010b200521084100200120064102711b2206450d002006200628020441037120057236020420072802002201417c712208450d012002280200417c712101200828020021090b20082001200941037172360200200728020021010b200720014103713602002002200228020022014103713602002001410271450d01200520052802004102723602000c010b02402006417c712205450d004100200520064102711b2206450d0020062d00004101710d0020012006280208417c71360200200620024101723602080c010b20012003360200200221030b200020033602000b200441106a2480808080000bc20401047f23808080800041e0006b22022480808080002002200129030037030020022001290308370308200220012903103703102002200129031837031820022001290320370320200220012903283703282002200129033037033020022001290338370338413f2101024002400240024003402001417f460d01200220016a21032001417f6a2204210120032d00002203450d000b410141011088808080002201450d01200120033a000020024281808080103702542002200136025002402004417f460d0041022101410121030340200220046a2d0000210502402001417f6a2003470d00200241d0006a2003410110c4808080000b200228025020016a417f6a20053a0000200220013602582004450d01200141016a21012004417f6a2104200228025421030c000b0b200241c0006a41086a200241d0006a41086a28020022013602002002200229035037034020012104200120022802442203470d030c020b2002420037024441002101200241002802b481c08000360240410021030c010b4101410110dc80808000000b200241c0006a2003410110c480808000200228024821040b200228024020046a20013a000020022002280248220441016a2201360248024020014101762203450d002002280240220120046a2104034020012d00002105200120042d00003a0000200420053a0000200141016a21012004417f6a21042003417f6a22030d000b0b200041003a0000200041046a20022903403702002000410c6a200241c8006a280200360200200241e0006a2480808080000ba90201047f23808080800041c0006b2203248080808000024002400240024002402002450d004101210420012d0000220541c0004b0d012002417f6a22062005490d02200141016a210141002104200320056a410041c00020056b10f3808080001a200041c0006a20032001200510f2808080002202290338370300200041386a2002290330370300200041306a2002290328370300200041286a2002290320370300200041206a2002290318370300200041186a2002290310370300200041106a2002290308370300200041086a2002290300370300200041cc006a200620056b360200200041c8006a200120056a3602000c040b200041003a00010c020b200041013a00010c020b200041003a00010b410121040b200020043a0000200341c0006a2480808080000b2400200041003a0000200041086a4200370200200041046a41002802dc80c080003602000b4e01017e2001290300210202404108410110888080800022010d004108410110dc80808000000b20012002370000200041003a0000200041086a42888080808001370200200041046a20013602000b040041080b980201047f23808080800041106b220324808080800002400240024002400240200241046a22040d002003410036020820032004360204200341013602000c010b200441011088808080002205450d02410021062003410036020820032004360204200320053602002002417c490d010b20034100410410c48080800020032802002105200328020821060b200520066a20023600002003200328020841046a22043602080240200328020420046b20024f0d0020032004200210c480808000200328020821040b200328020020046a2001200210f2808080001a200041003a0000200041046a20032903003702002000410c6a200341086a28020020026a3602000c010b20004181063b01000b200341106a2480808080000b9a1101037f200141046a2102200141086a21030240024002400240024002400340024002400240024002400240024002400240024002400240024002400240024002400240024020002802000e17000102030405060708090a0b0c0d0e0f10111214151617000b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41003a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41013a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41023a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41033a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41043a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41053a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41063a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41073a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41083a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41093a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a410a3a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a410b3a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a410c3a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41163a0000200141086a2200200028020041016a36020041040f0b0240200228020020032802002204470d0020012004410110c480808000200328020021040b200128020020046a410d3a00002003200328020041016a360200200041046a28020021000c040b200041046a21040240200228020020032802002200470d0020012000410110c480808000200328020021000b200128020020006a410e3a00002003200328020041016a360200200428020021000c030b0240200228020020032802002203470d0020012003410110c480808000200141086a28020021030b200128020020036a410f3a0000200141086a2203200328020041016a2203360200200028020421044104410110888080800022000d074104410110dc80808000000b0240200228020020032802002204470d0020012004410110c480808000200328020021040b200128020020046a41103a00002003200328020041016a3602002000280204200110bf8080800041ff017122044104470d07200041086a28020021000c010b0240200228020020032802002204470d0020012004410110c480808000200328020021040b200128020020046a41113a00002003200328020041016a3602002000280204200110bf8080800041ff017122044104470d06200041086a28020021000c000b0b0240200228020020032802002203470d0020012003410110c480808000200141086a28020021030b200128020020036a41123a0000200141086a2203200328020041016a360200200041046a2102410021000340024020004104470d0041040f0b200220006a2103200041046a21002003280200200110bf8080800041ff017122044104460d000c050b0b0240200228020020032802002203470d0020012003410110c480808000200141086a28020021030b200128020020036a41133a0000200141086a2203200328020041016a360200200041046a2102410021000340024020004108470d0041040f0b200220006a2103200041046a21002003280200200110bf8080800041ff017122044104460d000c040b0b0240200228020020032802002203470d0020012003410110c480808000200141086a28020021030b200128020020036a41143a0000200141086a2203200328020041016a360200410421030340024020034110470d0041040f0b200020036a2102200341046a21032002280200200110bf8080800041ff017122044104460d000c030b0b0240200228020020032802002200470d0020012000410110c480808000200141086a28020021000b200128020020006a41153a0000200141086a2200200028020041016a36020041040f0b200020043600000240200228020020036b41034b0d0020012003410410c480808000200141086a2802002103200028000021040b200128020020036a200436000041042104200141086a2203200328020041046a3602002000410441011089808080000b20040b0900200041093602000bac0101027f23808080800041106b220224808080800002404121410110888080800022030d004121410110dc80808000000b20032001290000370000200320012d00203a00202000410c6a4121360200200341086a200141086a290000370000200341106a200141106a290000370000200341186a200141186a2900003700002002412136020420022003360200200041046a2002290300370200200041003a0000200241106a2480808080000baf0101027f02400240024020024120490d004100210320024120460d014101210320012d0020220441074b0d01200041046a20012900003700002000412c6a2002415f6a360200200041286a200141216a360200200041246a20043a00002000411c6a200141186a290000370000200041146a200141106a2900003700002000410c6a200141086a290000370000200041003a00000f0b200041003a00010c010b200020033a00010b200041013a00000bb00101027f0240024002400240024002400240024002402002450d004101210420014100480d0120032802002205450d02200328020422030d042001450d030c050b20002001360204410121040b410021010c060b20010d020b200221030c020b2005200320022001108a8080800022030d010c020b200120021088808080002203450d010b20002003360204410021040c010b20002001360204200221010b20002004360200200041086a20013602000bcf0101027f23808080800041206b22032480808080000240200120026a22022001490d00200041046a280200220141017422042002200420024b1b22024108200241084b1b2102024002402001450d00200341106a41086a410136020020032001360214200320002802003602100c010b200341003602100b200320024101200341106a10c380808000024020032802004101470d00200341086a2802002200450d012003280204200010dc80808000000b20002003290204370200200341206a2480808080000f0b10de80808000000b040041220bdd1101087f23808080800041206b2202248080808000024002400240024002400240024002400240024002402001280200220341027441e480c080006a280200220441011088808080002205450d0020022004360204200220053602000240024002400240024002400240024002400240024020030e0a0a0908070005040302010a0b200541043a000041012106200241013602084120410110888080800022030d054120410110dc80808000000b200541093a00004101210620024101360208412041011088808080002203450d0a200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a2209200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a20092900003700002002200641206a3602082003412041011089808080000c120b200541083a00004101210620024101360208412041011088808080002203450d0a200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a200341086a2900003700002002200641206a3602082003412041011089808080000c110b200541073a00004101210620024101360208412041011088808080002203450d0a200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a2209200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a20092900003700002002200641206a3602082003412041011089808080000c100b200541063a00004101210620024101360208412041011088808080002203450d0a200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a2209200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a20092900003700002002200641206a3602082003412041011089808080000c0f0b200541053a00002005200141086a290300370001200241093602080c0e0b200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a2209200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a20092900003700002002200641206a3602082003412041011089808080000c0d0b200541033a00004101210620024101360208412041011088808080002203450d08200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a2209200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a20092900003700002002200641206a3602082003412041011089808080000c0c0b200541023a000020024101360208200241106a200141086a10c18080800020022d00104101460d0a200241106a41086a28020021052002280214210402402002280204200228020822036b2002411c6a28020022014f0d0020022003200110c480808000200228020821030b200228020020036a2004200110f2808080001a2002200228020820016a3602082005450d0b2004200541011089808080000c0b0b41012106200541013a000020024101360208412041011088808080002203450d07200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a2209200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a20092900003700002002200641206a3602082003412041011089808080000c0a0b200541003a00004101210620024101360208412041011088808080002203450d07200341186a2207200141206a290000370000200341106a2208200141186a290000370000200341086a2209200141106a2900003700002003200141086a29000037000002402004417f6a411f4b0d0020024101412010c48080800020022802002105200228020821060b200520066a22012003290000370000200141186a2007290000370000200141106a2008290000370000200141086a20092900003700002002200641206a3602082003412041011089808080000c090b2004410110dc80808000000b4120410110dc80808000000b4120410110dc80808000000b4120410110dc80808000000b4120410110dc80808000000b4120410110dc80808000000b4120410110dc80808000000b4120410110dc80808000000b20022d00112101200041013a0000200020013a000120022802042201450d012002280200200141011089808080000c010b200041003a0000200041046a20022903003702002000410c6a200241086a2802003602000b200241206a2480808080000b921101047f23808080800041306b210302400240024002400240024002400240024002400240024002402002450d002002417f6a2104200141016a210520012d00000e0a0102030405060708090b0a0b200041003a00010c0b0b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4100360200200041003a00000f0b200041003a00010c0a0b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4101360200200041003a00000f0b200041003a00010c090b41002106024020044121490d004101210620012d0021220441074b0d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003412c6a280200360200200041306a20043a00002000413c6a2002415e6a360200200041386a200141226a360200200041086a4102360200200041003a00000f0b200020063a00010c080b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4103360200200041003a00000f0b200041003a00010c070b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4104360200200041003a00000f0b200041003a00010c060b024020044108490d002000413c6a200241776a360200200041386a200141096a360200200041106a2001290001370300200041086a4105360200200041003a00000f0b200041003a00010c050b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4106360200200041003a00000f0b200041003a00010c040b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4107360200200041003a00000f0b200041003a00010c030b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4108360200200041003a00000f0b200041003a00010c020b200041013a0001200041013a00000f0b024020044120490d002003410c6a410c6a200541086a2900003702002003410c6a41146a200541106a2900003702002003410c6a411c6a200541186a290000370200200320052900003702102000410c6a200329020c370200200041146a2003410c6a41086a2902003702002000411c6a2003410c6a41106a290200370200200041246a2003410c6a41186a2902003702002000412c6a2003410c6a41206a2802003602002000413c6a2002415f6a360200200041386a200141216a360200200041086a4109360200200041003a00000f0b200041003a00010b200041013a00000b140020002802002000280204200110ef808080000b870301017f02400240024002400240024002400240200028020041726a0e080102000304050607000b0f0b200028020410c9808080002000280204411041041089808080000f0b200028020410c9808080002000280204411041041089808080000f0b200028020410c980808000200028020441104104108980808000200041086a220028020010c9808080002000280200411041041089808080000f0b200028020410c980808000200028020441104104108980808000200041086a220028020010c9808080002000280200411041041089808080000f0b200028020410c9808080002000280204411041041089808080000f0b200028020410c980808000200028020441104104108980808000200041086a220028020010c9808080002000280200411041041089808080000f0b200028020410c980808000200028020441104104108980808000200041086a220128020010c9808080002001280200411041041089808080002000410c6a220028020010c9808080002000280200411041041089808080000b1000200041003a0000200020013a00010bd40301077f23808080800041c0006b2202248080808000200141146a2802002103200128021021040240024002400240200141186a280200220541046a22060d0020024100360238200242013703300c010b41012107200641011088808080002208450d02410021072002410036023820022006360234200220083602302005417c490d010b200241306a4100410410c48080800020022802302108200228023821070b200820076a20053600002002200228023841046a22073602380240200228023420076b20054f0d00200241306a2007200510c480808000200228023821070b200228023020076a2004200510f2808080001a2002412c6a200241386a28020020056a36010020022002290330370124410021070b02402003450d002004200341011089808080000b02400240024020070d00200241106a22052002412c6a280100360200200220022901243703082001200241086a10bf8080800041ff017122034104470d01200041003a0000200041046a20022903083702002000410c6a20052802003602000c020b20004181063b01000c010b200041013a0000200020033a0001200228020c2205450d002002280208200541011089808080000b200110c980808000200241c0006a2480808080000b140020002802002000280208200110ef808080000bc20201057f23808080800041d0006b2202248080808000024041c00041011088808080002203450d0041002104200241c8006a41002900d481c08000370300200241002900cc81c080003703400340200320046a2205200241c0006a20012d000022064104766a2d00003a0000200541016a200241c0006a2006410f716a2d00003a0000200141016a2101200441026a220441c000470d000b2002412c6a4189808080003602002002411c6a4102360200200242c08080808008370234200220033602302002418a80808000360224200241ac81c080003602202002420237020c2002418c81c080003602082002200241306a3602282002200241206a3602182000200241086a10df80808000024020022802342201450d002002280230200141011089808080000b200241d0006a2480808080000f0b41c000410110dc80808000000b7900024020024120490d00200041046a2001290000370000200041286a200241606a360200200041246a200141206a3602002000411c6a200141186a290000370000200041146a200141106a2900003700002000410c6a200141086a290000370000200041003a00000f0b200041003a0001200041013a00000b2f01017e42808034210102400240024020000e020201000b428080344201840f0b428080b4801021010b20014200840b870301017f02400240024002400240024002400240200028020041726a0e080102000304050607000b0f0b200028020410d0808080002000280204411041041089808080000f0b200028020410d0808080002000280204411041041089808080000f0b200028020410d080808000200028020441104104108980808000200041086a220028020010d0808080002000280200411041041089808080000f0b200028020410d080808000200028020441104104108980808000200041086a220028020010d0808080002000280200411041041089808080000f0b200028020410d0808080002000280204411041041089808080000f0b200028020410d080808000200028020441104104108980808000200041086a220028020010d0808080002000280200411041041089808080000f0b200028020410d080808000200028020441104104108980808000200041086a220128020010d0808080002001280200411041041089808080002000410c6a220028020010d0808080002000280200411041041089808080000b0b00200041ff017141106a0b3d00024020002d00004101460d0020002d000141027341027441bc81c080006a2802000f0b200041046a10d080808000200041146a10d080808000410f0bea0201027f2000410876210141012102024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240200041ff01710e2a29000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728290b41020f0b41030f0b41040f0b41050f0b41060f0b41070f0b41080f0b41090f0b410a0f0b410b0f0b410c0f0b410d0f0b410e0f0b410f0f0b41100f0b41110f0b41120f0b41130f0b41140f0b41150f0b41160f0b41170f0b41180f0b41190f0b411a0f0b411b0f0b411c0f0b411d0f0b411e0f0b411f0f0b41200f0b41210f0b41220f0b41230f0b41240f0b41250f0b200141ff01714180f803720f0b200141ff01714180fa03720f0b200141ff01714180fc03720f0b200141ff01714180fe03720f0b2000411076418080047221020b20020bb00401047f41002101412a21024100210341002104024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024002400240024020000e262726000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20212223250b410121040c230b410221040c220b410321040c210b410421040c200b410521040c1f0b410621040c1e0b410721040c1d0b410821040c1c0b410921040c1b0b410a21040c1a0b410b21040c190b410c21040c180b410d21040c170b410e21040c160b410f21040c150b411021040c140b411121040c130b411221040c120b411321040c110b411421040c100b411521040c0f0b411621040c0e0b411721040c0d0b411821040c0c0b411921040c0b0b411a21040c0a0b411b21040c090b411c21040c080b411d21040c070b411e21040c060b411f21040c050b412021040c040b412121040c030b412221040c020b412321040c010b412421040b410021030c010b024002400240024020004180807c7141808004460d00200041807e7122024180fa03460d0220024180fc03460d0141282104410021032000210120024180fe03460d044125411e20024180f8034622021b2104410021032000410020021b21010c040b20004110742103412921040c030b412721040c010b412621040b41002103200021010b20014108744180fe03712003722100200421020b20022000720b1c0020002001290200370200200041086a200141086a2802003602000b02000b11002000280200200110d88080800041000bf70201037f23808080800041106b2202248080808000024002400240024002402001418001490d002002410036020c2001418010490d012001418080044f0d0220022001413f71418001723a000e20022001410c7641e001723a000c20022001410676413f71418001723a000d410321010c030b024020002802082203200041046a280200470d0020002003410110db80808000200028020821030b2000200341016a360208200028020020036a20013a00000c030b20022001413f71418001723a000d2002200141067641c001723a000c410221010c010b20022001413f71418001723a000f2002200141127641f001723a000c20022001410676413f71418001723a000e20022001410c76413f71418001723a000d410421010b0240200041046a280200200041086a220428020022036b20014f0d0020002003200110db80808000200428020021030b200028020020036a2002410c6a200110f2808080001a2004200320016a3602000b200241106a2480808080000b7401017f23808080800041206b220224808080800020022000280200360204200241086a41106a200141106a290200370300200241086a41086a200141086a29020037030020022001290200370308200241046a41dc81c08000200241086a10e8808080002101200241206a24808080800020010b5801027f02402000280200220341046a280200200341086a220428020022006b20024f0d0020032000200210db80808000200428020021000b200328020020006a2001200210f2808080001a2004200020026a36020041000bcf0101027f23808080800041206b22032480808080000240200120026a22022001490d00200041046a280200220141017422042002200420024b1b22024108200241084b1b2102024002402001450d00200341106a41086a410136020020032001360214200320002802003602100c010b200341003602100b200320024101200341106a10e080808000024020032802004101470d00200341086a2802002200450d012003280204200010dc80808000000b20002003290204370200200341206a2480808080000f0b10de80808000000b0d0020002001108c80808000000b0d002000200110a980808000000b170041d883c08000411141ec83c0800010e380808000000b8f0301067f23808080800041206b220224808080800020012802002103024002402001280204220441037422050d00410021060c010b200341046a2107410021060340200728020020066a2106200741086a2107200541786a22050d000b0b024002400240024002400240200141146a2802000d00200621050c010b2004450d02410021074101210402402006410f4b0d00200341046a280200450d020b200620066a22052006490d010b410021070240024020054100480d0020050d01410121040c020b10de80808000000b20052107200541011088808080002204450d030b20004100360208200020043602002000200736020420022000360204200241086a41106a200141106a290200370300200241086a41086a200141086a29020037030020022001290200370308200241046a41dc81c08000200241086a10e8808080000d01200241206a2480808080000f0b4100410041c082c0800010e480808000000b41e082c080004133200241086a41d082c0800041ac83c0800010ec80808000000b2005410110dc80808000000bbc0101027f024002400240024002400240024002402002450d00410021044101210520014100480d0720032802002204450d02200328020422030d0120010d030c050b2000200136020441012105410021040c060b2004200320022001108a8080800021030c020b2001450d020b2001200210888080800021030b200121040c010b41002104200221030b02402003450d0020002003360204410021050c010b20002001360204200221040b20002005360200200041086a20043602000b0d0020002802001a037f0c000b0b02000b5401017f23808080800041206b2203248080808000200341146a4100360200200341fc83c08000360210200342013702042003200136021c200320003602182003200341186a3602002003200210e780808000000b810101017f23808080800041306b220324808080800020032001360204200320003602002003411c6a41023602002003412c6a4190808080003602002003420237020c200341c084c0800036020820034190808080003602242003200341206a360218200320033602282003200341046a360220200341086a200210e780808000000bdd08010b7f200028021021030240024002400240200028020822044101460d0020034101460d012000280218200120022000411c6a28020028020c1181808080000021030c030b20034101470d010b200120026a2105024002400240200041146a28020022060d0041002107200121080c010b41002107200121090340200922032005460d02200341016a21080240024020032c00002209417f4c0d00200821090c010b200941ff0171210a0240024020082005470d004100210b200521090c010b200341026a210920032d0001413f71210b0b0240200a41e0014f0d00200921080c010b0240024020092005470d004100210c200521080c010b200941016a210820092d0000413f71210c0b0240200a41f0014f0d00200821090c010b0240024020082005470d004100210d200521090c010b20082d0000413f71210d200841016a220921080b200b410c74200a411274418080f0007172200c41067472200d72418080c400460d030b200720036b20096a21072006417f6a22060d000b0b20082005460d00024020082c00002203417f4a0d0002400240200841016a2005470d0041002108200521090c010b200841026a210920082d0001413f71410c7421080b200341ff017141e001490d000240024020092005470d0041002109200521060c010b200941016a210620092d0000413f7141067421090b200341ff017141f001490d00200341ff017121030240024020062005470d00410021050c010b20062d0000413f7121050b20082003411274418080f0007172200972200572418080c400460d010b02400240024020070d00410021090c010b024020072002490d00410021032002210920072002460d010c020b4100210320072109200120076a2c00004140480d010b20092107200121030b2007200220031b21022003200120031b21010b20044101460d002000280218200120022000411c6a28020028020c118180808000000f0b0240024002402002450d004100210920022108200121030340200920032d000041c00171418001476a2109200341016a21032008417f6a22080d000b2009200028020c22074f0d014100210920022108200121030340200920032d000041c00171418001476a2109200341016a21032008417f6a22080d000c030b0b41002109200028020c22070d010b2000280218200120022000411c6a28020028020c118180808000000f0b41002103200720096b22092105024002400240410020002d0020220820084103461b4103710e03020001020b41002105200921030c010b20094101762103200941016a41017621050b200341016a21032000411c6a28020021082000280204210920002802182107024003402003417f6a2203450d0120072009200828021011808080800000450d000b41010f0b410121032009418080c400460d00200720012002200828020c118180808000000d00410021030340024020052003470d0020052005490f0b200341016a210320072009200828021011808080800000450d000b2003417f6a2005490f0b20030b110020003502004101200110f0808080000b4201017f23808080800041106b22022480808080002002200136020c20022000360208200241fc83c08000360204200241fc83c08000360200200210a880808000000bc805010a7f23808080800041306b2203248080808000200341246a2001360200200341033a0028200342808080808004370308200320003602204100210020034100360218200341003602100240024002400240200228020822010d002002280200210420022802042205200241146a2802002201200120054b1b2206450d0120022802102107410021002006210103400240200420006a220841046a2802002209450d00200328022020082802002009200328022428020c118180808000000d040b200720006a2208280200200341086a200841046a280200118080808000000d03200041086a21002001417f6a22010d000b200621000c010b20022802002104200228020422052002410c6a2802002208200820054b1b220a450d002001411c6a2100200a210b2004210103400240200141046a2802002208450d00200328022020012802002008200328022428020c118180808000000d030b200320002d00003a00282003200041686a2902004220893703082000417c6a2802002108200228021021074100210641002109024002400240200041786a2802000e03010002010b2008410374210c410021092007200c6a220c280204419180808000470d01200c28020028020021080b410121090b200041646a210c2003200836021420032009360210200041746a2802002108024002400240200041706a2802000e03010002010b20084103742109200720096a2209280204419180808000470d01200928020028020021080b410121060b2003200836021c200320063602182007200c2802004103746a2208280200200341086a2008280204118080808000000d02200041206a2100200141086a2101200b417f6a220b0d000b200a21000b0240200520004d0d002003280220200420004103746a22002802002000280204200328022428020c118180808000000d010b410021000c010b410121000b200341306a24808080800020000b0c0042c0bda29dd583dac54a0b140020012000280200200028020410e5808080000b180020002802002001200028020428020c118080808000000b930101017f23808080800041c0006b22052480808080002005200136020c2005200036020820052003360214200520023602102005412c6a41023602002005413c6a4192808080003602002005420237021c200541d484c0800036021820054193808080003602342005200541306a3602282005200541106a3602382005200541086a360230200541186a200410e780808000000bf30601067f024002402001450d00412b418080c4002000280200220641017122011b2107200120056a21080c010b200541016a210820002802002106412d21070b0240024020064104710d00410021020c010b4100210902402003450d002003210a200221010340200920012d000041c00171418001476a2109200141016a2101200a417f6a220a0d000b0b200920086a21080b410121010240024020002802084101460d00200020072002200310ee808080000d012000280218200420052000411c6a28020028020c118180808000000f0b024002400240024002402000410c6a280200220920084d0d0020064108710d0441002101200920086b220a2106410120002d0020220920094103461b4103710e03030102030b200020072002200310ee808080000d042000280218200420052000411c6a28020028020c118180808000000f0b41002106200a21010c010b200a4101762101200a41016a41017621060b200141016a21012000411c6a280200210a2000280204210920002802182108024003402001417f6a2201450d0120082009200a28021011808080800000450d000b41010f0b410121012009418080c400460d01200020072002200310ee808080000d01200028021820042005200028021c28020c118180808000000d01200028021c210a200028021821004100210102400340024020062001470d00200621010c020b200141016a210120002009200a28021011808080800000450d000b2001417f6a21010b200120064921010c010b200028020421062000413036020420002d0020210b41012101200041013a0020200020072002200310ee808080000d0041002101200920086b220a2103024002400240410120002d0020220920094103461b4103710e03020001020b41002103200a21010c010b200a4101762101200a41016a41017621030b200141016a21012000411c6a280200210a2000280204210920002802182102024003402001417f6a2201450d0120022009200a28021011808080800000450d000b41010f0b410121012009418080c400460d00200028021820042005200028021c28020c118180808000000d00200028021c2101200028021821024100210a024003402003200a460d01200a41016a210a20022009200128021011808080800000450d000b41012101200a417f6a2003490d010b2000200b3a00202000200636020441000f0b20010b5c01017f0240024002402001418080c400460d0041012104200028021820012000411c6a280200280210118080808000000d010b20020d01410021040b20040f0b2000280218200220032000411c6a28020028020c118180808000000b0e0020022000200110e5808080000be90203027f017e037f23808080800041306b2203248080808000412721040240024020004290ce005a0d00200021050c010b412721040340200341096a20046a2206417c6a200020004290ce008022054290ce007e7da7220741ffff037141e4006e220841017441e484c080006a2f00003b00002006417e6a2007200841e4006c6b41ffff037141017441e484c080006a2f00003b00002004417c6a2104200042ffc1d72f5621062005210020060d000b0b02402005a7220641e3004c0d00200341096a2004417e6a22046a2005a72206200641ffff037141e4006e220641e4006c6b41ffff037141017441e484c080006a2f00003b00000b024002402006410a480d00200341096a2004417e6a22046a200641017441e484c080006a2f00003b00000c010b200341096a2004417f6a22046a200641306a3a00000b2002200141fc83c080004100200341096a20046a412720046b10ed808080002104200341306a24808080800020040b2100200128021841ac86c0800041052001411c6a28020028020c118180808000000b3601017f02402002450d00200021030340200320012d00003a0000200141016a2101200341016a21032002417f6a22020d000b0b20000b2c01017f02402002450d00200021030340200320013a0000200341016a21032002417f6a22020d000b0b20000b0bbb060100418080c0000bb1060100000000000000746172676574616d6f756e740100000000000000010000000200000003000000040000000500000000000000010000000200000003000000040000000500000004000000040000000600000007000000080000000100000000000000210000002100000022000000210000002100000009000000210000002100000021000000210000008c001000000000008c001000000000006163636f756e742d686173682d0000009c0010000d000000010000000000000012000000130000001000000011000000303132333435363738396162636465660b00000004000000040000000c0000000d0000000e0000002f72757374632f613835663538346165626439623038333134626633306239616463313762346137353231343365352f6c6962726172792f636f72652f7372632f666d742f6d6f642e727300f40010004b00000072010000130000000b00000000000000010000000f0000006120666f726d617474696e6720747261697420696d706c656d656e746174696f6e2072657475726e656420616e206572726f726c6962726172792f616c6c6f632f7372632f666d742e7273009301100018000000470200001c0000006c6962726172792f616c6c6f632f7372632f7261775f7665632e72736361706163697479206f766572666c6f77000000bc0110001c000000300200000500000014000000000000000100000015000000696e646578206f7574206f6620626f756e64733a20746865206c656e20697320206275742074686520696e6465782069732000000c021000200000002c021000120000003a200000fc01100000000000500210000200000030303031303230333034303530363037303830393130313131323133313431353136313731383139323032313232323332343235323632373238323933303331333233333334333533363337333833393430343134323433343434353436343734383439353035313532353335343535353635373538353936303631363236333634363536363637363836393730373137323733373437353736373737383739383038313832383338343835383638373838383939303931393239333934393539363937393839394572726f72',
          },
          approvals: [
            {
              signer:
                '018afa98ca4be12d613617f7339a2d576950a2f9a92102ca4d6508ee31b54d2c02',
              signature: mockPublicKey,
            },
          ],
        },
      };

      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Failure: {
              cost: '9995660',
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-b06a1ab0cfb52b5d4f9a08b68a5dbe78e999de0b0484c03e64f5c03897cf637b',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-b06a1ab0cfb52b5d4f9a08b68a5dbe78e999de0b0484c03e64f5c03897cf637b',
                    transform: {
                      WriteCLValue: {
                        bytes: '08a86b6569c8284f88',
                        parsed: '9822114153545165736',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddUInt512: '3000000000',
                    },
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-28c50be491d06ec51f9baad5f0ad3fe60bb11c184e1406de25b10f0c8a3f5ef3',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-28c50be491d06ec51f9baad5f0ad3fe60bb11c184e1406de25b10f0c8a3f5ef3',
                    transform: {
                      AddUInt512: '3000000000',
                    },
                  },
                ],
              },
              transfers: [],
              error_message: 'User error: 1',
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
        action: 'WASM deploy',
        amount: undefined,
        deployType: undefined,
        paymentAmount: '3000000000',
        cost: '9995660',
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

    it('should return a deploy of type claim', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        '3462f410a45eea748c1093de6256a396d395069066126e2c8bb6ee4de1ba37f0';
      const mockBlockHash =
        'fb41c98ec311fbab556d1bb59f281476135ec1b519f3126fee40c9169f7fe336';
      const mockPublicKey =
        '0202b2a13f20e71016aa8bbca5fbc1cca56af4092c926490e65dcfab2168ab051c92';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '0202b2a13f20e71016aa8bbca5fbc1cca56af4092c926490e65dcfab2168ab051c92',
          body_hash:
            '344e4ba198e3ebe44ce5edf48e0d564bb0f0b91812732ffddc3319cd3b683efb',
          gas_price: 1,
          timestamp: dateTimeString,
          chain_name: 'casper-test',
          dependencies: [],
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '05008d380c01',
                  parsed: '4500000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          StoredContractByHash: {
            args: [
              [
                'signature',
                {
                  bytes:
                    '8200000064386133373234363936336462306663643732343938346563633930393936643163636163653435366566383661613935653261333530636531396662623165353533313732383963326661303165643535633262353031373034666131353763343439343137386530656461313134333663386464393965346437383538333162',
                  parsed:
                    'd8a37246963db0fcd724984ecc90996d1ccace456ef86aa95e2a350ce19fbb1e55317289c2fa01ed55c2b501704fa157c4494178e0eda11436c8dd99e4d785831b',
                  cl_type: 'String',
                },
              ],
              [
                'token_id',
                {
                  bytes: '0b00000000000000',
                  parsed: 11,
                  cl_type: 'U64',
                },
              ],
            ],
            hash: '1d2f5eed581e3750fa3d2fd15ef782aa66a55a679346c0a339c485c78fc9fe68',
            entry_point: 'claim',
          },
          approvals: [
            {
              signer:
                '0202b2a13f20e71016aa8bbca5fbc1cca56af4092c926490e65dcfab2168ab051c92',
              signature: mockPublicKey,
            },
          ],
        },
      };

      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Failure: {
              cost: '3773563480',
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-1daccd82932cae4b20cc40d432b5201374aa44f572c4f25b23a119ba42fd9d40',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-1daccd82932cae4b20cc40d432b5201374aa44f572c4f25b23a119ba42fd9d40',
                    transform: {
                      WriteCLValue: {
                        bytes: '0500542379e1',
                        parsed: '968400000000',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddUInt512: '4500000000',
                    },
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-62f7fe1cecb1a4c600ffa791479ce52fb8cbda408815f4dd1b1e0d82e704579a',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-62f7fe1cecb1a4c600ffa791479ce52fb8cbda408815f4dd1b1e0d82e704579a',
                    transform: {
                      AddUInt512: '4500000000',
                    },
                  },
                ],
              },
              transfers: [],
              error_message: 'User error: 5',
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
        action: 'claim',
        amount: undefined,
        deployType: 'StoredContractByHash',
        paymentAmount: '4500000000',
        cost: '3773563480',
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

    it('should return a deploy of type add_to_account_whitelist', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        'a6db3fbbbefb3d5e0ce0cc19c0e2405907dba819f566f0e9782e54f20a91f78b';
      const mockBlockHash =
        '45e6e5fbc905b47a54374bc566764384a3305947c8009b331bc6aea5a5fa3730';
      const mockPublicKey =
        '01ad8be701328b146b525ef81731de43ef898bc1e957babc44c1c1029f2c15506b';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '01ad8be701328b146b525ef81731de43ef898bc1e957babc44c1c1029f2c15506b',
          body_hash:
            '9c47b67e923f2e758da5a65e1b46fff8b72b1b383cabbe8056743e9b775bd9cc',
          gas_price: 1,
          timestamp: dateTimeString,
          chain_name: 'casper-test',
          dependencies: [],
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '04804a5d05',
                  parsed: '90000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          StoredContractByHash: {
            args: [
              [
                'account_whitelist',
                {
                  bytes:
                    '00cd108b67ad506ef767d2ddd0da063e29f3e5167a1693b4ad9899ae74c440b3c8',
                  parsed: {
                    Account:
                      'account-hash-cd108b67ad506ef767d2ddd0da063e29f3e5167a1693b4ad9899ae74c440b3c8',
                  },
                  cl_type: 'Key',
                },
              ],
            ],
            hash: 'dae190a32c92bc6aefb70931f3c50f2af165f04646036f5ce10d19ac04438870',
            entry_point: 'add_to_account_whitelist',
          },
          approvals: [
            {
              signer:
                '01ad8be701328b146b525ef81731de43ef898bc1e957babc44c1c1029f2c15506b',
              signature: mockPublicKey,
            },
          ],
        },
      };

      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Failure: {
              cost: '90000000',
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-83d4446204402d482ddd057ad3aac45047d22b42202d3ac6aedafc8f42e9b328',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-83d4446204402d482ddd057ad3aac45047d22b42202d3ac6aedafc8f42e9b328',
                    transform: {
                      WriteCLValue: {
                        bytes: '0500c140719b',
                        parsed: '667620000000',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddUInt512: '90000000',
                    },
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-bb9f47c30ddbe192438fad10b7db8200247529d6592af7159d92c5f3aa7716a1',
                    transform: {
                      AddUInt512: '90000000',
                    },
                  },
                ],
              },
              transfers: [],
              error_message: 'Out of gas error',
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
        action: 'add_to_account_whitelist',
        amount: undefined,
        deployType: 'StoredContractByHash',
        paymentAmount: '90000000',
        cost: '90000000',
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

    it('should return a deploy of type approve_deploy', async () => {
      const dateTime = new Date();
      const dateTimeString = dateTime.toString();

      const mockDeployHash =
        'a1a9ad69d169d299e7a1cd30765413b35cd40d8f1a58d674e46c3125c01f36a3';
      const mockBlockHash =
        '099dc8be4e8d372b09c3a8236c4cbcac9c6a4ca5b9068fd666135c69e6f7cdfa';
      const mockPublicKey =
        '019dae8e2ef08104aa7746c5458692287289b63c495e1d4659686fb80c259e4d51';

      const mockRawDeploy = {
        hash: mockDeployHash,
        header: {
          ttl: '30m',
          account:
            '019dae8e2ef08104aa7746c5458692287289b63c495e1d4659686fb80c259e4d51',
          body_hash:
            '404dfdc42a5e8706c1d541fa95c308a5c9b8a683cc8da5bf25f44c46a71c4f6b',
          gas_price: 1,
          timestamp: dateTimeString,
          chain_name: 'casper-test',
          dependencies: [],
        },
        payment: {
          ModuleBytes: {
            args: [
              [
                'amount',
                {
                  bytes: '0400943577',
                  parsed: '2000000000',
                  cl_type: 'U512',
                },
              ],
            ],
            module_bytes: '',
          },
        },
        session: {
          StoredContractByHash: {
            args: [
              [
                'event_id',
                {
                  bytes: '0100000030',
                  parsed: '0',
                  cl_type: 'String',
                },
              ],
            ],
            hash: '9b09374894bb8cc68b7ec220d0a80dff625c7a99fe20133a586bc2f02923646d',
            entry_point: 'approve_deploy',
          },
          approvals: [
            {
              signer:
                '9b09374894bb8cc68b7ec220d0a80dff625c7a99fe20133a586bc2f02923646d',
              signature: mockPublicKey,
            },
          ],
        },
      };

      const mockRawExecutionResults = [
        {
          block_hash: mockBlockHash,
          result: {
            Success: {
              cost: '526096230',
              effect: {
                operations: [],
                transforms: [
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-53e5d4ed109f9b5a70b501fd4026a73ae4a39c2217dbcdbfdae43f98c90b8154',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-53e5d4ed109f9b5a70b501fd4026a73ae4a39c2217dbcdbfdae43f98c90b8154',
                    transform: {
                      WriteCLValue: {
                        bytes: '065f23130d640d',
                        parsed: '14723367248735',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      AddInt512: '2000000000',
                    },
                  },
                  {
                    key: 'hash-9b09374894bb8cc68b7ec220d0a80dff625c7a99fe20133a586bc2f02923646d',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9c03207644daaf2dba84d0f16a8f4e508cd49b8181c8b920b873e2fa9548f5b2',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-91897c23b87809e9002123ab398c9f913d766b4af30352d139775177893ab284',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-1c54c84521135e9e58c744a936fd7f978a685383c9ecdc0be0f9cd92943ec888',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-e51510a9747781035a4ecda8ec4beb391e0a8d27ccfc4ebe88b62710451945cf',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-6f7f882cd72600135093ff6e08a17389ff943d18fc4099be0aa309b0dc5f267b',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-2072ff819b69edcdb723342bfae77e2d18992b1a65cc76dc9cdf802f68a0c09e',
                    transform: {
                      WriteCLValue: {
                        bytes:
                          '01000000010d09200000005b5a26a7d8ac4fb95cbfa287d2955ca22a67fd5cf9594da21ead031c777635dd4000000036323131326538663636303436343832613966633537306664623131643363306566346630366331393764313034393739613735346164303935306238306435',
                        parsed: null,
                        cl_type: 'Any',
                      },
                    },
                  },
                  {
                    key: 'dictionary-f2032379fc0d0fb2d9a8eca6c4cf1ae3d5ad8f98e8bd7514650d9d294b4fdd05',
                    transform: 'Identity',
                  },
                  {
                    key: 'dictionary-b8997e804afbdc845380b4d2e75a061f8e9f5e30ad21abce9ac49e1e1319c967',
                    transform: {
                      WriteCLValue: {
                        bytes:
                          'e00100000100c0a8e051e2ade1bf58a78e73e5982d2526f787dfb26d4331cfac11ae3919f6e962112e8f66046482a9fc570fdb11d3c0ef4f06c197d104979a754ad0950b80d59a0100007b2274223a226465706c6f79222c2265223a7b226e616d65223a224a756c696f2773205370697269747332222c2273796d626f6c223a224a554c494f575332222c226d657461223a7b226d6178223a223131222c226e616d65223a225468652056616e697368696e67205370697269747332222c226f70656e223a2266616c7365222c2272656c65617365223a22323032322d30332d3231222c227369676e6174757265223a223461306537663564643535376538613537383337303338386335313235656361636338643563616162666366313065383038366331376332623964626633613965313862383234616663666263323837636434663461373136316666653266393361383963613335383864356530633063623137663334663861306134383037222c22736c7567223a227468655f76616e697368696e675f7370697269747332222c2274797065223a226361736b32222c225f223a225f227d2c2261646d696e223a222121554e4b4e4f574e2d545950452121222c225f223a225f227d2c227473223a2231363638353138393033383038227d0d140b0f200000000a20000000a249598879a0285187b3bbad43b07d8e4e60b1ac29668de2fb7c2adc9b9292390100000037',
                        parsed: null,
                        cl_type: 'Any',
                      },
                    },
                  },
                  {
                    key: 'dictionary-f2032379fc0d0fb2d9a8eca6c4cf1ae3d5ad8f98e8bd7514650d9d294b4fdd05',
                    transform: {
                      WriteCLValue: {
                        bytes:
                          '030000000101080d0720000000a249598879a0285187b3bbad43b07d8e4e60b1ac29668de2f b7c2adc9b9292390b0000006576656e745f 636f756e74',
                        'parse d': null,
                        cl_type: 'Any',
                      },
                    },
                  },
                  {
                    key: 'deploy-a1a9ad69d169d299e7a1cd30765413b35cd40d8f1a58d674e46c3125c01f36a3',
                    transform: {
                      WriteDeployInfo: {
                        gas: '526096230',
                        from: 'account-hash-c0a8e051e2ade1bf58a78e73e5982d2526f787dfb26d4331cfac11ae3919f6e9',
                        source:
                          'uref-53e5d4ed109f9b5a70b501fd4026a73ae4a39c2217dbcdbfdae43f98c90b8154-007',
                        transfers: [],
                        deploy_hash:
                          'a1a9ad69d169d299e7a1cd30765413b35cd40d8f1a58d674e46c3125c01f36a3',
                      },
                    },
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-624dbe2395b9d9503fbee82162f1714ebff6b639f96d2084d26d944c354ec4c5',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7',
                    transform: 'Identity',
                  },
                  {
                    key: 'hash-9824d60dc3a5c44a20b9fd260a412437933835b52fc683d8ae36e4ec2114843e',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-917253870c7bafa7a8985add41dcee118ef2ff268581771e47e57704bc465c7d',
                    transform: 'Identity',
                  },
                  {
                    key: 'balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6',
                    transform: {
                      WriteCLValue: {
                        bytes: '00',
                        parsed: '0',
                        cl_type: 'U512',
                      },
                    },
                  },
                  {
                    key: 'balance-917253870c7bafa7a8985add41dcee118ef2ff268581771e47e57704bc465c7d',
                    transform: {
                      AddInt512: '2000000000',
                    },
                  },
                ],
              },
              transfers: [],
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
        action: 'approve_deploy',
        amount: undefined,
        deployType: 'StoredContractByHash',
        paymentAmount: '2000000000',
        cost: '526096230',
        status: DeployStatus.Success,
        rawDeploy: JSON.stringify({
          deploy: mockRawDeploy,
          execution_results: mockRawExecutionResults,
        }),
      };
      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledTimes(1);
      expect(mockJsonRpc.getDeployInfo).toHaveBeenCalledWith(mockDeployHash);
      expect(deploy).toEqual(mockDeploy);
    });
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

    it('should throw an BalanceFetchFailed ApiEr  ror if an Error is caught', async () => {
      const mockUref =
        'uref-62f7fe1cecb1a4c600ffa791479ce52fb8 cbd a408815f4dd1b1e0d82e704579a-007';
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
        // we ha v  e t o  use the returned timeSince as mocking it   w ill i n  e vi tably be unreliable
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
      const version = '1.3.2';
      const build = 'e2027dbe9';
      const chainspecName = 'integration-test';

      const mockJsonRpc = {
        getStatus: jest.fn().mockResolvedValue({
          build_version: `${version}-${build}`,
          chainspec_name: chainspecName,
        }),
      };

      const mockRpcClient = new RpcApi(mockJsonRpc as any);

      const currentStatus = await mockRpcClient.getStatus();

      expect(mockJsonRpc.getStatus).toHaveBeenCalledTimes(1);
      expect(currentStatus.version).toBe(version);
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
