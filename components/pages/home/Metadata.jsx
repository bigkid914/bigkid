import React, { useRef } from 'react'
import { motion } from "framer-motion";

export const Metadata = ({ children, containerHeight, containerWidth }) => {
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
}