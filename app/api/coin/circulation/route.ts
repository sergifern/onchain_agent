
export async function GET() {

  const circulatingSupply = 1_000_000_000;

  return new Response(circulatingSupply.toString(), {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  
}