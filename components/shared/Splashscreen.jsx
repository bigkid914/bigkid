"use client"
import { Image } from "@/components/shared/Image";
import {  useRef } from "react";

export const Splashscreen = ({ data, splashscreenVisible }) => {
    const { splashscreens = [] } = data?.data ?? {};
    const logo = useRef(splashscreens[Math.floor(Math.random() * splashscreens.length)]);

    if (!splashscreenVisible) {
        return null
    };

    return (
        <div className={"fixed w-screen h-screen top-0 left-0 select-none pointer-events-none z-50 p-5"}>
            {logo.current?._id ? <Image
                id={logo.current._id}
                width={1000}
                mode={"contain"}
                alt={"bigkid logo"}
                className={"h-full w-full object-contain"}
                sizes={"100vw"}
            /> : null}
        </div>
    )
}