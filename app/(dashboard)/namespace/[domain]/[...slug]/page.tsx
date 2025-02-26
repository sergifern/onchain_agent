
import { Metadata } from "next"
import DocumentPage from "./DocPage"


export const metadata: Metadata = {
  title: `Ethy AI - Documentation`,
  description: 'Ethy AI Description',
  openGraph: {
    title: `Ethy AI - Documentation`,
    description: 'Ethy AI Description',
    images: `https://ethyai.vercel.app/api/og`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Ethy AI - Documentation`,
    description: 'Ethy AI Description',
    images: `https://ethyai.vercel.app/api/og`,
  },
}


export default function Page() {
  
  return (
    <DocumentPage />
  )
}

