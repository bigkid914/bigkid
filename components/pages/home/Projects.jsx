"use client"
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Slider from 'react-input-slider';
import ReactPlayer from 'react-player/file'
import clsx from "clsx";

export const Projects = ({ data, setSplashscreenVisible, activeVideo, setActiveVideo }) => {
    const { title, projects = [] } = data ?? {};
    if (projects.length === 0) {
        return null
    }
    return (
        <section className={"w-full flex flex-col  lowercase md:w-1/4 [&>div]:mb-2"}>
            <motion.h1
                className={"font-bold leading-none mb-3"}
                initial={{ opacity: 1 }}
                animate={(activeVideo === null) ? { opacity: 1 } : { opacity: 0 }}
            >
                {title}
            </motion.h1>
            {projects.map((project) => {
                const { _key, fullVideo, previewVideo } = project ?? {};
                if (!fullVideo || !previewVideo) {
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
        <motion.div
            className={"w-full"}
            initial={{ opacity: 1 }}
            animate={(activeVideo === null || isActive) ? { opacity: 1 } : { opacity: 0 }}
        >
            <div>
                <button className={"relative w-max max-w-full leading-none text-left link  inline-flex text-black hover:text-theme-blue"}
                    onMouseEnter={handleHoverOn}
                    onMouseLeave={handleHoverOff}
                    onFocus={handleHoverOn}
                    onBlur={handleHoverOff}
                    onClick={handleClick}
                >
                    <motion.h2 className={"h-full flex-start lowercase"} initial={{ color: "inherit" }}
                        animate={(isActive) ? { color: "blue" } : { color: "inherit" }}>{title}</motion.h2>
                </button>
            </div>
            {!isActive && <div className={"hidden md:flex absolute w-3/4 h-[calc(100vh-8.5rem)] right-4 pl-4 top-[136px] max-w-[90rem] flex-col"}><PreviewPlayer data={data} previewVisible={previewVisible} /></div>}
            {isActive && <div className={"absolute w-[calc(100%-1rem)] pt-4 pr-4 md:pr-0 md:w-3/4 md:right-4 md:pl-4 md:top-[136px] md:pt-0"}><FullPlayer data={data} previewVisible={previewVisible} /></div>}
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
            <article className={clsx("relative pointer-events-none max-h-[80%]", previewVisible ? "visible" : "invisible")}>
                {/* <div className={"absolute w-full z-0"}>
                    <p>loading</p>
                </div> */}
                <VideoPlayer
                    url={previewVideo}
                    width={'100%'}
                    height={'100%'}
                    controls={false}
                    playing={previewVisible ? true : false}
                    muted={true}
                    playsinline
                    loop={true}
                    className={"w-auto h-full z-10 "}
                />
            </article>
            <div className={clsx("w-full flex-1 bottom-0 right-0 pointer-events-none z-10 px-20 py-4")} >
                <div className={"relative w-full h-full"} ref={metadataContainerRef}>
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
    if (top.current === 0 && left.current === 0) {
        return
    }
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
        <article className={"relative"} >
            <div className={"relative w-full pointer-events-auto"}>
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
            <div className={"absolute w-full top-0"} >
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