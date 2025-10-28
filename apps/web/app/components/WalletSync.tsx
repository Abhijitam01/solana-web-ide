'use client';

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useApp } from '../context/AppContext';

/**
 * WalletSync Component
 * 
 * Syncs Solana wallet state with AppContext
 * Place this inside WalletProvider components
 */
export default function WalletSync() {
  const { publicKey, connecting } = useWallet();
  const { wallet } = useApp();

  useEffect(() => {
    wallet.setWalletState({ publicKey, connecting });
  }, [publicKey, connecting, wallet]);

  return null;
}

