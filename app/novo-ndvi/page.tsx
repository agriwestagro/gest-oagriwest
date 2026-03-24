"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NovoNDVI() {
  const [form, setForm] = useState({
    propriedade: "",
    data: "",
    ndvi_medio: "",
    observacao: "",
    mapa_link: ""
  });

  async function salvar() {
    await supabase.from("ndvi").insert([form]);

    alert("Registro NDVI salvo!");
    
    setForm({
      propriedade: "",
      data: "",
      ndvi_medio: "",
      observacao: "",
      mapa_link: ""
    });
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Novo Registro NDVI / Drone</h1>

      <br />

      Propriedade

      <br />

      <input
        value={form.propriedade}
        onChange={(e) =>
          setForm({ ...form, propriedade: e.target.value })
        }
      />

      <br /><br />

      Data

      <br />

      <input
        type="date"
        value={form.data}
        onChange={(e) =>
          setForm({ ...form, data: e.target.value })
        }
      />

      <br /><br />

      NDVI médio

      <br />

      <input
        value={form.ndvi_medio}
        onChange={(e) =>
          setForm({ ...form, ndvi_medio: e.target.value })
        }
      />

      <br /><br />

      Observação

      <br />

      <textarea
        value={form.observacao}
        onChange={(e) =>
          setForm({ ...form, observacao: e.target.value })
        }
      />

      <br /><br />

      Link do mapa

      <br />

      <input
        value={form.mapa_link}
        onChange={(e) =>
          setForm({ ...form, mapa_link: e.target.value })
        }
      />

      <br /><br />

      <button onClick={salvar}>
        Salvar NDVI
      </button>
    </div>
  );
}