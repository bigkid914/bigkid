import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { Suspense } from "react"
import { Header } from "@/components/header"
const VisualEditing = dynamic(() => import('@/sanity/loader/VisualEditing'))

export const viewport = {
  themeColor: '#000',
}

export default async function LayoutRoute(props) {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className={"min-h-[calc(100vh-170px)] w-screen overflow-x-hidden px-4 pb-4 font-serif font-sm bg-white"}>
        {props.children}
      </main>
      {draftMode().isEnabled && <VisualEditing />}
    </>
  )
}
