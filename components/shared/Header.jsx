"use client"
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

const createUrl = (pathname, params) => {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;
    return `${pathname}${queryString}`;
};

export const Header = ({ settings, data }) => {
    const { globalTitle } = settings?.data ?? {};
    const { about, directors } = data?.data ?? {};
    const [filters, setFilters] = useState([]);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateSearchParams = (value) => {
        const optionSearchParams = new URLSearchParams(searchParams.toString());
        optionSearchParams.set("filters", value);
        const optionUrl = createUrl(pathname, optionSearchParams);
        router.replace(optionUrl, { scroll: false });
    };

    const removeSearchParams = (value) => {
        const optionSearchParams = new URLSearchParams(searchParams.toString());
        optionSearchParams.delete(value);
        const optionUrl = createUrl(pathname, optionSearchParams);
        router.replace(optionUrl, { scroll: false });
    };

    useEffect(() => {
        if (filters.length === 0) {
            removeSearchParams("filters")
        } else {
            updateSearchParams(filters)
        }
    }, [filters])

    return (
        <header className={"sticky top-0 w-screen mb-[6em] grid grid-cols-18 gap-5 z-50"}>
            <h1 className={"col-span-5 md:col-span-6"}>{globalTitle}</h1>
            <Collapsible title={"about"} className={"col-start-6 md:col-start-12"} >{<PortableText value={about} />}</Collapsible >
            <Collapsible title={"directors"}>
                <form>
                    <ul>
                        {directors.map((director) => {
                            const { _id, name, slug } = director;
                            return (
                                <li key={_id} className={clsx(filters.includes(slug) || filters.length === 0 ? "opacity-100" : "opacity-30")}>
                                    <input
                                        type={"checkbox"}
                                        id={slug}
                                        value={slug}
                                        name={"filter-query"}
                                        className={"peer hidden"}
                                        defaultChecked={false}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFilters([
                                                    ...filters,
                                                    slug,
                                                ]);
                                            } else {
                                                setFilters(
                                                    filters.filter((tag) => tag !== slug),
                                                );
                                            }
                                        }}
                                    />
                                    <label htmlFor={slug} className={"cursor-pointer"}>
                                        {name}
                                    </label>
                                </li>
                            )
                        })}
                    </ul>
                </form>
            </Collapsible >
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
                {children}
            </div>
        </details>
    )
}