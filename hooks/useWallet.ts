'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { IS_TESTNET } from '@/lib/config';

// Lazy-init Stacks session — only runs in the browser, never on the server
type StacksSession = import('@stacks/connect').UserSession;

let _session: StacksSession | null = null;

function getSession(): StacksSession {
  if (!_session) {
    // Dynamic require so this module evaluates fine on the server
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AppConfig, UserSession } = require('@stacks/connect');
    _session = new UserSession({ appConfig: new AppConfig(['store_write', 'publish_data']) });
  }
  return _session!;
}

export function getAddressFromSession(): string | null {
  if (typeof window === 'undefined') return null;
  const session = getSession();
  if (!session.isUserSignedIn()) return null;
  try {
    const d = session.loadUserData();
    return IS_TESTNET ? d.profile.stxAddress.testnet : d.profile.stxAddress.mainnet;
  } catch { return null; }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const session = getSession();
    if (session.isSignInPending()) {
      session.handlePendingSignIn().then(() => {
        if (mounted.current) { setAddress(getAddressFromSession()); setIsLoading(false); }
      });
    } else {
      setAddress(getAddressFromSession());
      setIsLoading(false);
    }
    return () => { mounted.current = false; };
  }, []);

  const connect = useCallback((pendingPlan?: string) => {
    const { showConnect } = require('@stacks/connect');
    if (pendingPlan) localStorage.setItem('pending-plan', pendingPlan);
    showConnect({
      appDetails: { name: 'VeritasBTC', icon: window.location.origin + '/favicon.svg' },
      redirectTo: '/dashboard',
      onFinish: () => {
        setAddress(getAddressFromSession());
        window.location.href = '/dashboard';
      },
      userSession: getSession(),
    });
  }, []);

  const disconnect = useCallback(() => {
    getSession().signUserOut('/');
  }, []);

  return { address, isLoading, connect, disconnect };
}
