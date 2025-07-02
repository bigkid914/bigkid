import { Metadata } from "@/components/Metadata";
import { VideoPlayer } from "@/components/VideoPlayer";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { stegaClean } from "next-sanity";
import Slider from 'react-input-slider';

export const Player = ({ data, isActive, previewVisible }) => {
    const { previewVideo, previewWidth, previewHeight, fullVideo, fullWidth, fullHeight, fullDuration, date, fps, director } = data;

    const [containerWidth, setContainerWidth] = useState(null);
    const [containerHeight, setContainerHeight] = useState(null);
    const metadataContainerRef = useRef(null);
    const [counter, setCounter] = useState(0);

    const videoPlayerRef = useRef(null);
    const [slider, setSlider] = useState({ x: 0 });
    const [seeking, setSeeking] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [progressing, setProgressing] = useState(false)

    const [time, setTime] = useState(fullDuration)

    useEffect(() => {
        if (!metadataContainerRef.current) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            if (metadataContainerRef?.current?.offsetWidth !== containerWidth) {
                setContainerWidth(metadataContainerRef?.current?.offsetWidth);
            }
            if (metadataContainerRef?.current?.offsetHeight !== containerHeight) {
                setContainerHeight(metadataContainerRef?.current?.offsetHeight);
            }
        });
        resizeObserver.observe(metadataContainerRef?.current);
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
        if (!playing || !progressing) {
            return
        }
        const interval = setInterval(() => {
            setTime((prevState) => prevState - 1)
        }, 1000);
        return () => clearInterval(interval);
    }, [playing, progressing]);

    useEffect(() => {
        if (!previewVisible) {
            setCounter(0)
        }
    }, [previewVisible])

    const progressHandler = (state) => {
        setProgressing(true);
        if (!seeking) {
            setSlider({ x: state.played * 100 });
        } else {
            setTime(fullDuration - Math.round(state.played * 100))
        }
    };

    const seekHandler = ({ x }) => {
        setSlider({ x })
        videoPlayerRef.current.seekTo(parseFloat(x / 100));
    };

    useEffect(() => {
        if (!playing) {
            setProgressing(false);
        }
    }, [playing])

    return (
        <div className={clsx(
            "relative md:absolute",
            "w-full max-w-[90rem] md:w-[calc(75vw-2rem)]",
            "h-auto md:h-[calc(100vh-8.5rem)]",
            "md:right-4 md:top-[136px] pointer-events-none flex-col",
            isActive ? "block md:flex" : "hidden md:flex")}>
            <article className={clsx("relative pointer-events-none max-h-[80%]")}>
                <div className={"relative h-full top-0 z-50"} >
                    <div className={clsx("", "relative h-full flex items-center justify-center ", previewVisible ? "invisible md:visible" : "invisible")} style={{ aspectRatio: previewWidth / previewHeight }}>
                        <VideoPlayer
                            url={stegaClean(previewVideo)}
                            width={'100%'}
                            height={'100%'}
                            controls={false}
                            playing={previewVisible ? true : false}
                            muted={true}
                            playsinline
                            loop={true}
                            className={"w-auto h-full"}
                            style={{ aspectRatio: stegaClean(previewWidth) / stegaClean(previewHeight) }}
                        />
                        <div className={"absolute w-full h-full top-0 -z-10"}>
                            <div className={"relative w-full h-full flex items-center justify-center border border-black"} >
                                <p>preview loading</p>
                            </div>
                        </div>
                    </div>
                    {isActive && <div className={clsx("absolute top-0 h-full flex items-center justify-center")} style={{ aspectRatio: stegaClean(fullWidth) / stegaClean(fullHeight) }}>
                        <VideoPlayer
                            ref={videoPlayerRef}
                            url={stegaClean(fullVideo)}
                            width={'100%'}
                            height={'100%'}
                            controls={false}
                            playing={playing}
                            muted={false}
                            playsinline
                            loop={false}
                            className={"w-auto h-full"}
                            style={{ aspectRatio: stegaClean(fullWidth) / stegaClean(fullHeight) }}
                            onProgress={progressHandler}

                        />
                        <div className={"absolute w-full h-full top-0 -z-10"}>
                            <div className={"relative w-full h-full flex items-center justify-center border border-black"} >
                                <p>video loading</p>
                            </div>
                        </div>
                    </div>}
                </div>
            </article>
            <div className={clsx("relative pointer-events-none z-10 max-h-[80%]")} >
                <div className={"relative h-full max-w-full md:aspect-[--aspect] "} style={{ "--aspect": stegaClean(previewWidth) / stegaClean(previewHeight) }}>
                    <div className={"relative w-full h-[20%] mt-4"} ref={metadataContainerRef}>
                        {previewVisible && <div className={clsx("hidden md:block", "relative w-full h-full")}>
                            <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{new Date(date).toLocaleDateString("en-US", {
                                day: "numeric",
                                year: "2-digit",
                                month: "numeric",
                            })}</Metadata>
                            <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{`${Math.trunc(fps)}fps`}</Metadata>
                            {/* <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{formatBytes(size)}</Metadata> */}
                            <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{formatTime(counter)}</Metadata>
                            <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{director}</Metadata>

                        </div>}
                        {isActive && <div className={"relative w-full h-full"}>
                            <div className={"w-full flex items-center gap-5 pointer-events-auto mt-[1em] mb-5 z-50"}  >
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
                                <div className={"leading-none"} >{`-${new Date(time * 1000).toISOString().slice(11, 19)}`}</div>
                            </div>

                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}



const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().slice(11, 19);