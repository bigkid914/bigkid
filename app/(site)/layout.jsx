import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { Suspense } from "react"
import { Header } from "@/components/header"
const VisualEditing = dynamic(() => import('@/sanity/loader/VisualEditing'))

// export async function generateMetadata() {
//   const [{ data: settings }, { data: homePage }] = await Promise.all([
//     loadSettings(),
//     loadHomePage(),
//   ])

//   const ogImage = urlForOpenGraphImage(settings?.ogImage)
//   return {
//     title: homePage?.title
//       ? {
//         template: `%s | ${homePage.title}`,
//         default: homePage.title || 'Personal website',
//       }
//       : undefined,
//     description: homePage?.overview
//       ? toPlainText(homePage.overview)
//       : undefined,
//     openGraph: {
//       images: ogImage ? [ogImage] : [],
//     },
//   }
// }

export const viewport = {
  themeColor: '#000',
}

export default async function LayoutRoute(props) {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className={"min-h-screen w-screen overflow-x-hidden p-4 font-serif font-sm bg-white"}>
        {props.children}
      </main>
      {draftMode().isEnabled && <VisualEditing />}
    </>
  )
}
