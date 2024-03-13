import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Slider from 'react-input-slider';
import ReactPlayer from 'react-player/file'

export const FullPlayer = ({ data }) => {
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

