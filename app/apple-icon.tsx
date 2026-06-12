import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#0A0A14',
          borderRadius: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Orange shield */}
        <div
          style={{
            width: 110,
            height: 124,
            border: '10px solid #F7931A',
            borderRadius: '24px 24px 55px 55px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* V checkmark */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 8 }}>
            <div style={{ width: 14, height: 44, background: '#F7931A', borderRadius: 4, transform: 'rotate(25deg)', transformOrigin: 'bottom center' }} />
            <div style={{ width: 14, height: 44, background: '#F7931A', borderRadius: 4, transform: 'rotate(-25deg)', transformOrigin: 'bottom center' }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
