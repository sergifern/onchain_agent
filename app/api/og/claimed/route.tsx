import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { CheckCircle } from 'lucide-react';

function NamespaceCardOG({ namespace }: { namespace: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #111827, #000000)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: 800, height: 420, padding: 24, borderRadius: 12, background: '#1E1E1E', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} color="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#3b82f6' }}>Namespace Claimed</span>
        </div>
        
        <h2 style={{ fontSize: 40, fontWeight: 'bold', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: 24 }}>
          Got my Namespace for
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ padding: '16px 32px', fontSize: 28, fontWeight: 'bold', borderRadius: 8, background: 'rgba(59, 130, 246, 0.3)', border: '1px solid rgba(59, 130, 246, 0.5)', boxShadow: '0px 0px 15px rgba(59, 130, 246, 0.5)', fontFamily: 'monospace' }}>
            {namespace}
          </div>
        </div>
        
        <p style={{ fontSize: 18, color: '#D1D5DB', maxWidth: 600, margin: '0 auto' }}>
          You can claim yours now and store, share, and control your data under your digital identity.
        </p>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const namespace = searchParams.get('namespace') || 'XXX.base.eth';

    return new ImageResponse(
      NamespaceCardOG({ namespace }),
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
