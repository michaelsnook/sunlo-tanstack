import { AppDataProvider } from 'app/app-data-provider'

export default function Layout({ params: { lang }, children }) {
  return <AppDataProvider lang={lang}>{children}</AppDataProvider>
}
