export default function HowItWorksSection() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-label reveal" data-delay="0">How It Works</div>
        <h2 className="section-title reveal" data-delay="1">
          Three steps.<br /><span className="text-grad-orange">Permanent proof.</span>
        </h2>

        <div className="steps-grid reveal" data-delay="2">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="1.5" />
                <path d="M8 12h8M12 8v8" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="step-title">Upload or drag your file</h3>
            <p className="step-body">
              Drop any file — photo, PDF, audio, video, contract — into the dashboard.
              Your browser computes a SHA-256 fingerprint locally.{' '}
              <strong>The file never leaves your device.</strong>
            </p>
          </div>

          <div className="step-arrow" aria-hidden="true">→</div>

          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="4" fill="rgba(247,147,26,0.1)" stroke="#F7931A" strokeWidth="1.5" />
                <path d="M7 12h2l2-4 2 8 2-4h2" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="step-title">Anchor to Bitcoin</h3>
            <p className="step-body">
              A Stacks smart contract writes the hash on-chain. The transaction settles on
              Bitcoin — permanent, tamper-proof, and publicly verifiable within seconds.
            </p>
          </div>

          <div className="step-arrow" aria-hidden="true">→</div>

          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.1 3.5 9.1 8 10.3C16.5 21.1 20 17.1 20 12V6L12 2z" fill="rgba(247,147,26,0.1)" stroke="#F7931A" strokeWidth="1.5" />
                <path d="M8.5 12l2.5 2.5 5-5" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="step-title">Share your certificate</h3>
            <p className="step-body">
              Download a QR certificate or share a verify link. Anyone can drop the same
              file anywhere and instantly confirm it's authentic — no account required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
