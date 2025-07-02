"use client";
import { Image } from "@/components/shared/Image";
import clsx from "clsx";
import { useRef } from "react";

export default function Splashscreen({ data, splashscreenVisible }) {
  const { splashscreens = [] } = data ?? {};
  const logo = useRef(
    splashscreens[Math.floor(Math.random() * splashscreens.length)],
  );

  if (!splashscreenVisible) {
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
};
