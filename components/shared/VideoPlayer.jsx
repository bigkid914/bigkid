'use client'

import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player/file'

export const VideoPlayer = ({ url, playing = true, loop = true, controls = false, muted = true, className }) => {
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
