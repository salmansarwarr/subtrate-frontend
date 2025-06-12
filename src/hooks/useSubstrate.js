"use client"

import { useState, useEffect } from 'react';
import { connectToSubstrate } from '../lib/substrate';

export const useSubstrate = () => {
  const [api, setApi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    const connect = async () => {
      try {
        const substrateApi = await connectToSubstrate();
        setApi(substrateApi);
        setIsConnected(true);
      } catch (error) {
        console.error('Connection failed:', error);
        setIsConnected(false);
      }
    };

    connect();
  }, []);

  return { api, isConnected };
};