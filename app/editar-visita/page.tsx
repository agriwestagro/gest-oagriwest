"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

export default function EditarVisita() {
  const params = useSearchParams();
  const id = params.get("id");

  const [visita, setVisita] = useState<any>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await supabase
      .from("visitas")
      .select("*")
      .eq("id", id)
      .single();

    setVisita(data);
  }

  async function salvar() {
    await supabase
      .from("visitas")
      .update(visita)
      .eq("id", id);

    alert("Visita atualizada com sucesso!");
  }

  if (!visita) return <div>Carregando...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Editar Visita</h1>

      <br />

      Propriedade
      <br />
      <input
        value={visita.propriedade || ""}
        onChange={(e) =>
          setVisita({ ...visita, propriedade: e.target.value })
        }
      />

      <br /><br />

      Talhão
      <br />
      <input
        value={visita.talhao || ""}
        onChange={(e) =>
          setVisita({ ...visita, talhao: e.target.value })
        }
      />

      <br /><br />

      Cultura
      <br />
      <input
        value={visita.cultura || ""}
        onChange={(e) =>
          setVisita({ ...visita, cultura: e.target.value })
        }
      />

      <br /><br />

      Data da visita
      <br />
      <input
        type="date"
        value={visita.data_visita || ""}
        onChange={(e) =>
          setVisita({ ...visita, data_visita: e.target.value })
        }
      />

      <br /><br />

      Status
      <br />
      <input
        value={visita.status || ""}
        onChange={(e) =>
          setVisita({ ...visita, status: e.target.value })
        }
      />

      <br /><br />

      Observação
      <br />
      <textarea
        value={visita.observacao || ""}
        onChange={(e) =>
          setVisita({ ...visita, observacao: e.target.value })
        }
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      Foto 1 (link)
      <br />
      <input
        value={visita.foto1 || ""}
        onChange={(e) =>
          setVisita({ ...visita, foto1: e.target.value })
        }
      />

      <br /><br />

      Foto 2 (link)
      <br />
      <input
        value={visita.foto2 || ""}
        onChange={(e) =>
          setVisita({ ...visita, foto2: e.target.value })
        }
      />

      <br /><br />

      Mensagem enviada ao produtor
      <br />
      <textarea
        value={visita.mensagem_produtor || ""}
        onChange={(e) =>
          setVisita({ ...visita, mensagem_produtor: e.target.value })
        }
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      <button onClick={salvar}>
        Salvar alterações
      </button>
    </div>
  );
}