"use client"
import { Suspense, useEffect, useState } from "react";
import { Projects } from './Projects'
import { useStore } from "@/app/state";
import dynamic from 'next/dynamic'
 
const Splashscreen = dynamic(() => import('@/components/shared/Splashscreen'), { ssr: false })

export function HomePage({data}) {
  const { sections = [] } = data ?? {};
  const [splashscreenVisible, setSplashscreenVisible] = useState(true);
  const activeVideo = useStore((store) => store.activeVideo)
  const setActiveVideo = useStore((store) => store.setActiveVideo)

  useEffect(() => {
    const hideSplash = () => setSplashscreenVisible(false);
    window.addEventListener("click", hideSplash);
    return () => window.removeEventListener("click", hideSplash);
  }, []);

  

  return (
    <>
      <Suspense>
        <Splashscreen data={data} splashscreenVisible={splashscreenVisible} />
      </Suspense>
      <div className={"[&>section:not(:first-of-type)>h1]:mt-[2.2em]"}>
        {sections.map((section) => {
          const { _id, projects = [] } = section;
          if (!projects) {
            return null;
          }
          return (
            <Projects key={_id} data={section} setSplashscreenVisible={setSplashscreenVisible} activeVideo={activeVideo} setActiveVideo={setActiveVideo}/>
          )
        })}
      </div>
    </>
  )
}

export default HomePage
