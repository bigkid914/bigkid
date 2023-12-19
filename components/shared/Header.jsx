"use client"
import { PortableText } from "@portabletext/react";
import clsx from "clsx";

export const Header = ({ settings, data }) => {
    const { globalTitle } = settings?.data ?? {};
    const { about } = data?.data ?? {};

    return (
        <header className={"relative w-screen mb-[6em] grid grid-cols-18 gap-5 z-50"}>
            <h1 className={"col-span-5 md:col-span-6"}>{globalTitle}</h1>
            <Collapsible title={"about"} className={"col-start-6 md:col-start-12"} >{about}</Collapsible >
            <Collapsible title={"directors"} >{about}</Collapsible >
        </header>
    )
}

const Collapsible = ({ title, children, className }) => {
    return (
        <details className={clsx("relative h-[1em] col-span-3", className)}
            onClick={(e) => {
                const details = [...document.querySelectorAll("details")];
                if (!details.some((f) => f.contains(e.target))) {
                    details.forEach((f) => f.removeAttribute("open"));
                } else {
                    details.forEach((f) =>
                        !f.contains(e.target) ? f.removeAttribute("open") : ""
                    );
                }
            }}>
            <summary className={"cursor-pointer link"}><h2 className={"px-1"}>{title}</h2></summary>
            <div className={"absolute w-full pt-[6em] p-1 bg-white [&>p]:leading-none"}>
                <PortableText value={children} />
            </div>
        </details>
    )
}