import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0A0A14',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Orange shield outline */}
        <div
          style={{
            width: 20,
            height: 22,
            border: '2.5px solid #F7931A',
            borderRadius: '5px 5px 10px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* V mark inside shield */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, marginTop: 2 }}>
            <div style={{ width: 3, height: 8, background: '#F7931A', borderRadius: 1, transform: 'rotate(25deg)', transformOrigin: 'bottom' }} />
            <div style={{ width: 3, height: 8, background: '#F7931A', borderRadius: 1, transform: 'rotate(-25deg)', transformOrigin: 'bottom' }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
