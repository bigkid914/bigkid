import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { HomePage } from '@/components/pages/home/HomePage'
import {  loadHomePage, loadSettings } from '@/sanity/loader/loadQuery'
import { notFound } from "next/navigation"
const HomePagePreview = dynamic(
  () => import('@/components/pages/home/HomePagePreview'),
)

export async function generateMetadata() {
  const settings = await loadSettings()
  return {
    title: settings?.data?.globalTitle,
    description: settings?.data?.globalOverview
  }
}

export default async function IndexRoute({ searchParams }) {
  const filters = searchParams?.filters?.split(",") || [];
  const initial = await loadHomePage({ filters });

  if (draftMode().isEnabled) {
    return <HomePagePreview initial={initial} filters={filters} />
  }

  if (!initial.data) {
    return notFound()
  }

  return <HomePage data={initial}  />
}
