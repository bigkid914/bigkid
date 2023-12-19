import { Stack, Button, Grid, Label, Text } from "@sanity/ui"
import { createElement, useCallback } from "react"
import { LINK_TYPES } from "./linkWithSelector"
import { set } from "sanity"
import clsx from "clsx"

export function LinkInput(props) {
  const { value, onChange } = props

  const handleClick = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value
      onChange(set(nextValue))
    },
    [onChange],
  )

  return (
    <ul role="list" className={"flex flex-col gap-2"}>
      {LINK_TYPES.map((link) => (
        <li key={link.value} className="w-full">
          <button
            className={clsx(
              "w-full h-12 flex justify-center rounded-md shadow-sm group",
              value === link.value ? "bg-blue-500" : "bg-gray-200",
            )}
            value={link.value}
            onClick={handleClick}
          >
            <div
              className={clsx(
                "flex w-14 h-11 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium ",
                value === link.value ? "text-white" : "text-black",
              )}
            >
              {createElement(link.icon)}
            </div>
            <div
              className={
                "pt-0.5 h-12 flex flex-1 text-left justify-between truncate rounded-r-md border-b border-r border-t bg-white border-gray-200 group-hover:bg-gray-100"
              }
            >
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <Label>{link.title}</Label>
                <p className="text-gray-500 text-xs mt-1">{link.description}</p>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
