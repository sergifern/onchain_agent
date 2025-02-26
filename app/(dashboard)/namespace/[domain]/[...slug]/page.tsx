
import { Metadata } from "next"
import DocumentPage from "./DocPage"


const metadata: Metadata = {
  title: `Ethy AI - Documentation`,
  description: 'Ethy AI Description',
  openGraph: {
    images: `https://ethyai.vercel.app/api/og`,
  },
}


export default function Page() {
  
  return (
    <DocumentPage />
  )
}

