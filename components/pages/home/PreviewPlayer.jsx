import { Metadata } from "@/components/pages/home/Metadata";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";


export const PreviewPlayer = ({ data, previewVisible }) => {
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
                        {/* <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{formatBytes(size)}</Metadata> */}
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{formatTime(counter)}</Metadata>
                    </div>}
                </div>
            </div>
        </>
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