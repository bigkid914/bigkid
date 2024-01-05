'use client'

import { useSettings } from '@/sanity/loader/useQuery'
import HeaderLayout from './HeaderLayout'

export default function HeaderPreview(props) {
  const { data } = useSettings(props.initial)

  return <HeaderLayout data={data} />
}