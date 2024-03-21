// 'use client'

// import { useSettings } from '@/sanity/loader/useQuery'
// import HeaderLayout from './Header'

// export default function HeaderPreview(props) {
//   const { data } = useSettings(props.initial)

//   return <HeaderLayout data={data} />
// }

'use client'


import {  headerQuery } from '@/sanity/lib/queries'
import { useQuery } from '@/sanity/loader/useQuery'

import Header from './HeaderLayout'


export default function HeaderPreview(props) {
  const { initial } = props
  const { data, encodeDataAttribute } = useQuery(
    headerQuery,
    {},
    { initial },
  )

  if (!data) {
    return (
      <div className="text-center">
        Please start editing your Home document to see the preview!
      </div>
    )
  }

  return <Header data={data} encodeDataAttribute={encodeDataAttribute} />
}