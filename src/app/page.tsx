"use client";

import dynamic from "next/dynamic";

const HomeLazy = dynamic(() => import("@/app/home.tsx"), {
  ssr: false,
});

export default function Page() {
  return <HomeLazy />;
}
