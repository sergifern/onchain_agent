import DomainPage from "./DomainPage"

/*
export const metadata: Metadata = {
  title: `Ethy AI - Documentation`,
  description: 'Ethy AI Description',
  openGraph: {
    title: `Ethy AI - Documentation`,
    description: 'Ethy AI Description',
    images: `https://ethyai.vercel.app/api/og/claimed`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Ethy AI - Documentation`,
    description: 'Ethy AI Description',
    images: `https://ethyai.vercel.app/api/og/claimed`,
  },
}*/

//generate metadata for each domain

export async function generateMetadata({ params }: { params: { domain: string } }) {
  const { domain } = await params;

  return {
    title: `Ethy AI - ${domain}`,
    description: `Ethy AI Description for ${domain}`,
    openGraph: {
      title: `Claim your Namespace`,
      description: `Namespace claimed by ${domain}`,
      images: `https://chat.ethyai.app/api/og/claimed?namespace=${domain}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Claim your Namespace`,
      description: `Namespace claimed by ${domain}`,
      images: `https://chat.ethyai.app/api/og/claimed?namespace=${domain}`,
    },
  }
}

export default function Page() {
  
  return (
    <DomainPage />
  )
}

