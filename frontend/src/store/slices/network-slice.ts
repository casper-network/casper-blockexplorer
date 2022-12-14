import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { casperApi, NetworkStatus } from '../../api';
import { Loading } from '../loading.type';

export interface NetworkState {
  status: Loading;
  api?: string;
  build?: string;
  networkName?: string;
}

const initialState: NetworkState = {
  status: Loading.Idle,
  api: undefined,
  build: undefined,
  networkName: undefined,
};

export const fetchStatus = createAsyncThunk(
  'rpcClient/fetchStatus',
  async () => {
    try {
      const status = await casperApi.getStatus();
      return status;
    } catch (error: any) {
      throw new Error('An error occurred while fetching status.');
    }
  },
);

export const networkSlice = createSlice({
  name: 'networkStatus',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStatus.pending, state => {
        state.status = Loading.Pending;
      })
      .addCase(
        fetchStatus.fulfilled,
        (state, { payload }: PayloadAction<NetworkStatus>) => {
          state.status = Loading.Complete;
          state.api = payload.api;
          state.build = payload.build;
          state.networkName = payload.networkName;
        },
      )
      .addCase(fetchStatus.rejected, state => {
        state.status = Loading.Failed;
      });
  },
});
