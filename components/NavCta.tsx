'use client';

import { useWallet } from '@/hooks/useWallet';
import Link from 'next/link';

export default function NavCta({ size = 'btn-sm' }: { size?: string }) {
  const { address, isLoading, connect } = useWallet();

  if (isLoading) return null;

  if (address) {
    return (
      <Link href="/dashboard" className={`btn-primary ${size}`}>
        Open Dashboard
      </Link>
    );
  }

  return (
    <button className={`btn-primary ${size}`} onClick={() => connect()}>
      Get Started Free
    </button>
  );
}
