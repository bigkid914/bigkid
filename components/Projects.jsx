"use client";
import { Player } from "@/components/Player";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/app/state";
import { Photo } from "@/components/Photo";

export const Projects = ({ data }) => {
  const activeVideo = useStore((store) => store.activeVideo);
  const setActiveVideo = useStore((store) => store.setActiveVideo);
  const setSplashscreenVisible = useStore(
    (store) => store.setSplashscreenVisible,
  );

  const { projects = [] } = data ?? {};

  if (projects.length === 0) {
    return null;
  }
  return (
    <section
      className={
        "w-full flex flex-col lowercase md:w-1/4 leading-none [&>div>button]:pb-4"
      }
    >
      {projects.map((project) => {
        const { _key, _type, fullVideo, previewVideo } = project ?? {};

        if (_type === "photoObject" || (fullVideo && previewVideo)) {
          return (
            <Video
              key={_key}
              data={project}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              setSplashscreenVisible={setSplashscreenVisible}
            />
          );
        }
      })}
    </section>
  );
};

const Video = ({
  data,
  activeVideo,
  setActiveVideo,
  setSplashscreenVisible,
}) => {
  const { _key, _type, title } = data ?? {};
  const [previewVisible, setPreviewVisible] = useState(false);

  const isActive = activeVideo === _key;
  const otherIsActive = activeVideo !== _key && activeVideo !== null;

  const handleHoverOn = () => {
    const details = [...document.querySelectorAll(".details-popover")];
    details.forEach((f) => f.removeAttribute("open"));
    setSplashscreenVisible(false);
    if (activeVideo === null) {
      setPreviewVisible(true);
    }
  };

  const handleHoverOff = () => {
    if (isActive || otherIsActive) {
      return;
    }
    setPreviewVisible(false);
    setActiveVideo(null);
  };

  const handleClick = () => {
    const details = [...document.querySelectorAll(".details-popover")];
    details.forEach((f) => f.removeAttribute("open"));
    setPreviewVisible(false);
    if (activeVideo === _key) {
      setActiveVideo(null);
    } else {
      setActiveVideo(_key);
    }
  };

  return (
    <motion.div
      className={"w-full"}
      initial={{ opacity: 1 }}
      animate={
        activeVideo === null || isActive ? { opacity: 1 } : { opacity: 0.3 }
      }
    >
      <button
        className={
          "relative w-max max-w-full leading-none text-left link inline-flex text-black hover:text-theme-blue"
        }
        onMouseEnter={handleHoverOn}
        onMouseLeave={handleHoverOff}
        onFocus={handleHoverOn}
        onBlur={handleHoverOff}
        onClick={handleClick}
      >
        <motion.h2
          className={"h-full flex-start lowercase"}
          initial={{ color: "inherit" }}
          animate={isActive ? { color: "blue" } : { color: "inherit" }}
        >
          {title}
        </motion.h2>
      </button>
      {_type === "projectObject" ? (
        <Player data={data} isActive={isActive} previewVisible={previewVisible} />
      ) : (
        <Photo data={data} showAll={isActive} previewVisible={previewVisible} />
      )}
    </motion.div>
  );
};
