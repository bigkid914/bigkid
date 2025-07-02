import clsx from "clsx";
import { Image } from "@/components/Image";
import { useEffect, useRef, useState } from "react";
import { Metadata } from "@/components/Metadata";

export const Photo = ({ data, showAll, previewVisible }) => {    

    const [containerWidth, setContainerWidth] = useState(null);
    const [containerHeight, setContainerHeight] = useState(null);
    const metadataContainerRef = useRef(null);

    const metadata = data?.photos[0]?.metadata;

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

    return (
        <div className={clsx(
            "relative md:absolute",
            "w-full max-w-[90rem] md:w-[calc(75vw-2rem)]",
            "h-auto md:h-[calc(100vh-8.5rem)]",
            "md:right-4 md:top-[136px] pointer-events-none flex-col",
            showAll ? "block md:flex" : "hidden md:flex")}>
            <div className={"flex flex-col gap-4 pb-4"}>
                {data?.photos && data.photos.map((photo, index) => {
                    const { _id, crop, hotspot, alt } = photo;
                    if (!showAll && index > 0) {
                        return null;
                    }
                    return (
                        <article className={clsx("relative pointer-events-none max-h-[80%]", ((previewVisible && index === 0) || showAll) ? "visible" : "invisible")} key={_id}>
                            {_id ? <Image
                                _id={_id}
                                crop={crop}
                                hotspot={hotspot}
                                alt={alt}
                                sizes={"(max-width: 767px) 100vw, (min-width: 768px) 50vw"}
                                width={1500}
                                className={"object-cover bg-current"}
                            /> : null}
                        </article>
                    )
                })}</div>
            <div className={clsx("w-full flex-1 bottom-0 right-0 pointer-events-none z-10 px-20 py-4")} >
                <div className={"relative w-full h-full"} ref={metadataContainerRef}>
                    {previewVisible && <div className={"relative w-full h-full"}>
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{metadata.extension}</Metadata>
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{formatBytes(metadata.size)}</Metadata>
                        <Metadata containerHeight={containerHeight} containerWidth={containerWidth}>{metadata.dimensions}</Metadata>

                    </div>}
                </div>
            </div>
        </div>
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