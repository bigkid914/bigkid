'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

export const VideoPlayer = forwardRef(({ url, playing = true, loop = true, controls = false, muted = true, className, onProgress }, ref) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return isLoaded ? (
    <ReactPlayer
      ref={ref}
      url={url}
      width={'100%'}
      height={'100%'}
      controls={controls}
      playing={playing}
      muted={muted}
      playsinline
      loop={loop}
      className={className}
      onProgress={onProgress}
    />
  ) : null
})
