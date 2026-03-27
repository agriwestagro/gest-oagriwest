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
          <div style={{fontSize:22}}>📊</div>

          <h1 style={titulo}>
            Histórico de Safras
          </h1>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>← Voltar</button>
        </Link>

      </div>

      {/* FILTRO */}
      <div style={filtros}>
        <select
          value={filtro}
          onChange={(e)=>setFiltro(e.target.value)}
          style={input}
        >
          <option value="">Todas propriedades</option>
          {propriedades.map((p,i)=>(
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div style={grid}>

        {filtrado.map((s, index) => (

          <div key={index} style={card}>

            {/* TOPO */}
            <div style={topo}>

              <div>
                <strong>{s.propriedade}</strong>

                <div style={sub}>
                  {s.safra} • {s.cultura}
                </div>
              </div>

              <div style={areaBox}>
                {numero(s.area, " ha")}
              </div>

            </div>

            {/* INDICADORES */}
            <div style={linha}>
              <b>Produtividade:</b> {numero(s.produtividade, " sc/ha")}
            </div>

            <div style={linha}>
              <b>Custo/ha:</b> {moeda(s.custo_ha)}
            </div>

            <div style={linha}>
              <b>Preço venda:</b> {moeda(s.preco_venda)}
            </div>

            <div style={linha}>
              <b>Receita:</b> {moeda(s.receita)}
            </div>

            <div style={linha}>
              <b>Lucro:</b> {moeda(s.lucro)}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

/* 🎨 ESTILO PADRÃO VISITAS */

const container: React.CSSProperties = {
  padding:"40px 50px",
  background:"#f3f4f6",
  minHeight:"100vh"
}

const header: React.CSSProperties = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:30
}

const titulo: React.CSSProperties = {
  margin:0,
  fontSize:24,
  fontWeight:600,
  color:"#1f2937"
}

const filtros: React.CSSProperties = {
  display:"flex",
  gap:12,
  marginBottom:25
}

const grid: React.CSSProperties = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
  gap:20
}

const card: React.CSSProperties = {
  background:"#fff",
  borderRadius:14,
  padding:16,
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)"
}

const topo: React.CSSProperties = {
  display:"flex",
  justifyContent:"space-between",
  marginBottom:10
}

const sub: React.CSSProperties = {
  fontSize:12,
  color:"#6b7280"
}

const areaBox: React.CSSProperties = {
  background:"#eef2ff",
  padding:"5px 10px",
  borderRadius:8,
  fontWeight:600,
  fontSize:12
}

const linha: React.CSSProperties = {
  fontSize:13,
  color:"#374151",
  marginBottom:6
}

const input: React.CSSProperties = {
  padding:"9px",
  borderRadius:8,
  border:"1px solid #d1d5db"
}

const btnVoltar: React.CSSProperties = {
  padding:"7px 12px",
  background:"#e5e7eb",
  border:"none",
  borderRadius:8,
  cursor:"pointer",
  fontSize:13
}
