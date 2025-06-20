
export async function GET() {

  const circulatingSupply = 910_000_000;

  return new Response(circulatingSupply.toString(), {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  
}