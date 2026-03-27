"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function HistoricoSafra() {

  const [dados, setDados] = useState<any[]>([]);
  const [propriedades, setPropriedades] = useState<string[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    const { data, error } = await supabase
      .from("safras")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Erro ao carregar");
      return;
    }

    const lista = data || [];
    setDados(lista);

    const props = [...new Set(lista.map(d => d.propriedade))];
    setPropriedades(props);
  }

  const filtrado = filtro
    ? dados.filter(d => d.propriedade === filtro)
    : dados;

  function moeda(v: any) {
    if (v === null || v === undefined) return "-";
    return Number(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function numero(v: any, sufixo = "") {
    if (v === null || v === undefined) return "-";
    return `${v}${sufixo}`;
  }

  return (

    <div style={container}>

      {/* HEADER */}
      <div style={header}>

        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{ fontSize: 22 }}>📊</div>
          <h1 style={titulo}>Histórico de Safras</h1>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>← Dashboard</button>
        </Link>

      </div>

      {/* FILTRO */}
      <div style={card}>

        <h3 style={{marginBottom:10}}>Propriedade</h3>

        <select
          value={filtro}
          onChange={(e)=>setFiltro(e.target.value)}
          style={input}
        >
          <option value="">Todas</option>
          {propriedades.map((p,i)=>(
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

      </div>

      {/* LISTA */}
      {filtrado.map((s, index) => (

        <div key={index} style={card}>

          {/* TOPO */}
          <div style={topo}>

            <div>
              <h3 style={{margin:0}}>{s.propriedade}</h3>
              <span style={sub}>
                {s.safra} • {s.cultura}
              </span>
            </div>

            <div style={areaBox}>
              {numero(s.area, " ha")}
            </div>

          </div>

          {/* GRID */}
          <div style={grid}>

            <div style={item}>
              <span style={label}>Produtividade</span>
              <strong>{numero(s.produtividade, " sc/ha")}</strong>
            </div>

            <div style={item}>
              <span style={label}>Custo/ha</span>
              <strong>{moeda(s.custo_ha)}</strong>
            </div>

            <div style={item}>
              <span style={label}>Preço venda</span>
              <strong>{moeda(s.preco_venda)}</strong>
            </div>

            <div style={item}>
              <span style={label}>Receita</span>
              <strong>{moeda(s.receita)}</strong>
            </div>

            <div style={item}>
              <span style={label}>Lucro</span>
              <strong>{moeda(s.lucro)}</strong>
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}

/* 🎨 ESTILO */

const container = {
  padding: "40px 50px",
  background: "#f3f4f6",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 25
};

const titulo = {
  margin: 0,
  fontSize: 24,
  fontWeight: 600
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: 15
};

const input = {
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #ccc",
  width: "100%"
};

const btnVoltar = {
  padding: "8px 14px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};

const topo = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 15
};

const sub = {
  fontSize: 13,
  color: "#6b7280"
};

const areaBox = {
  background: "#eef2ff",
  padding: "6px 12px",
  borderRadius: 8,
  fontWeight: 600
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10
};

const item = {
  background: "#f9fafb",
  padding: 10,
  borderRadius: 8
};

const label = {
  fontSize: 12,
  color: "#6b7280"
};
