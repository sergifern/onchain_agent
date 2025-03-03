
export default function PageContainer({ children, title, description }: { children: React.ReactNode, title: string, description: string }) {
  return (
    <main className="container p-6 !pl-10 text-white">
      <h1 className="text-3xl mb-12 font-hansengrotesk">{title}</h1>
      <p className="text-sm text-secondary mb-4 hidden">{description}</p>
      {children}
      </main>
  );
}