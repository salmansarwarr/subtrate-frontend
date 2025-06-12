"use client"

import { ApiPromise, WsProvider } from '@polkadot/api';

let api = null;

export const connectToSubstrate = async () => {
  if (!api) {
    const wsProvider = new WsProvider('ws://localhost:9944'); 
    api = await ApiPromise.create({ provider: wsProvider });
  }
  return api;
};

export const getApi = () => api;