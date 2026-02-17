import PortfolioClientPage from "./portfolio-client-page"
import settings from "../settings.json"

export const metadata = {
  title: settings.metadata.title,
  description: settings.metadata.description,
  keywords: settings.metadata.keywords,
  authors: [{ name: settings.metadata.author }],
  robots: settings.metadata.robots,
  openGraph: {
    title: settings.metadata.openGraph.title,
    description: settings.metadata.openGraph.description,
    url: settings.metadata.openGraph.url,
    siteName: settings.metadata.openGraph.siteName,
    type: settings.metadata.openGraph.type,
    images: [
      {
        url: settings.metadata.openGraph.image.url,
        width: settings.metadata.openGraph.image.width,
        height: settings.metadata.openGraph.image.height,
        alt: settings.metadata.openGraph.image.alt,
      },
    ],
  },
  twitter: {
    card: settings.metadata.twitter.card,
    site: settings.metadata.twitter.site,
    creator: settings.metadata.twitter.creator,
    title: settings.metadata.twitter.title,
    description: settings.metadata.twitter.description,
    images: [settings.metadata.twitter.image],
  },
  alternates: {
    canonical: settings.metadata.canonical,
  },
}

export default function Page() {
  return <PortfolioClientPage settings={settings} />
}
