"use client";
import config from '@/sanity.config'

import { NextStudio } from "next-sanity/studio";

export function Wrapper() {
  return <NextStudio config={config} />;
}