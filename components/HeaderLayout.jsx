"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useStore } from "@/app/state";
import { CustomPortableText } from "@/components/CustomPortableText";

const createUrl = (pathname, params) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
};
export default function HeaderLayout({ data }) {
  const { title, about = [], sectionOrder = [] } = data ?? {};
  const [filters, setFilters] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setActiveVideo = useStore((store) => store.setActiveVideo);

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
      removeSearchParams("filters");
    } else {
      updateSearchParams(filters);
    }
  }, [filters]);

  return (
    <header
      className={clsx(
        "sticky top-0 w-screen mb-[5em] grid-cols-18 gap-5 z-50 p-4 font-serif font-sm",
        "flex flex-col md:grid",
      )}
    >
      <a className={"col-span-5 md:col-span-6 text-left w-max link"} href={"/"}>
        <h1>{title}</h1>
      </a>
      <Collapsible title={"about"} className={"col-start-6 md:col-start-[15]"}>
        {<CustomPortableText value={about} />}
      </Collapsible>
      <div className="col-span-full row-start-2 flex gap-4">
        {sectionOrder.map((section) => {
          return section?.slug ? (
            <a
              key={section._id}
              href={`/${section?.slug?.current}`}
              className={"relative link"}
            >
              <h2
                className={clsx(
                  "relative",
                  pathname === `/${section?.slug?.current}` &&
                    "before:content-['['] before:absolute before:-translate-x-[0.35rem] after:content-[']'] after:absolute after:right-0 after:translate-x-[0.35rem]",
                )}
              >
                {section.title}
              </h2>
            </a>
          ) : null;
        })}
      </div>
      {/* <Collapsible title={"directors"}>
                <form>
                    <ul >
                        {directors.map((director) => {
                            const { _id, name, slug } = director;
                            return (
                                <li key={_id} className={clsx(filters.includes(slug) || filters.length === 0 ? "opacity-100" : "opacity-30", "leading-none mb-[1em]")}
                                >
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
                                    <label htmlFor={slug} className={"cursor-pointer lowercase"}>
                                        {name}
                                    </label>
                                </li>
                            )
                        })}
                    </ul>
                </form>
            </Collapsible > */}
    </header>
  );
}

const Collapsible = ({ title, children, className }) => {
  return (
    <details
      className={clsx(
        "relative col-span-3 md:h-[1em] details-popover",
        className,
      )}
      onClick={(e) => {
        const details = [...document.querySelectorAll("details")];
        if (!details.some((f) => f.contains(e.target))) {
          details.forEach((f) => f.removeAttribute("open"));
        } else {
          details.forEach((f) =>
            !f.contains(e.target) ? f.removeAttribute("open") : "",
          );
        }
      }}
    >
      <summary className={"w-max cursor-pointer link"}>
        <h2 className={"font-bold md:px-1 md:font-normal"}>{title}</h2>
      </summary>
      <div
        className={clsx(
          "relative w-full pt-[1em] bg-white [&>p]:leading-none",
          "md:absolute md:pt-[6em] md:p-1",
        )}
      >
        {children}
      </div>
    </details>
  );
};
