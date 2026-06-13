'use client';

import './dashboard.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { usePlan } from '@/hooks/usePlan';
import { PLANS, canAnchor } from '@/lib/plan';
import { explorerTxUrl, explorerBlockUrl, explorerAddressUrl } from '@/lib/config';
import {
  getAnchor,
  getIdentity,
  callAnchorContent,
  callRegisterIdentity,
  callAddToTrustCircle,
  callRemoveFromTrustCircle,
  pollTx,
  sha256,
  buf2hex,
  getHistory,
  saveHistory,
  getCircles,
  saveCircles,
  type AnchorRecord,
} from '@/lib/stacks';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TxStepState {
  step1: 'active' | 'done' | 'pending';
  step2: 'active' | 'done' | 'pending';
  step3: 'active' | 'done' | 'pending';
}

interface VerifyResult {
  found: boolean;
  owner?: string;
  block?: string | number;
  contentType?: string;
}

interface MemberCheckResult {
  found: boolean;
  name?: string;
  inCircle?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fileTypeIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic'].includes(ext)) return '📸';
  if (['pdf', 'doc', 'docx', 'txt', 'odt'].includes(ext)) return '📄';
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext)) return '🎙️';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return '🎥';
  return '📦';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const CTYPE_ICONS: Record<string, string> = {
  photo: '📸', document: '📄', voice: '🎙️', video: '🎥', other: '📦',
};
const CIRCLE_COLORS = ['#F7931A', '#A855F7', '#3B82F6', '#10D48E', '#EAB308'];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { address, disconnect, isLoading } = useWallet();
  const { plan, daysLeft, expired, applyPlan } = usePlan();

  // Identity
  const [identityData, setIdentityData] = useState<any>(null);
  const [identityLoaded, setIdentityLoaded] = useState(false);
  const [identityName, setIdentityName] = useState('');
  const [anchorCount, setAnchorCount] = useState(0);

  // Anchor tab
  const [currentHashBuffer, setCurrentHashBuffer] = useState<ArrayBuffer | null>(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentContentType, setCurrentContentType] = useState('photo');
  const [anchorFileLabel, setAnchorFileLabel] = useState<{ name: string; size: string; icon: string } | null>(null);
  const [anchorHash, setAnchorHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const anchorDragOver = useRef(false);
  const [anchorDrag, setAnchorDrag] = useState(false);

  // Verify tab
  const [verifyHashBuffer, setVerifyHashBuffer] = useState<ArrayBuffer | null>(null);
  const [verifyFileLabel, setVerifyFileLabel] = useState<{ name: string; size: string; icon: string } | null>(null);
  const [verifyHash, setVerifyHash] = useState('');
  const [isVerifyHashing, setIsVerifyHashing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [verifyDrag, setVerifyDrag] = useState(false);

  // Trust circles
  const [circles, setCircles] = useState<string[]>([]);
  const [circleInput, setCircleInput] = useState('');
  const [checkMemberInput, setCheckMemberInput] = useState('');
  const [memberCheckResult, setMemberCheckResult] = useState<MemberCheckResult | null>(null);
  const [isCheckingMember, setIsCheckingMember] = useState(false);
  const [isAddingToCircle, setIsAddingToCircle] = useState(false);

  // History
  const [history, setHistory] = useState<AnchorRecord[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState<'anchor' | 'verify' | 'circles' | 'history'>('anchor');

  // Modals
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txModalTitle, setTxModalTitle] = useState('');
  const [txModalSub, setTxModalSub] = useState('');
  const [txStep, setTxStepState] = useState<TxStepState>({ step1: 'active', step2: 'pending', step3: 'pending' });
  const [txExplorerLink, setTxExplorerLink] = useState('');
  const [pendingCertData, setPendingCertData] = useState<AnchorRecord | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certQrUrl, setCertQrUrl] = useState('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ msg: '', type: '', show: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // File inputs
  const anchorFileInput = useRef<HTMLInputElement>(null);
  const verifyFileInput = useRef<HTMLInputElement>(null);

  // ── Init ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoading && !address) {
      window.location.href = '/';
    }
  }, [address, isLoading]);

  useEffect(() => {
    if (!address) return;
    const hist = getHistory();
    setHistory(hist);
    setAnchorCount(hist.length);
    setCircles(getCircles());
    loadIdentity();
  }, [address]);

  async function loadIdentity() {
    if (!address) return;
    try {
      const result = await getIdentity(address);
      if (result.found) {
        setIdentityData(result);
      } else {
        setIdentityData(null);
      }
    } catch {
      setIdentityData(null);
    } finally {
      setIdentityLoaded(true);
    }
  }

  // ── Toast ───────────────────────────────────────────────────────────────────

  function showToast(msg: string, type: string = '') {
    setToast({ msg, type, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }

  // ── TX Modal ─────────────────────────────────────────────────────────────────

  function openTxModal(title: string, txId?: string) {
    setTxModalTitle(title);
    setTxModalSub('Waiting for confirmation on Stacks/Bitcoin...');
    setTxStepState({ step1: 'active', step2: 'pending', step3: 'pending' });
    if (txId) setTxExplorerLink(explorerTxUrl(txId));
    setTxModalOpen(true);
  }

  function closeTxModal() {
    setTxModalOpen(false);
  }

  async function runPollTx(txId: string): Promise<{ ok: boolean; blockHeight?: number }> {
    setTxStepState({ step1: 'done', step2: 'active', step3: 'pending' });

    const result = await pollTx(txId);

    if (result.success) {
      setTxStepState({ step1: 'done', step2: 'done', step3: 'active' });
      setTxModalSub(`Confirmed on Bitcoin Block #${result.blockHeight}`);
      await new Promise(r => setTimeout(r, 600));
      setTxStepState({ step1: 'done', step2: 'done', step3: 'done' });
      return { ok: true, blockHeight: result.blockHeight };
    }
    return { ok: false };
  }

  // ── Identity ─────────────────────────────────────────────────────────────────

  function handleRegisterIdentity() {
    if (!identityName.trim()) { showToast('Please enter your name', 'error'); return; }
    callRegisterIdentity(identityName.trim(), {
      onFinish: async (data) => {
        const { txId } = data as { txId: string };
        openTxModal('Registering Identity...', txId);
        const { ok } = await runPollTx(txId);
        closeTxModal();
        if (ok) {
          showToast('Identity registered on Bitcoin! ✅', 'success');
          await loadIdentity();
        } else {
          showToast('Transaction failed — please try again', 'error');
        }
      },
      onCancel: () => showToast('Registration cancelled', ''),
    });
  }

  // ── Anchor Section ────────────────────────────────────────────────────────────

  async function handleAnchorFile(file: File) {
    setAnchorHash('');
    setCurrentHashBuffer(null);
    setAnchorFileLabel({ name: file.name, size: formatBytes(file.size), icon: fileTypeIcon(file.name) });
    setIsHashing(true);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuf = await sha256(buffer);
      setCurrentHashBuffer(hashBuf);
      setCurrentFileName(file.name.slice(0, 50));
      setAnchorHash(buf2hex(hashBuf));
    } catch {
      showToast('Error computing fingerprint', 'error');
    } finally {
      setIsHashing(false);
    }
  }

  async function handleAnchorSubmit() {
    if (!identityData) { showToast('Register your identity first', 'error'); return; }
    if (!currentHashBuffer) return;

    if (!canAnchor(history.length)) {
      setUpgradeModalOpen(true);
      return;
    }

    // Check if this exact fingerprint is already anchored on-chain
    setIsAnchoring(true);
    const existing = await getAnchor(currentHashBuffer);
    console.log('[VeritasBTC] pre-anchor check:', JSON.stringify(existing));
    if (existing.found) {
      setIsAnchoring(false);
      showToast('This file is already anchored on Bitcoin — duplicate fingerprint rejected by the contract', 'error');
      return;
    }

    callAnchorContent(currentHashBuffer, currentContentType, currentFileName || 'untitled', {
      onFinish: async (data) => {
        const { txId } = data as { txId: string };
        openTxModal('Anchoring to Bitcoin...', txId);
        const { ok, blockHeight: confirmedBlock } = await runPollTx(txId);
        closeTxModal();
        setIsAnchoring(false);

        if (ok) {
          const certData: AnchorRecord = {
            hash: buf2hex(currentHashBuffer!),
            txId,
            contentType: currentContentType,
            owner: address!,
            blockHeight: confirmedBlock ?? 'Pending',
            fileName: anchorFileLabel?.name || 'file',
            date: new Date().toLocaleDateString(),
          };
          setPendingCertData(certData);
          await generateQr(`${window.location.origin}/verify?hash=${certData.hash}`);
          setCertModalOpen(true);
        } else {
          showToast('Transaction failed — please try again', 'error');
        }
      },
      onCancel: () => { setIsAnchoring(false); showToast('Anchor cancelled', ''); },
    });
  }

  // ── Verify Section ────────────────────────────────────────────────────────────

  async function handleVerifyFile(file: File) {
    setVerifyHash('');
    setVerifyHashBuffer(null);
    setVerifyResult(null);
    setVerifyFileLabel({ name: file.name, size: formatBytes(file.size), icon: fileTypeIcon(file.name) });
    setIsVerifyHashing(true);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuf = await sha256(buffer);
      setVerifyHashBuffer(hashBuf);
      setVerifyHash(buf2hex(hashBuf));
    } catch {
      showToast('Error computing fingerprint', 'error');
    } finally {
      setIsVerifyHashing(false);
    }
  }

  async function handleVerifySubmit() {
    if (!verifyHashBuffer) return;
    setIsVerifying(true);
    setVerifyResult(null);

    try {
      const hash = buf2hex(verifyHashBuffer);
      console.log('[VeritasBTC] verify hash:', hash);
      const result = await getAnchor(verifyHashBuffer);
      console.log('[VeritasBTC] API response:', JSON.stringify(result));
      if (result.found) {
        setVerifyResult({
          found: true,
          owner: result.owner,
          block: result.blockHeight,
          contentType: result.contentType,
        });
      } else {
        setVerifyResult({ found: false });
      }
    } catch (err) {
      console.error('[VeritasBTC] verify error:', err);
      setVerifyResult({ found: false });
      showToast('Network error — could not reach Stacks', 'error');
    } finally {
      setIsVerifying(false);
    }
  }

  // ── Trust Circles ─────────────────────────────────────────────────────────────

  function handleAddToCircle() {
    if (!circleInput.trim() || (!circleInput.startsWith('SP') && !circleInput.startsWith('ST'))) {
      showToast('Enter a valid Stacks address (SP... for mainnet, ST... for testnet)', 'error');
      return;
    }
    if (!identityData) { showToast('Register your identity first', 'error'); return; }

    setIsAddingToCircle(true);
    callAddToTrustCircle(circleInput.trim(), {
      onFinish: async (data) => {
        const { txId } = data as { txId: string };
        openTxModal('Adding to Trust Circle...', txId);
        const { ok } = await runPollTx(txId);
        closeTxModal();
        setIsAddingToCircle(false);

        if (ok) {
          const updated = getCircles();
          if (!updated.includes(circleInput.trim())) updated.push(circleInput.trim());
          saveCircles(updated);
          setCircles([...updated]);
          setCircleInput('');
          showToast(`${circleInput.slice(0, 8)}... added to your circle ✅`, 'success');
        } else {
          showToast('Transaction failed — ensure the address has a registered identity', 'error');
        }
      },
      onCancel: () => { setIsAddingToCircle(false); },
    });
  }

  function handleRemoveFromCircle(memberAddr: string) {
    callRemoveFromTrustCircle(memberAddr, {
      onFinish: async (data) => {
        const { txId } = data as { txId: string };
        openTxModal('Removing from Trust Circle...', txId);
        const { ok } = await runPollTx(txId);
        closeTxModal();

        if (ok) {
          const updated = getCircles().filter(a => a !== memberAddr);
          saveCircles(updated);
          setCircles([...updated]);
          showToast('Removed from trust circle', 'success');
        }
      },
      onCancel: () => {},
    });
  }

  async function handleCheckMember() {
    if (!checkMemberInput.trim()) return;
    setIsCheckingMember(true);
    setMemberCheckResult(null);

    try {
      const identCV = await getIdentity(checkMemberInput.trim());
      if (identCV.found) {
        const name = identCV.name || checkMemberInput.trim();
        const inC = circles.includes(checkMemberInput.trim());
        setMemberCheckResult({ found: true, name, inCircle: inC });
      } else {
        setMemberCheckResult({ found: false });
      }
    } catch {
      setMemberCheckResult({ found: false });
    } finally {
      setIsCheckingMember(false);
    }
  }

  // ── Certificate Modal ─────────────────────────────────────────────────────────

  async function generateQr(url: string) {
    try {
      // Dynamic import to avoid SSR issues
      const QRCode = (await import('qrcode')).default;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 88, margin: 0,
        color: { dark: '#050508', light: '#ffffff' },
      });
      setCertQrUrl(dataUrl);
    } catch {
      setCertQrUrl('');
    }
  }

  async function openCertModal(record: AnchorRecord) {
    setPendingCertData(record);
    await generateQr(`${window.location.origin}/verify?hash=${record.hash}`);
    setCertModalOpen(true);
  }

  function handleSaveToHistory() {
    if (!pendingCertData) return;
    const hist = getHistory();
    const existing = hist.find(h => h.hash === pendingCertData!.hash);
    if (!existing) {
      const updated = [...hist, { ...pendingCertData, date: new Date().toLocaleDateString() }];
      saveHistory(updated);
      setHistory(updated);
      setAnchorCount(updated.length);
      showToast('Saved to history ✅', 'success');
    } else {
      showToast('Already in history', '');
    }
  }

  function handleCopyCertLink() {
    if (!pendingCertData) return;
    const url = `${window.location.origin}/verify?hash=${pendingCertData.hash}`;
    navigator.clipboard.writeText(url).then(() => showToast('Verify link copied! 📋', 'success'));
  }

  // ── Plan Banner ───────────────────────────────────────────────────────────────

  function renderPlanBanner() {
    if (plan.id === 'free') {
      const pct = Math.min(100, Math.round((anchorCount / 25) * 100));
      return (
        <div id="plan-banner" className="pb--free" style={{ display: 'flex', padding: '10px clamp(16px,3vw,48px)', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: '0.83rem', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="pb-left">
            <span className="pb-badge pb-badge--free">Free Plan</span>
            <span className="pb-text">{anchorCount} / 25 anchors used this month</span>
            <div className="pb-bar"><div className="pb-bar-fill" style={{ width: `${pct}%` }} /></div>
          </div>
          <Link href="/pricing" className="pb-upgrade">Upgrade to Pro →</Link>
        </div>
      );
    }
    if (daysLeft !== null && !expired) {
      const planName = PLANS[plan.id]?.name || plan.id;
      return (
        <div id="plan-banner" className="pb--trial" style={{ display: 'flex', padding: '10px clamp(16px,3vw,48px)', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: '0.83rem', borderBottom: '1px solid rgba(247,147,26,0.2)', background: 'rgba(247,147,26,0.07)' }}>
          <div className="pb-left">
            <span className="pb-badge pb-badge--trial">🔥 {planName} Trial</span>
            <span className="pb-text">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left in your free trial · No card needed yet</span>
          </div>
          <Link href="/pricing" className="pb-upgrade">Add Payment Method →</Link>
        </div>
      );
    }
    if (expired) {
      const planName = PLANS[plan.id]?.name || plan.id;
      return (
        <div id="plan-banner" className="pb--expired" style={{ display: 'flex', padding: '10px clamp(16px,3vw,48px)', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: '0.83rem', borderBottom: '1px solid rgba(255,77,109,0.25)', background: 'rgba(255,77,109,0.07)' }}>
          <div className="pb-left">
            <span className="pb-badge pb-badge--expired">⚠️ Trial Expired</span>
            <span className="pb-text">Your 30-day {planName} trial ended. Upgrade to keep all features.</span>
          </div>
          <Link href="/pricing" className="pb-upgrade btn-primary">Upgrade Now →</Link>
        </div>
      );
    }
    return null;
  }

  // ── Short address ─────────────────────────────────────────────────────────────

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const idName = identityData ? (identityData.name || shortAddr) : null;

  if (isLoading || !address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-void)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-void)' }}>

      {/* Dashboard nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', height: 72 }}>
        <div style={{ maxWidth: 1260, margin: '0 auto', padding: '0 clamp(16px,3vw,48px)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7v10c0 7.5 5.2 13.4 12 15 6.8-1.6 12-7.5 12-15V7L16 2z" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="1.5" />
              <path d="M10.5 16.5l3.5 3.5 7.5-7.5" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            VeritasBTC
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(247,147,26,0.1)', border: '1px solid rgba(247,147,26,0.25)', color: 'var(--bitcoin)', padding: '6px 14px', borderRadius: 20, fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {shortAddr}
            </div>
            <button
              onClick={() => disconnect()}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Plan banner */}
      {renderPlanBanner()}

      {/* Main layout */}
      <div className="dash-layout-grid">

        {/* Identity sidebar */}
        <aside>
          {!identityLoaded ? (
            <div className="identity-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading identity...</div>
            </div>
          ) : !identityData ? (
            <div className="identity-card">
              <div className="id-avatar">{address[0].toUpperCase()}</div>
              <div className="id-name" style={{ color: 'var(--text-muted)' }}>Not Registered</div>
              <div className="id-address">{shortAddr}</div>
              <div className="id-divider" />
              <div className="id-reg-form">
                <p>Register your identity on Bitcoin to start anchoring content and building trust.</p>
                <input
                  className="dash-input"
                  type="text"
                  placeholder="Your name or company name"
                  maxLength={50}
                  value={identityName}
                  onChange={(e) => setIdentityName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegisterIdentity()}
                />
                <button className="btn-primary full" onClick={handleRegisterIdentity}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="currentColor" />
                  </svg>
                  Register Identity
                </button>
              </div>
            </div>
          ) : (
            <div className="identity-card">
              <div className="id-avatar">{(idName?.[0] || 'A').toUpperCase()}</div>
              <div className="id-name">{idName}</div>
              <div className="id-address">{shortAddr}</div>
              <div className="id-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 7v10c0 7.5 5.2 13.4 12 15 6.8-1.6 12-7.5 12-15V7L16 2zm0 2.18l8 4v8.4c0 6.3-4.5 11.2-8 12.4-3.5-1.2-8-6.1-8-12.4v-8.4l8-4z" />
                </svg>
                Bitcoin Verified
              </div>
              <div className="id-stats">
                <div className="id-stat">
                  <div className="id-stat-num">{anchorCount}</div>
                  <div className="id-stat-lbl">Anchors</div>
                </div>
                <div className="id-stat">
                  <div className="id-stat-num">{circles.length}</div>
                  <div className="id-stat-lbl">Circle</div>
                </div>
                <div className="id-stat">
                  <div className="id-stat-num">L1</div>
                  <div className="id-stat-lbl">Level</div>
                </div>
              </div>
              <div className="id-divider" />
              <a
                href={explorerAddressUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost full"
                style={{ fontSize: '0.78rem' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View on Explorer
              </a>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="dash-main">

          {/* Tab bar */}
          <div className="tab-bar" role="tablist">
            {([
              { id: 'anchor', label: 'Anchor', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { id: 'verify', label: 'Verify', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { id: 'circles', label: 'Trust Circles', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
              { id: 'history', label: 'History', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
            ] as const).map(tab => (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── ANCHOR TAB ──────────────────────── */}
          {activeTab === 'anchor' && (
            <div className="tab-panel active">
              <div className="panel-card">
                <div className="panel-title">Anchor New Content</div>
                <div className="panel-sub">
                  Drop any file — the fingerprint is calculated on your device and never
                  uploaded. Only a 32-byte hash is written to Bitcoin.
                </div>

                {/* Content type selector */}
                <div className="ctype-row">
                  {(['photo', 'document', 'voice', 'video', 'other'] as const).map(ct => (
                    <button
                      key={ct}
                      className={`ctype-btn${currentContentType === ct ? ' active' : ''}`}
                      onClick={() => setCurrentContentType(ct)}
                    >
                      {CTYPE_ICONS[ct]} {ct.charAt(0).toUpperCase() + ct.slice(1)}
                    </button>
                  ))}
                </div>

                <input type="file" ref={anchorFileInput} style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleAnchorFile(f); }} />

                <div
                  className={`file-zone${anchorDrag ? ' drag-over' : ''}`}
                  onClick={() => anchorFileInput.current?.click()}
                  onDragOver={e => { e.preventDefault(); setAnchorDrag(true); }}
                  onDragLeave={() => setAnchorDrag(false)}
                  onDrop={e => { e.preventDefault(); setAnchorDrag(false); const f = e.dataTransfer.files[0]; if (f) handleAnchorFile(f); }}
                >
                  {anchorFileLabel ? (
                    <>
                      <div className="file-zone-icon">{anchorFileLabel.icon}</div>
                      <div className="file-zone-text">
                        <strong>{anchorFileLabel.name}</strong><br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          {anchorFileLabel.size} · {isHashing ? 'Hashing...' : 'Ready to anchor'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="file-zone-icon">📂</div>
                      <div className="file-zone-text">
                        <strong>Click to select</strong> or drag and drop<br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          Any file type · Max 500MB · File never leaves your device
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {anchorHash && !isHashing && (
                  <div className="hash-box" style={{ display: 'block' }}>
                    <strong>SHA-256 Fingerprint</strong><br />
                    <span className="hash-val">0x{anchorHash}</span>
                  </div>
                )}

                {isHashing && (
                  <div className="hash-box" style={{ display: 'block' }}>
                    <span style={{ color: 'var(--text-muted)' }}>⏳ Calculating SHA-256 fingerprint...</span>
                  </div>
                )}

                {anchorHash && !isHashing && identityData && (
                  <button
                    className="btn-primary full"
                    onClick={handleAnchorSubmit}
                    disabled={isAnchoring}
                    style={{ marginTop: 4 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {isAnchoring ? 'Anchoring...' : 'Anchor to Bitcoin'}
                  </button>
                )}

                {anchorHash && !isHashing && !identityData && (
                  <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.83rem', color: 'var(--red)' }}>
                    ⚠️ You must register your identity before anchoring content.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── VERIFY TAB ─────────────────────── */}
          {activeTab === 'verify' && (
            <div className="tab-panel active">
              <div className="panel-card">
                <div className="panel-title">Verify Content Authenticity</div>
                <div className="panel-sub">
                  Upload any file to check if it has an unaltered Bitcoin anchor. No wallet needed to verify.
                </div>

                <input type="file" ref={verifyFileInput} style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleVerifyFile(f); }} />

                <div
                  className={`file-zone${verifyDrag ? ' drag-over' : ''}`}
                  onClick={() => verifyFileInput.current?.click()}
                  onDragOver={e => { e.preventDefault(); setVerifyDrag(true); }}
                  onDragLeave={() => setVerifyDrag(false)}
                  onDrop={e => { e.preventDefault(); setVerifyDrag(false); const f = e.dataTransfer.files[0]; if (f) handleVerifyFile(f); }}
                >
                  {verifyFileLabel ? (
                    <>
                      <div className="file-zone-icon">{verifyFileLabel.icon}</div>
                      <div className="file-zone-text">
                        <strong>{verifyFileLabel.name}</strong><br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{verifyFileLabel.size}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="file-zone-icon">🔍</div>
                      <div className="file-zone-text">
                        <strong>Click to select</strong> or drag and drop<br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Drop the original file to check its Bitcoin fingerprint</span>
                      </div>
                    </>
                  )}
                </div>

                {(verifyHash || isVerifyHashing) && (
                  <div className="hash-box" style={{ display: 'block' }}>
                    {isVerifyHashing
                      ? <span style={{ color: 'var(--text-muted)' }}>⏳ Calculating fingerprint...</span>
                      : <><strong>SHA-256 Fingerprint</strong><br /><span className="hash-val">0x{verifyHash}</span></>
                    }
                  </div>
                )}

                {verifyHash && !isVerifyHashing && (
                  <button
                    className="btn-ghost full"
                    onClick={handleVerifySubmit}
                    disabled={isVerifying}
                    style={{ marginTop: 4 }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {isVerifying ? '⏳ Querying Bitcoin...' : 'Check Bitcoin Record'}
                  </button>
                )}

                {verifyResult && (
                  <div className={`verify-result${verifyResult.found ? ' authentic' : ' fake'}`} style={{ display: 'block' }}>
                    {verifyResult.found ? (
                      <>
                        <div className="vr-icon">✅</div>
                        <div className="vr-title green">AUTHENTIC — Bitcoin Record Found</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          This exact fingerprint exists on Bitcoin. The content has not been altered.
                        </div>
                        <div className="vr-rows">
                          {verifyResult.owner && (
                            <div className="vr-row">
                              <span className="vr-key">Anchored By</span>
                              <span className="vr-val">{verifyResult.owner.slice(0, 8)}...{verifyResult.owner.slice(-6)}</span>
                            </div>
                          )}
                          {verifyResult.block && (
                            <div className="vr-row">
                              <span className="vr-key">Bitcoin Block</span>
                              <span className="vr-val" style={{ color: 'var(--bitcoin)' }}>#{verifyResult.block}</span>
                            </div>
                          )}
                          {verifyResult.contentType && (
                            <div className="vr-row">
                              <span className="vr-key">Content Type</span>
                              <span className="vr-val">{verifyResult.contentType}</span>
                            </div>
                          )}
                        </div>
                        {verifyResult.block && (
                          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <a href={explorerBlockUrl(verifyResult.block)} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 14px', textDecoration: 'none' }}>
                              View on Explorer
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="vr-icon">⚠️</div>
                        <div className="vr-title red">NOT FOUND — No Bitcoin Record</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          This fingerprint has no anchor on Bitcoin. The file may be fake, altered, or never anchored.
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── TRUST CIRCLES TAB ──────────────── */}
          {activeTab === 'circles' && (
            <div className="tab-panel active">
              <div className="panel-card">
                <div className="panel-title">Your Trust Circle</div>
                <div className="panel-sub">
                  Add people you trust. When they send you messages, documents, or calls —
                  they can prove their identity is Bitcoin-verified.
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <input
                    className="dash-input"
                    type="text"
                    placeholder="Stacks address (SP... or ST...)"
                    value={circleInput}
                    onChange={e => setCircleInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddToCircle()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn-primary" onClick={handleAddToCircle} disabled={isAddingToCircle}>
                    {isAddingToCircle ? '...' : 'Add'}
                  </button>
                </div>

                <div id="circleList">
                  {circles.length === 0 ? (
                    <div className="empty-state">
                      <div className="es-icon">🤝</div>
                      <p>Your trust circle is empty.<br />Add family, colleagues, or partners by their Stacks address.</p>
                    </div>
                  ) : (
                    circles.map((addr, i) => (
                      <div key={addr} className="circle-member">
                        <div className="cm-avatar" style={{ background: CIRCLE_COLORS[i % CIRCLE_COLORS.length] }}>
                          {addr[2]?.toUpperCase() || '?'}
                        </div>
                        <div className="cm-info">
                          <div className="cm-addr">{addr}</div>
                          <div className="cm-status active">● Bitcoin Verified</div>
                        </div>
                        <button className="cm-remove" onClick={() => handleRemoveFromCircle(addr)}>
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="panel-card" style={{ marginTop: 16 }}>
                <div className="panel-title">Verify Someone Else</div>
                <div className="panel-sub">Check if a Stacks address is in your trust circle and has an active identity.</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="dash-input"
                    type="text"
                    placeholder="SP... or ST... address"
                    value={checkMemberInput}
                    onChange={e => setCheckMemberInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCheckMember()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn-ghost" onClick={handleCheckMember} disabled={isCheckingMember}>
                    {isCheckingMember ? '...' : 'Check'}
                  </button>
                </div>
                {memberCheckResult && (
                  <div style={{ marginTop: 12, fontSize: '0.85rem' }}>
                    {memberCheckResult.found ? (
                      <div style={{ padding: '12px 16px', background: 'rgba(16,212,142,0.08)', border: '1px solid rgba(16,212,142,0.25)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ color: 'var(--green)', fontWeight: 600 }}>✅ Active Bitcoin Identity</div>
                        {memberCheckResult.name && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Name: {memberCheckResult.name}</div>}
                        {memberCheckResult.inCircle
                          ? <div style={{ fontSize: '0.8rem', color: 'var(--green)', marginTop: 4 }}>🤝 In your trust circle</div>
                          : <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Not in your trust circle</div>
                        }
                      </div>
                    ) : (
                      <div style={{ padding: '12px 16px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ color: 'var(--red)', fontWeight: 600 }}>⚠️ No Bitcoin Identity Found</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>This address has no registered identity on VeritasBTC.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── HISTORY TAB ────────────────────── */}
          {activeTab === 'history' && (
            <div className="tab-panel active">
              <div className="panel-card">
                <div className="panel-title">Anchor History</div>
                <div className="panel-sub">
                  Your locally stored anchors. Click any item to view its certificate and shareable verify link.
                </div>
                {history.length === 0 ? (
                  <div className="empty-state">
                    <div className="es-icon">📋</div>
                    <p>No anchors yet. Anchor your first file to get started.</p>
                  </div>
                ) : (
                  [...history].reverse().map((item, i) => (
                    <div
                      key={i}
                      className="history-item"
                      onClick={() => openCertModal(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && openCertModal(item)}
                    >
                      <div className="hi-icon">{CTYPE_ICONS[item.contentType] || '📦'}</div>
                      <div className="hi-body">
                        <div className="hi-name">{item.fileName || 'Anchored File'}</div>
                        <div className="hi-hash">0x{item.hash.slice(0, 32)}...</div>
                      </div>
                      <div className="hi-meta">
                        <div className="hi-block">#{item.blockHeight || 'Pending'}</div>
                        <div style={{ marginTop: 2 }}>{item.date || ''}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── TX Status Modal ─────────────────────────────── */}
      {txModalOpen && (
        <div id="tx-modal" className="open">
          <div className="tx-modal-card">
            <div className="tx-spinner" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
              {txModalTitle}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{txModalSub || 'This may take 10–30 seconds'}</div>

            <div className="tx-steps">
              {([
                { num: 1, key: 'step1' as const, label: { active: 'Submitting to Stacks network...', done: 'Transaction submitted to Stacks network', pending: 'Submit to Stacks network' } },
                { num: 2, key: 'step2' as const, label: { active: 'Waiting for Bitcoin confirmation...', done: 'Confirmed on Bitcoin', pending: 'Waiting for Bitcoin confirmation' } },
                { num: 3, key: 'step3' as const, label: { active: 'Generating certificate...', done: 'Certificate ready ✅', pending: 'Certificate generated' } },
              ]).map(step => {
                const state = txStep[step.key];
                return (
                  <div key={step.num} className="tx-step">
                    <div className={`tx-step-icon ${state}`}>
                      {state === 'done' ? '✓' : step.num}
                    </div>
                    <div className={`tx-step-label${state === 'done' ? ' done' : ''}`}>
                      {step.label[state]}
                    </div>
                  </div>
                );
              })}
            </div>

            {txExplorerLink && (
              <a href={txExplorerLink} className="tx-link" target="_blank" rel="noopener noreferrer">
                View transaction on Hiro Explorer →
              </a>
            )}
          </div>
        </div>
      )}

      {/* ─── Certificate Modal ───────────────────────────── */}
      {certModalOpen && pendingCertData && (
        <div id="cert-modal" className="open" onClick={e => { if ((e.target as Element).id === 'cert-modal') setCertModalOpen(false); }}>
          <div className="cert-card">
            <button className="cert-close" onClick={() => setCertModalOpen(false)}>✕</button>

            <div className="cert-header">
              <div className="cert-shield">
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L4 7v10c0 7.5 5.2 13.4 12 15 6.8-1.6 12-7.5 12-15V7L16 2z" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="1.5" />
                  <path d="M10.5 16.5l3.5 3.5 7.5-7.5" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="cert-headline">VeritasBTC Certificate</div>
                <div className="cert-sub">Permanently anchored to Bitcoin</div>
              </div>
            </div>

            <div className="cert-result">
              <div className="cert-result-icon">✅</div>
              <div>
                <div className="cert-result-label">ANCHORED</div>
                <div className="cert-result-desc">{pendingCertData.fileName || 'Content'} anchored to Bitcoin</div>
              </div>
            </div>

            <div className="cert-qr-row">
              <div className="cert-qr">
                {certQrUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={certQrUrl} alt="QR code" width={88} height={88} />
                ) : (
                  <div style={{ width: 88, height: 88, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-subtle)' }}>QR</div>
                )}
              </div>
              <div className="cert-rows" style={{ flex: 1 }}>
                <div className="cert-row">
                  <span className="cert-key">Bitcoin Block</span>
                  <span className="cert-val orange">{pendingCertData.blockHeight ? `#${pendingCertData.blockHeight}` : 'Confirming...'}</span>
                </div>
                <div className="cert-row">
                  <span className="cert-key">Content Type</span>
                  <span className="cert-val">{pendingCertData.contentType || '—'}</span>
                </div>
                <div className="cert-row">
                  <span className="cert-key">Anchored By</span>
                  <span className="cert-val">{pendingCertData.owner ? `${pendingCertData.owner.slice(0, 8)}...${pendingCertData.owner.slice(-6)}` : '—'}</span>
                </div>
                <div className="cert-row">
                  <span className="cert-key">Fingerprint</span>
                  <span className="cert-val">0x{pendingCertData.hash.slice(0, 20)}...</span>
                </div>
                <div className="cert-row">
                  <span className="cert-key">TX ID</span>
                  <span className="cert-val">{pendingCertData.txId ? `${pendingCertData.txId.slice(0, 16)}...` : '—'}</span>
                </div>
              </div>
            </div>

            <div className="cert-actions">
              <button className="btn-green" onClick={handleCopyCertLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Copy Verify Link
              </button>
              {pendingCertData.txId && (
                <a className="btn-ghost" href={explorerTxUrl(pendingCertData.txId)} target="_blank" rel="noopener noreferrer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Explorer
                </a>
              )}
              <button className="btn-ghost" onClick={handleSaveToHistory}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Save to History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Upgrade Modal ───────────────────────────────── */}
      {upgradeModalOpen && (
        <div className="modal-overlay open" onClick={e => { if ((e.target as Element).classList.contains('modal-overlay')) setUpgradeModalOpen(false); }}>
          <div className="upgrade-modal-card">
            <div className="um-icon">🔒</div>
            <h3 className="um-title">Free Plan Limit Reached</h3>
            <p className="um-sub">
              You&apos;ve used all <strong>25 anchors</strong> this month on the free plan.
              Upgrade to get unlimited Bitcoin anchoring.
            </p>
            <div className="um-plans">
              <div className="um-plan um-plan--pro">
                <div className="um-plan-top">
                  <span className="um-plan-name">Pro</span>
                  <span className="um-plan-badge">30 days FREE</span>
                </div>
                <div className="um-plan-price">$0.99 <span>/ month after trial</span></div>
                <ul className="um-plan-features">
                  <li>Unlimited anchoring</li>
                  <li>Live identity verification</li>
                  <li>Trust Circle (10 members)</li>
                </ul>
                <Link href="/pricing" className="btn-primary full" onClick={() => setUpgradeModalOpen(false)}>
                  Claim Free Trial →
                </Link>
              </div>
              <div className="um-plan um-plan--biz">
                <div className="um-plan-top">
                  <span className="um-plan-name">Business</span>
                  <span className="um-plan-badge">30 days FREE</span>
                </div>
                <div className="um-plan-price">$4.99 <span>/ month after trial</span></div>
                <ul className="um-plan-features">
                  <li>Everything in Pro</li>
                  <li>API access + webhooks</li>
                  <li>25-member team</li>
                </ul>
                <Link href="/pricing" className="btn-ghost full" onClick={() => setUpgradeModalOpen(false)}>
                  Claim Free Trial →
                </Link>
              </div>
            </div>
            <button className="um-later" onClick={() => setUpgradeModalOpen(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* ─── Toast ───────────────────────────────────────── */}
      <div id="toast" className={`${toast.show ? 'show' : ''} ${toast.type}`} role="status" aria-live="polite">
        {toast.msg}
      </div>

    </div>
  );
}
