"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Cronograma() {

  const router = useRouter();
  const [dados, setDados] = useState<any[]>([]);
  const [aberto, setAberto] = useState<string | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await supabase
      .from("cronograma_semanal")
      .select("*")
      .order("data_limite", { ascending: true });

    setDados(data || []);
  }

  async function toggleRealizado(id: string, atual: boolean) {

    await supabase
      .from("cronograma_semanal")
      .update({ realizado: !atual })
      .eq("id", id);

    carregar();
  }

  return (

    <div style={{ padding: 30 }}>

      <h1>Cronograma</h1>

      <button onClick={()=>router.push("/cronograma/novo")}>
        + Novo
      </button>

      <div style={{ marginTop: 20 }}>

        {dados.map((item) => (

          <div key={item.id} style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            marginBottom: 10,
            padding: 15,
            background: "#fff"
          }}>

            {/* LINHA PRINCIPAL */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
              onClick={() => setAberto(aberto === item.id ? null : item.id)}
            >

              <div>
                <strong>{item.titulo}</strong> <br/>
                {item.propriedade} • {item.data_limite}
              </div>

              <input
                type="checkbox"
                checked={item.realizado}
                onChange={() => toggleRealizado(item.id, item.realizado)}
              />

            </div>

            {/* DETALHE */}
            {aberto === item.id && (

              <div style={{ marginTop: 10 }}>

                <p><strong>Motivo:</strong> {item.motivo}</p>
                <p><strong>Descrição:</strong> {item.descricao}</p>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}
