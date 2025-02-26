import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { Check } from 'lucide-react';

function TradingCardOG({ position, leverage, pair, entry, last, referral, timestamp }: any) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: "linear-gradient(to bottom right, #2e2287, #622073, #8355e0)",
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: 24,
      }}
    >
      <div tw="flex flex-col w-full h-full p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '4px 8px', borderRadius: 4, fontSize: 14, fontWeight: 'bold' }}>{position}</span>
          <span style={{ background: '#27272A', padding: '4px 8px', borderRadius: 4, fontSize: 14, fontWeight: 'bold' }}>{leverage}X</span>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 'bold' }}></span>
            <Check size={20} style={{ color: "#10B981" }} />
          </div>
        </div>
        
        {/* Profit Percentage */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48, fontWeight: 'bold', color: '#10B981' }}>{pair}</span>
        </div>
        
        {/* Price Details */}
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 16, gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '50%' }}>
            <span style={{ color: '#D1D5DB' }}>Entry Price</span>
            <span style={{ fontWeight: 'bold', color: '#FBBF24' }}>{entry}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '50%' }}>
            <span style={{ color: '#D1D5DB' }}>Last Price</span>
            <span style={{ fontWeight: 'bold', color: '#FBBF24' }}>{last}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 12, color: '#D1D5DB', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>Referral Code</span>
            <span style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{referral}</span>
          </div>
          <span style={{ fontSize: 14, fontFamily: 'monospace' }}>Time Stamp: {timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position') || 'Long';
    const leverage = searchParams.get('leverage') || '20';
    const pair = searchParams.get('pair') || '$COOKIE';
    const entry = searchParams.get('entry') || '0.4265000';
    const last = searchParams.get('last') || '0.4362000';
    const referral = searchParams.get('referral') || '16439211';
    const timestamp = searchParams.get('timestamp') || '2025-01-22 21:11';

    return new ImageResponse(
      TradingCardOG({ position, leverage, pair, entry, last, referral, timestamp }),
      {
        width: 800,
        height: 420,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response('Error generating image', { status: 500 });
  }
}
