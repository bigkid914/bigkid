"use client";
import { useStore } from "@/app/state";
import { Image } from "@/components/Image";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Splashscreen({ data }) {
  const { splashscreens = [] } = data ?? {};
  const [isClient, setIsClient] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const splashscreenVisible = useStore((store) => store.splashscreenVisible);
  const setSplashscreenVisible = useStore(
    (store) => store.setSplashscreenVisible,
  );

  useEffect(() => {
    setIsClient(true);
    // Check if splashscreen has already been shown in this session
    const splashShown = sessionStorage.getItem("splashscreen-shown");
    if (splashShown) {
      setHasBeenShown(true);
      setSplashscreenVisible(false);
    }
  }, [setSplashscreenVisible]);

  const logo = useRef(
    splashscreens[Math.floor(Math.random() * splashscreens.length)],
  );

  useEffect(() => {
    const hideSplash = () => {
      setSplashscreenVisible(false);
      setHasBeenShown(true);
      sessionStorage.setItem("splashscreen-shown", "true");
    };
    window.addEventListener("click", hideSplash);
    return () => window.removeEventListener("click", hideSplash);
  }, [setSplashscreenVisible]);

  if (!splashscreenVisible || !isClient || hasBeenShown) {
    return null;
  }

  return (
    <div
      className={
        "fixed w-screen h-screen top-0 left-0 select-none pointer-events-none z-[1000] p-5"
      }
    >
      {splashscreens.length > 0
        ? splashscreens.map((splashscreen) => (
            <Image
              key={splashscreen._id}
              _id={splashscreen._id}
              width={1000}
              mode={"contain"}
              alt={"bigkid logo"}
              className={clsx(
                "absolute inset-0 h-full w-full object-contain opacity-0",
                logo?.current?._id === splashscreen._id && "opacity-100",
              )}
              sizes={"100vw"}
              loading="eager"
            />
          ))
        : null}
    </div>
  );
}
