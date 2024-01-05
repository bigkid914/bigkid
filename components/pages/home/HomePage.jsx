"use client"
import { Suspense, useEffect, useState } from "react";
import { Projects } from './Projects'
import { Splashscreen } from "@/components/shared/Splashscreen";

export function HomePage({ data }) {
  const { sections = [] } = data?.data ?? {};
  const [splashscreenVisible, setSplashscreenVisible] = useState(true);

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
      <div>
        {sections.map((section) => {
          const { _id, projects = [] } = section;
          if (!projects) {
            return null;
          }
          return (
            <Projects key={_id} data={section} setSplashscreenVisible={setSplashscreenVisible} />
          )
        })}
      </div>
    </>
  )
}

export default HomePage
