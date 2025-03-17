import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/supabaseClient';
 


export async function GET(req: NextRequest) {
  try {

    const namespacesOld = [
      {
        id: 1,
        name: "jesse.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x4bEf0221d6F7Dd0C969fe46a4e9b339a84F52FDF",
        documents: 12,
        claimed: true,
        github: "jessedoe",
        twitter: "@jessecrypto",
      },
      {
        id: 2,
        name: "pizzahouse.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1f294306d01546a4cd5E62F3c165c5B7B31C7F83",
        documents: 5,
        claimed: true,
        github: "alphatrader",
        twitter: "@alphacalls",
      },
      {
        id: 3,
        name: "degen.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x4567...8901",
        documents: 8,
        claimed: false,
        github: "degenlabs",
        twitter: "@degenlabs",
      },
      {
        id: 4,
        name: "builder00.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 5,
        name: "agentXBT.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 6,
        name: "pizzahouse.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 7,
        name: "builder01.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 8,
        name: "builder02.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 9,
        name: "builder03.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      }
    ]
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = 10;
    const offset = (page - 1) * limit;
  
    let query = supabase.from("basenames").select("*").order("id", { ascending: false }).range(offset, offset + limit - 1);
  
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
  
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const groupedBasenames = Object.values(
      data.reduce((acc, item) => {
        acc[item.owner] = acc[item.owner] || item; // Keep only the first occurrence of each owner
        return acc;
      }, {})
    );


    // check if are claimed and verified with X or Farcaster account
    // first fetchinbg data grom tabnle namespaces to si if caliemd. if existis is claimed, and then if exist check if have twitter
    // Comprovar si estan reclamats i verificats
    const names = groupedBasenames.map((item: any) => item.name);
    const { data: namespaces, error: namespaceError } = await supabase
      .from("namespaces")
      .select("*")
      .in("basename", names);

    if (namespaceError) return NextResponse.json({ error: namespaceError.message }, { status: 500 });
    
    // Convertir els resultats en un objecte per facilitar la cerca
    const namespaceMap = namespaces.reduce((acc, ns) => {
      acc[ns.basename] = ns; // Ara la clau és el basename
      return acc;
    }, {});

    
    // Afegir informació de verificació a cada registre
    const finalData = groupedBasenames.map((item: any) => ({
      ...item,
      claimed: !!namespaceMap[item.name], // Buscar per item.name en comptes de owner
      documents: namespaceMap[item.name]?.documents || 0,
      twitter_verified: !!namespaceMap[item.name]?.twitter, // Si té twitter_handle, està verificat a X
      farcaster_verified: !!namespaceMap[item.name]?.farcaster, // Si té farcaster_handle, està verificat a Farcaster
    }));
    

  
    const totalPages = Math.ceil(65000 / limit);


    return NextResponse.json({ namespaces: namespacesOld, basenames: finalData, totalPages }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


function groupByOwner(basenames: any) {
  return basenames.reduce((acc: any, item: any) => {
    acc[item.owner] = (acc[item.owner] || 0) + 1;
    return acc;
  }, {});
}
