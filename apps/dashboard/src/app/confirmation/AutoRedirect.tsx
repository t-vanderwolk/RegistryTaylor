'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/member");
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
