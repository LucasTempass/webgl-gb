"use client";

import dynamic from "next/dynamic";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  return <CanvasLazy />;
}
