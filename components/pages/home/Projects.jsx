"use client"
import { PreviewPlayer } from "@/components/pages/home/PreviewPlayer";
import { FullPlayer } from "@/components/pages/home/FullPlayer";
import { PhotoGallery } from "@/components/pages/home/PhotoGallery";
import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export const Projects = ({ data, setSplashscreenVisible, activeVideo, setActiveVideo }) => {
    const { title, projects = [] } = data ?? {};
    if (projects.length === 0) {
        return null
    }
    return (
        <section className={"w-full flex flex-col  lowercase md:w-1/4 leading-none [&>div:not(:last-child)>button]:pb-4 mb-4"}>

            {projects.map((project) => {
                    const { _key, _type, fullVideo, previewVideo } = project ?? {};
                    if (_type === "videoObject" && (!fullVideo || !previewVideo)) {
                        return null
                    }
                    return (
                        <Project key={_key} data={project} activeVideo={activeVideo} setActiveVideo={setActiveVideo} setSplashscreenVisible={setSplashscreenVisible} />
                    )
                })}
        </section>
    )
}

const Project = ({ data, activeVideo, setActiveVideo, setSplashscreenVisible }) => {
    const { _key, _type, title } = data ?? {};
    const [previewVisible, setPreviewVisible] = useState(false);

    const isActive = activeVideo === _key
    const otherIsActive = (activeVideo !== _key && activeVideo !== null)

    const handleHoverOn = () => {
        const details = [...document.querySelectorAll(".details-popover")];
        details.forEach((f) => f.removeAttribute("open"));
        setSplashscreenVisible(false);
        if (activeVideo === null) {
            setPreviewVisible(true);
        }
    }

    const handleHoverOff = () => {
        if (isActive || otherIsActive) {
            return
        }
        setPreviewVisible(false);
        setActiveVideo(null)
    }

    const handleClick = () => {
        const details = [...document.querySelectorAll(".details-popover")];
        details.forEach((f) => f.removeAttribute("open"));
        setPreviewVisible(false)
        if (activeVideo === _key) {
            setActiveVideo(null);

        } else {
            setActiveVideo(_key)
        }
    }

    return (
        <motion.div
            className={"w-full"}
            initial={{ opacity: 1 }}
            animate={(activeVideo === null || isActive) ? { opacity: 1 } : { opacity: 0.3 }}
        >

            <button className={"relative w-max max-w-full leading-none text-left link inline-flex text-black hover:text-theme-blue"}
                onMouseEnter={handleHoverOn}
                onMouseLeave={handleHoverOff}
                onFocus={handleHoverOn}
                onBlur={handleHoverOff}
                onClick={handleClick}
            >
                <motion.h2 className={"h-full flex-start lowercase"} initial={{ color: "inherit" }}
                    animate={(isActive) ? { color: "blue" } : { color: "inherit" }}>{title}</motion.h2>
            </button>

            {!isActive && (
                <div className={"hidden md:flex absolute w-3/4 h-[calc(100vh-8.5rem)] right-4 pl-4 top-[136px] max-w-[90rem] flex-col pointer-events-none"}>
                    {_type === "projectObject" ? <PreviewPlayer data={data} previewVisible={previewVisible} />
                        : <PhotoGallery showAll={false} data={data} previewVisible={previewVisible}/>}
                </div>)
            }
            {isActive && <div className={clsx("   md:pr-0  md:right-4 md:pl-4 md:top-[136px] pointer-events-none  ", "relative md:absolute", "w-full md:w-3/4")}>
                {_type === "projectObject" ? <FullPlayer data={data} previewVisible={previewVisible} />
                    :  <PhotoGallery showAll={true} data={data} previewVisible={previewVisible}/>}
            </div>}
        </motion.div>
    )
}



