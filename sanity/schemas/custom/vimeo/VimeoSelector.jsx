import Modal from "./Modal";
import { Dialog, Transition, Menu } from '@headlessui/react'
import { Button } from "@sanity/ui";
import clsx from "clsx";
import { ArrowDownAZ, ArrowDownZA, ArrowUpDown, ExternalLink, ListVideo, Play, Sunrise, Sunset, X, Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import pluralize from "pluralize";
import React, { Fragment, useRef, useState, useEffect } from "react";
import ReactPlayer from 'react-player'
import { useFormValue, useClient } from "sanity";

const createUrl = (pathname, params) => {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;
    return `${pathname}${queryString}`;
};

const validKeys = ["files", "uri", "stats", "name", "width", "height", "link", "duration", "release_time", "pictures"];


export const VimeoSelector = (props) => {
    const documentId = useFormValue(["_id"])
    const fieldValue = useFormValue([props.id])
    const fieldName = props.id
    let [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("default")
    const closeButtonRef = useRef(null);
    const searchParams = useSearchParams();
    const client = useClient({ apiVersion: "2021-06-07" });

    useEffect(() => {
        setStatus("loading");
        const getVideos = async () => {
            const data = await fetch('/api/fetch-vimeo', {
                method: 'POST',
                body: JSON.stringify({ params: new URLSearchParams(Array.from(searchParams.entries())).toString() })
            }).then(res => res.json())
            const posts = await data;
            setData(posts.data);
            setStatus("default");
        };
        getVideos();
    }, [searchParams]);

    return (
        <div className={"font-sans"}>
            {fieldValue ? <div className={"bg-[#101112] p-4 rounded mb-2"}>
                <div style={{ aspectRatio: `${fieldValue.width}/${fieldValue.height}` }}>
                    <VideoPlayer url={fieldValue.files.find((file) => file.quality === "hls")?.link} controls={true} playing={false} />
                </div>
                <VideoDetails data={fieldValue} />
            </div> : null}
            <Button
                fontSize={2}
                padding={3}
                text={fieldValue?.name ? "Update Video" : "Choose Video"}
                onClick={() => setOpen(true)}
                className={"w-full"}
                tone={fieldValue?.name ? "brand" : "primary"}
            />
            {open ? <Modal><div className={"fixed inset-0 z-[999] w-screen overflow-y-auto"}>
                <div className={"relative w-full h-full bg-[#101112] text-white flex flex-col"}>
                    <div className={"sticky top-0 flex justify-between items-center gap-x-6 bg-zinc-800 px-6 py-2.5 sm:px-3.5 z-50"}>
                        <div className={"flex-1 flex gap-8"}>
                            <Filter status={status} />
                            <Search />
                        </div>
                        <p className={"flex-1 text-sm leading-6 text-white text-center !mb-0"}>
                            <a href="#">
                                <strong className="font-semibold">Video Selector</strong>
                                <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                                    <circle cx={1} cy={1} r={1} />
                                </svg>
                                {pluralize('Videos', data?.total || 0, true)}
                            </a>
                        </p>
                        <div className={"flex-1 flex justify-end"}>
                            <button type={"button"} className={"-m-3 p-3"} onClick={() => setOpen(false)}
                                ref={closeButtonRef}>
                                <span className={"sr-only"}>Close</span>
                                <X className={"text-white"} aria-hidden={"true"} />
                            </button>
                        </div>
                    </div>
                    {status === "loading" ? <div className={"h-screen flex justify-center items-center"}>
                        <Spinner />
                    </div> : <ul role={"list"} className={"flex-1 bg-[#101112] grid grid-cols-2 p-4 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:gap-x-4"}>
                        {data.data.map((video) => {
                            return (
                                <Thumbnail data={video} key={video.uri} documentId={documentId} fieldName={fieldName} fieldValue={fieldValue} client={client} />
                            )
                        })}
                    </ul>}

                    <Pagination data={data} status={status} />
                </div>
            </div> </Modal> : null}
        </div>
    )
}

const Thumbnail = ({ data, documentId, fieldName, fieldValue, client }) => {
    const { files, pictures, height, width } = data;
    let [dialogOpen, setDialogOpen] = useState(false)
    const closeButtonRef = useRef(null);
    return (
        <>
            <li className={"h-max"}>
                <div className={"relative aspect-video block w-full overflow-hidden rounded-lg bg-gray-100"}>
                    <div className={"absolute flex gap-2 bottom-2 right-2"}>
                        <SelectVideo data={data} documentId={documentId} fieldName={fieldName} fieldValue={fieldValue} client={client} />
                        <button
                            type={"button"}
                            className={"rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 transition-colors flex gap-1 items-center justify-center"}
                            onClick={() => setDialogOpen(true)}
                        >
                            <Play size={15} strokeWidth={3} />
                        </button>
                    </div>
                    <img src={pictures?.base_link} alt={""} className={"pointer-events-none object-cover w-full h-full"} />
                </div>
                <VideoDetails data={data} />
            </li>
            <Transition.Root show={dialogOpen} as={Fragment}>
                <Dialog as={"div"} className={"relative z-[9999]"} initialFocus={closeButtonRef} onClose={setDialogOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter={"ease-out duration-300"}
                        enterFrom={"opacity-0"}
                        enterTo={"opacity-100"}
                        leave={"ease-in duration-200"}
                        leaveFrom={"opacity-100"}
                        leaveTo={"opacity-0"}
                    >
                        <div className={"fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity"} />
                    </Transition.Child>
                    <div className={"fixed inset-0 z-10 w-screen overflow-y-auto"}>
                        <div className={"flex min-h-full items-center justify-center p-4 text-center"}>
                            <Transition.Child
                                as={Fragment}
                                enter={"ease-out duration-300"}
                                enterFrom={"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
                                enterTo={"opacity-100 translate-y-0 sm:scale-100"}
                                leave={"ease-in duration-200"}
                                leaveFrom={"opacity-100 translate-y-0 sm:scale-100"}
                                leaveTo={"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
                            >
                                <Dialog.Panel className={"relative transform overflow-hidden rounded-xl bg-[#101112] p-4 text-left shadow-xl transition-all flex flex-col gap-4"}>
                                    <div className={"flex justify-between gap-8"}>
                                        <button
                                            type={"button"}
                                            className={"ml-auto text-white"}
                                            onClick={() => setDialogOpen(false)}
                                            ref={closeButtonRef}
                                        >
                                            <X />

                                        </button>
                                    </div>
                                    <div className={"w-[48rem] max-w-full"} style={{ aspectRatio: `${width}/${height}` }}>
                                        <VideoPlayer url={files.find((file) => file.quality === "hls")?.link} controls={true} autoplay={true} />
                                    </div>
                                    <VideoDetails data={data} />
                                    <SelectVideo data={data} documentId={documentId} fieldName={fieldName} fieldValue={fieldValue} client={client} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

const VideoDetails = ({ data }) => {
    const { name, link, duration, release_time, stats } = data;
    return (
        <div >
            <div className={"flex justify-between gap-2 mt-2"}>
                <p className={"pointer-events-none block truncate text-sm font-medium text-gray-100"}>{name}</p>
            </div>
            <div className={"flex gap-2 justify-between"}>
                <p className={"pointer-events-none block text-sm font-medium text-gray-500 !mb-0"}>
                    {new Date(release_time).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </p>
                <p className={"pointer-events-none block text-sm font-medium text-gray-500 !mb-0"}>
                    {new Date(duration * 1000).toLocaleTimeString('en-GB', {
                        timeZone: 'Etc/UTC',
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </p>
            </div>
            <div className={"flex gap-2 justify-between items-center"}>
                <p className={"pointer-events-none block text-sm font-medium text-gray-500 !mb-0"}>
                    {pluralize('plays', stats.plays, true)}
                </p>
                <div className={"block text-sm font-medium text-gray-500"}>
                    <a href={link} target={"_blank"} rel={"norefferer noopener"} className={"text-gray-500 hover:text-white transition-colors"}><ExternalLink size={18} /></a>
                </div>
            </div>
        </div>
    )
}

const SelectVideo = ({ data, documentId, fieldName, fieldValue, client }) => {
    const updateSelectedVideo = () => {
        const vimeoData = { ...data };
        Object.keys(vimeoData).forEach((key) => validKeys.includes(key) || delete vimeoData[key]);
        client
            .patch(documentId)
            .set({ [fieldName]: vimeoData })
            .commit()
            .catch((err) => {
                console.error('Uploading Vimeo data failed: ', err.message)
            })
    }

    const isSelected = fieldValue?.uri === data?.uri
    return (
        <button
            type={"button"}
            className={clsx("rounded px-2 py-1 text-sm font-semibold text-white hover:bg-zinc-500 transition-colors", isSelected ? "bg-green-500" : "bg-zinc-400")}
            onClick={() => updateSelectedVideo()}
        >
            {isSelected ? "Selected" : "Select"}
        </button>
    )
}

const Filter = ({ status }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentFilters = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));
    const validKeys = ['sort', 'direction'];
    Object.keys(currentFilters).forEach((key) => validKeys.includes(key) || delete currentFilters[key]);

    const updateSearchParams = (params) => {
        const newParams = new URLSearchParams(params);
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()))
        const combined = new URLSearchParams({
            ...Object.fromEntries(currentParams),
            ...Object.fromEntries(newParams),
        })
        const optionUrl = createUrl(pathname, combined.toString());
        router.replace(optionUrl, { scroll: false });
    };

    const filters = [
        {
            title: "Date (New to Old)",
            icon: <Sunrise size={15} />,
            params: { sort: "date", direction: "desc" },
        },
        {
            title: "Date (Old to New)",
            icon: <Sunset size={15} />,
            params: { sort: "date", direction: "asc" },
        },
        {
            title: "Alphabetical (A to Z)",
            icon: <ArrowDownAZ size={15} />,
            params: { sort: "alphabetical", direction: "asc" },
        },
        {
            title: "Alphabetical (Z to A)",
            icon: <ArrowDownZA size={15} />,
            params: { sort: "alphabetical", direction: "desc" },
        },
        {
            title: "Plays",
            icon: <ListVideo size={15} />,
            params: { sort: "plays", direction: "desc" },
        },
    ];

    const selectedFilter = Object.keys(currentFilters).length > 0 ? filters.find((f) => JSON.stringify(f.params) === JSON.stringify(currentFilters)).title : "Date (New to Old)"

    return (
        <Menu as={"div"} className={"relative inline-block text-left"}>
            <Menu.Button className={"flex items-center gap-2"} >
                <ArrowUpDown size={15} />
                <strong className={"font-semibold text-sm"}>{selectedFilter}</strong>
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {filters.map((filter, index) => {
                            const { title, icon, params } = filter;
                            return (
                                <Menu.Item key={title + index}>
                                    {({ active }) => (
                                        <button
                                            className={clsx(
                                                "w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 disabled:bg-zinc-300",
                                                active && "bg-gray-100 text-gray-900"
                                            )}
                                            disabled={status === "loading" ? true : false}
                                            onClick={() => updateSearchParams(params)}
                                        >
                                            {icon}
                                            <span>{title}</span>
                                        </button>
                                    )}
                                </Menu.Item>
                            )
                        })}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

const Search = () => {
    let [dialogOpen, setDialogOpen] = useState(false)
    const closeButtonRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentQuery = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));

    const updateSearchParams = (params) => {
        const newParams = new URLSearchParams(params);
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        const combined = new URLSearchParams({
            ...Object.fromEntries(currentParams),
            ...Object.fromEntries(newParams),
        });
        const optionUrl = createUrl(pathname, combined.toString());
        router.replace(optionUrl, { scroll: false });
    };

    const currentSearch = currentQuery?.query ? currentQuery?.query : ""

    return (
        <>
            <button
                className={"flex gap-2 items-center"}
                type={"button"}
                onClick={() => setDialogOpen(true)}
            >
                <SearchIcon size={15} strokeWidth={3} />
                <strong className={"font-semibold text-sm leading-none"}>Search</strong>
            </button>
            <Transition.Root show={dialogOpen} as={Fragment}>
                <Dialog as={"div"} className={"relative z-[9999]"} initialFocus={closeButtonRef} onClose={setDialogOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter={"ease-out duration-300"}
                        enterFrom={"opacity-0"}
                        enterTo={"opacity-100"}
                        leave={"ease-in duration-200"}
                        leaveFrom={"opacity-100"}
                        leaveTo={"opacity-0"}
                    >
                        <div className={"fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity"} />
                    </Transition.Child>
                    <div className={"fixed inset-0 z-10 w-screen overflow-y-auto"}>
                        <div className={"flex min-h-full items-center justify-center p-4 text-center"}>
                            <Transition.Child
                                as={Fragment}
                                enter={"ease-out duration-300"}
                                enterFrom={"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
                                enterTo={"opacity-100 translate-y-0 sm:scale-100"}
                                leave={"ease-in duration-200"}
                                leaveFrom={"opacity-100 translate-y-0 sm:scale-100"}
                                leaveTo={"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
                            >
                                <Dialog.Panel className={"relative transform overflow-hidden rounded-xl bg-[#101112] p-4 text-left shadow-xl transition-all flex flex-col"}>
                                    <div className={"flex justify-between"}>
                                        <label htmlFor={"search"} className={"block text-sm font-medium leading-6 text-white"}>
                                            Search
                                        </label>
                                        <button
                                            type={"button"}
                                            className={"ml-auto text-white"}
                                            onClick={() => setDialogOpen(false)}
                                            ref={closeButtonRef}
                                        >
                                            <X />
                                        </button>
                                    </div>
                                    <div>
                                        <div className={"relative flex items-center mt-2"}>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                updateSearchParams({ query: e.target.elements.search.value });
                                                setDialogOpen(false)
                                            }}  >
                                                <input
                                                    type={"text"}
                                                    name={"search"}
                                                    id={"search"}
                                                    className={"block rounded-md border-0 py-1.5 w-72 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"}
                                                    defaultValue={currentSearch}
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

const Pagination = ({ data, status }) => {
    const { page, total, per_page } = data;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateSearchParams = (params) => {
        const newParams = new URLSearchParams(params);
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()))
        const combined = new URLSearchParams({
            ...Object.fromEntries(currentParams),
            ...Object.fromEntries(newParams),
        })
        const optionUrl = createUrl(pathname, combined.toString());
        router.replace(optionUrl, { scroll: false });
    };

    return (
        <div className={"sticky bottom-0 flex justify-between items-center gap-x-6 bg-zinc-800 px-6 py-2.5 sm:px-3.5 z-50"}>
            <button className={"text-sm disabled:text-zinc-500"} disabled={(page === 1 || status === "loading") ? true : false} onClick={() => updateSearchParams({ page: page - 1 })}>Prev Page</button>
            <p className={"flex-1 text-sm leading-6 font-semibold text-white text-center !mb-0"}>
                Page {page}
            </p>
            <button
                className={"text-sm disabled:text-zinc-500"}
                disabled={(Math.ceil(total / per_page) === page || status === "loading") ? true : false}
                onClick={() => updateSearchParams({ page: page + 1 })}>
                Next Page
            </button>
        </div >
    )
}

const VideoPlayer = ({ url, playing = true, loop = true, controls = false, muted = true, className }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return isLoaded ? (
        <ReactPlayer
            url={url}
            width={'100%'}
            height={'100%'}
            controls={controls}
            playing={playing}
            muted={muted}
            playsinline
            loop={loop}
            className={className}
        />
    ) : null
}

export const Spinner = () => {
    const points = 8;
    const radius = 20;

    return (
        <div className={"w-full h-full flex justify-center items-center"}>
            <div className={"h-8 w-8 md:h-10 md:w-10 flex justify-center items-center"} >
                <div className={"animate-spin"}>
                    {Array(points)
                        .fill()
                        .map((_, index) => {
                            const x = radius * Math.cos((2 * Math.PI * index) / points);
                            const y = radius * Math.sin((2 * Math.PI * index) / points);
                            return (
                                <span
                                    key={index}
                                    className={"w-[6px] h-[6px] absolute bg-white rounded-full origin-center left-[calc(50%-3px)] top-[calc(50%-3px)] "}
                                    style={{ transform: `translate(${x}px, ${y}px)` }}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
