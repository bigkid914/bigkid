import { PortableText } from '@portabletext/react'
import Link from "next/link";

export function CustomPortableText({
  paragraphClasses,
  value,
}) {
  const components = {
    block: {
      normal: ({ children }) => {
        return <p className={paragraphClasses}>{children}</p>
      },
    },
    marks: {
      linkWithSelector: (props) => {
        const { value, children } = props;

        if (value.type === "external") {
          const str = value.externalLink;
          const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,})(\/[\w\.-]*)*\/?$/;
          const phonePattern = /^\+?(\d[-()\d ]+\d)$/;
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          const urlOutput = (href, children) => {
            return <a href={href} target={"_blank"} rel={"noopener noreferrer"} className={"link"}>
              {children}
            </a>
          }

          const emailPhoneOutput = (href, children) => {
            return <a href={href} className={"link"}>
              {children}
            </a>
          }

          if (str.startsWith('tel:') || str.startsWith('mailto:')) {
            return emailPhoneOutput(str, children)
          } else if (urlPattern.test(str)) {
            return urlOutput(str, children)
          } else if (phonePattern.test(str)) {
            return emailPhoneOutput(`tel:${str.replace(/[()\s-]/g, '')}`, children)
          } else if (emailPattern.test(str)) {
            return emailPhoneOutput(`mailto:${str}`, children)
          } else {
            return <span>{children}</span>;
          }


        } else {
          return (
            <Link
              href={`/${value?.slug}`}
              className={"w-max group link underline"}
            >
              {children}
            </Link>
          )
        }

      },
    },
  }

  return <PortableText components={components} value={value} />
}
