'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const destination = "/dashboard" as const;
      router.push(destination);
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
