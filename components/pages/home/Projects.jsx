"use client"
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Slider from 'react-input-slider';
import ReactPlayer from 'react-player/file'
import clsx from "clsx";

export const Projects = ({ data, setSplashscreenVisible }) => {
    const { title, projects = [] } = data ?? {};
    const [activeVideo, setActiveVideo] = useState(null)
    return (
        <section className={"flex flex-col"}>
            <motion.h1
                className={"font-bold leading-none h-[2em]"}
                initial={{ opacity: 1 }}
                animate={(activeVideo === null) ? { opacity: 1 } : { opacity: 0 }}
            >
                {title}
            </motion.h1>
            {projects.map((project) => {
                const { _key } = project ?? {};
                return (
                    <Project key={_key} data={project} activeVideo={activeVideo} setActiveVideo={setActiveVideo} setSplashscreenVisible={setSplashscreenVisible} />
                )
            })}
        </section>
    )
}

const Project = ({ data, activeVideo, setActiveVideo, setSplashscreenVisible }) => {
    const { _key, title } = data ?? {};
    const [previewVisible, setPreviewVisible] = useState(false)

    const isActive = activeVideo === _key
    const otherIsActive = (activeVideo !== _key && activeVideo !== null)

    const handleHoverOn = () => {
        const details = [...document.querySelectorAll("details")];
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
        const details = [...document.querySelectorAll("details")];
        details.forEach((f) => f.removeAttribute("open"));
        if (activeVideo === _key) {
            setActiveVideo(null)
        } else {
            setActiveVideo(_key)
        }
    }

    return (
        <motion.div className={"w-full grid grid-cols-18 h-[2em] overflow-visible gap-x-5"} initial={{ opacity: 1 }}
            animate={(activeVideo === null || isActive) ? { opacity: 1 } : { opacity: 0 }}>
            <div className={"col-span-6"}>
                <button className={"relative w-max link h-[2em] inline-flex"}
                    onMouseEnter={handleHoverOn}
                    onMouseLeave={handleHoverOff}
                    onFocus={handleHoverOn}
                    onBlur={handleHoverOff}
                    onClick={handleClick}
                >
                    <h2 className={"h-full flex-start"}>{title}</h2>
                </button>
            </div>
            {!isActive && <PreviewPlayer data={data} previewVisible={previewVisible} />}
            {isActive && <FullPlayer data={data} />}
        </motion.div>
    )
}

const PreviewPlayer = ({ data, previewVisible }) => {
    const { previewVideo, previewWidth, previewHeight, size, date, fps } = data;

    const [containerWidth, setContainerWidth] = useState(null);
    const [containerHeight, setContainerHeight] = useState(null);
    const metadataContainerRef = useRef(null);
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        if (!metadataContainerRef.current) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            if (metadataContainerRef.current.offsetWidth !== containerWidth) {
                setContainerWidth(metadataContainerRef.current.offsetWidth);
            }
            if (metadataContainerRef.current.offsetHeight !== containerHeight) {
                setContainerHeight(metadataContainerRef.current.offsetHeight);
            }
        });
        resizeObserver.observe(metadataContainerRef.current);
        return function cleanup() {
            resizeObserver.disconnect();
        };
    }, [metadataContainerRef.current]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevState) => prevState + 1)
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!previewVisible) {
            setCounter(0)
        }
    }, [previewVisible])

    return (
        <>
            <article className={clsx("relative col-span-16 col-start-7 pointer-events-none", previewVisible ? "visible" : "invisible")}>
                <div className={"absolute w-full -z-10"}>
                    <div className={"w-full border border-black flex items-center justify-center"} style={{ aspectRatio: previewWidth / previewHeight }}>
                        <p>loading</p>
                    </div>
                </div>
                <VideoPlayer
                    url={previewVideo}
                    width={'100%'}
                    height={'100%'}
                    controls={false}
                    playing={previewVisible ? true : false}
                    muted={true}
                    playsinline
                    loop={true}
                    className={"w-full"}
                />
            </article>
            <div className={clsx("absolute w-screen h-screen top-0 left-0 pointer-events-none z-10 p-20 grid grid-cols-18")} >
                <div className={"relative w-full h-full col-span-16 col-start-4"} ref={metadataContainerRef}>
                    {previewVisible && <div className={"relative w-full h-full"}>
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{new Date(date).toLocaleDateString("en-US", {
                            day: "numeric",
                            year: "2-digit",
                            month: "numeric",
                        })}</Metadata>
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{`${fps}fps`}</Metadata>
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{formatBytes(size)}</Metadata>
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{formatTime(counter)}</Metadata>
                    </div>}
                </div>
            </div>
        </>
    )
}

const Metadata = ({ children, containerHeight, containerWidth }) => {
    const top = useRef(Math.floor(Math.random() * containerHeight))
    const left = useRef(Math.floor(Math.random() * containerWidth))

    const variants = {
        initial: {
            top: top.current,
            left: left.current,
            y: "-50%",
            x: "-50%",
        },
    };
    return (
        <motion.p
            initial={"initial"}
            animate={"initial"}
            variants={variants}
            className={"absolute w-max"}
        >
            {children}
        </motion.p>
    );
};

const FullPlayer = ({ data }) => {
    const { fullVideo, fullWidth, fullHeight } = data;
    const videoPlayerRef = useRef(null);
    const [slider, setSlider] = useState({ x: 0 });
    const [seeking, setSeeking] = useState(false);
    const [playing, setPlaying] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const progressHandler = (state) => {
        if (!seeking) {
            setSlider({ x: state.played * 100 });
        }
    };

    const seekHandler = ({ x }) => {
        setSlider({ x })
        videoPlayerRef.current.seekTo(parseFloat(x / 100));
    };

    return (
        <article className={"relative col-span-16 col-start-7 pointer-events-none"} >
            <div className={"absolute w-full pointer-events-auto"}>
                <div className={"w-full border border-black flex items-center justify-center -z-10"} style={{ aspectRatio: fullWidth / fullHeight }}>
                    <p>loading</p>
                </div>
                <motion.div
                    className={"w-full flex items-center gap-5 pointer-events-auto mt-[1em] mb-5 z-50"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button className={"leading-none link w-10"} onClick={() => setPlaying((prevState) => !prevState)}>{playing ? "pause" : "play"}</button>
                    <Slider
                        axis={"x"}
                        x={slider.x}
                        onChange={seekHandler}
                        onDragStart={() => setSeeking(true)}
                        onDragEnd={() => setSeeking(false)}
                        styles={{
                            track: {
                                width: "100%",
                                backgroundColor: "black",
                                height: "1px",
                                borderRadius: 0
                            },
                            active: {
                                backgroundColor: "black"
                            },
                            thumb: {
                                width: 1,
                                height: 15,
                                borderRadius: 0,
                                borderColor: "black",
                                border: "1px",
                                background: "black",
                                boxShadow: "none"
                            },
                            disabled: {
                                opacity: 0.5
                            }
                        }}
                    />
                    <div className={"leading-none"} >-00:00:00</div>

                </motion.div>
            </div>
            <div className={"relative w-full"} >
                {isLoaded && <ReactPlayer
                    ref={videoPlayerRef}
                    url={fullVideo}
                    width={'100%'}
                    height={'100%'}
                    controls={false}
                    playing={playing}
                    muted={false}
                    playsinline
                    loop={false}
                    onProgress={progressHandler}
                    className={"w-full"}
                />}
            </div>
        </article>
    )
}

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0b'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}

const formatTime = (seconds) =>
    new Date(seconds * 1000).toLocaleTimeString('en-GB', {
        timeZone: 'Etc/UTC',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });