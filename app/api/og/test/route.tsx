import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const font = fetch(
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;700&display=swap"
)
  .then((res) => res.text())
  .then((css) => {
    const match = css.match(/url\((https:\/\/fonts.gstatic.com\/[^)]+)\)/);
    if (!match) throw new Error("Font URL not found");

    return fetch(match[1]) // Download font file
      .then((res) => res.arrayBuffer())
      .then((buffer) => ({
        name: "Hanken Grotesk",
        data: buffer,
      }));
  });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const namespace = searchParams.get('namespace') || 'jesse.base.eth';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'linear-gradient(to bottom right, #111827, #000000)',
          color: 'white',
          fontFamily: '"Hanken Grotesk", sans-serif', // Use the custom font
        }}
      >
        {/* Background Image */}
        <img
          width={1600}
          height={900}
          src={`${process.env.NEXT_PUBLIC_APP_URL}/img/og/claimed.png`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Namespace Text */}
        <div
          style={{
            display: 'flex', // Se asegura de que flex esté presente siempre
            alignItems: 'baseline',
            justifyContent: 'flex-start',
            position: 'absolute', // Para colocarlo encima de la imagen
            top: '10%',
            left: '11%',
          }}
        >
          <span style={{ fontSize: 50, fontWeight: 700, fontFamily: '"Hanken Grotesk", sans-serif', color: 'white' }}>
            {namespace}
          </span>
        </div>
      </div>
    ),
    {
      width: 1600,
      height: 900,
      fonts: [await font], // Load custom font
    }
  );
}
