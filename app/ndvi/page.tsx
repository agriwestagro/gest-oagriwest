"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NDVI() {
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await supabase
      .from("ndvi")
      .select("*")
      .order("data", { ascending: false });

    if (data) setDados(data);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Histórico NDVI / Drone</h1>

      <br />

      {dados.map((d) => (
        <div
          key={d.id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 20,
            borderRadius: 8
          }}
        >
          <strong>{d.propriedade}</strong>

          <br />

          Data: {d.data}

          <br />

          NDVI médio: {d.ndvi_medio}

          <br /><br />

          Observação:

          <br />

          {d.observacao}

          <br /><br />

          {d.mapa_link && (
            <a href={d.mapa_link} target="_blank">
              🗺️ Abrir mapa
            </a>
          )}
        </div>
      ))}
    </div>
  );
}