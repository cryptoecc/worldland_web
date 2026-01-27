import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorldLand - GPU Power for Everyone",
  description: "Decentralized GPU Infrastructure Network. Access enterprise-grade GPUs with verifiable computation on ECCVCC blockchain.",
  keywords: ["GPU", "DePIN", "AI", "Blockchain", "ECCVCC", "Decentralized", "Cloud Computing"],
  openGraph: {
    title: "WorldLand - GPU Power for Everyone",
    description: "Decentralized GPU Infrastructure Network for AI Era",
    type: "website",
    url: "https://worldland.foundation",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldLand - GPU Power for Everyone",
    description: "Decentralized GPU Infrastructure Network for AI Era",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Playfair Display (Elegant Serif) + Inter (Body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" rel="stylesheet" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-black text-white antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
