'use client';

import { useState, useRef } from 'react';
import { getAnchor, sha256, buf2hex } from '@/lib/stacks';

interface VerifyResult {
  found: boolean;
  owner?: string;
  block?: string | number;
  contentType?: string;
}

export default function InstantVerify() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    setHash('');
    setResult(null);
    setIsHashing(true);

    try {
      const buffer = await f.arrayBuffer();
      const hashBuffer = await sha256(buffer);
      const hex = buf2hex(hashBuffer);
      setHash(hex);
    } catch {
      setHash('error');
    } finally {
      setIsHashing(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleVerify() {
    if (!hash || hash === 'error') return;
    setIsVerifying(true);
    setResult(null);

    try {
      // Convert hex string to Uint8Array
      const bytes = new Uint8Array(hash.match(/.{1,2}/g)!.map(b => parseInt(b, 16)));
      const resultCV = await getAnchor(bytes.buffer);

      if (resultCV.type === 'some') {
        const d = resultCV.value;
        setResult({
          found: true,
          owner: d.owner?.value,
          block: d['block-height']?.value,
          contentType: d['content-type']?.value,
        });
      } else {
        setResult({ found: false });
      }
    } catch {
      setResult({ found: false });
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <section className="section instant-verify" id="verify">
      <div className="container">
        <div className="iv-card">
          <div className="section-label">Instant Verify</div>
          <h2>
            Verify any file in seconds.<br />
            <span className="text-grad-orange">No account needed.</span>
          </h2>

          <div
            className={`iv-drop${dragOver ? ' drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="Drop a file to verify"
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {file ? (
              <>
                <div className="iv-drop-icon">{getFileIcon(file.name)}</div>
                <div className="iv-drop-name">{file.name}</div>
                <div className="iv-drop-size">{formatBytes(file.size)}</div>
              </>
            ) : (
              <>
                <div className="iv-drop-icon">🔍</div>
                <div className="iv-drop-text">
                  <strong>Click or drag a file here</strong> to verify its Bitcoin anchor
                </div>
                <div className="iv-drop-hint">Any file type · File stays on your device</div>
              </>
            )}
          </div>

          {isHashing && (
            <div className="iv-hash" id="iv-hash">
              <span style={{ color: 'var(--text-muted)' }}>⏳ Computing SHA-256...</span>
            </div>
          )}

          {hash && !isHashing && (
            <div className="iv-hash" id="iv-hash">
              <strong>SHA-256:</strong>
              <span className="iv-hash-val"> 0x{hash.slice(0, 32)}…</span>
            </div>
          )}

          {hash && !isHashing && (
            <button
              className="btn-primary full"
              onClick={handleVerify}
              disabled={isVerifying}
              style={{ marginTop: 16 }}
            >
              {isVerifying ? '⏳ Querying Bitcoin...' : 'Verify on Bitcoin'}
            </button>
          )}

          {result && (
            <div
              className={`iv-result${result.found ? ' authentic' : ' not-found'}`}
              id="iv-result"
            >
              {result.found ? (
                <>
                  <div className="iv-result-icon">✅</div>
                  <div className="iv-result-title" style={{ color: 'var(--green)' }}>
                    AUTHENTIC — Bitcoin Record Found
                  </div>
                  <div className="iv-result-desc">
                    This exact fingerprint exists on Bitcoin. The content has not been altered.
                  </div>
                  <div className="iv-result-rows">
                    {result.owner && (
                      <div className="iv-result-row">
                        <span>Anchored By</span>
                        <span>{result.owner.slice(0, 8)}...{result.owner.slice(-6)}</span>
                      </div>
                    )}
                    {result.block && (
                      <div className="iv-result-row">
                        <span>Bitcoin Block</span>
                        <span style={{ color: 'var(--bitcoin)' }}>#{result.block}</span>
                      </div>
                    )}
                    {result.contentType && (
                      <div className="iv-result-row">
                        <span>Content Type</span>
                        <span>{result.contentType}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="iv-result-icon">⚠️</div>
                  <div className="iv-result-title" style={{ color: 'var(--red)' }}>
                    NOT FOUND — No Bitcoin Record
                  </div>
                  <div className="iv-result-desc">
                    This fingerprint has no anchor on Bitcoin. The file may be fake, altered, or
                    never anchored.
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function getFileIcon(name: string): string {
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
