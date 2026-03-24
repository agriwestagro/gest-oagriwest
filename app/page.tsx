"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Carregando...</h1>
    </div>
  );
}