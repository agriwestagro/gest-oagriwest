"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function HistoricoSafra() {

  const [dados, setDados] = useState<any[]>([]);
  const [propriedades, setPropriedades] = useState<string[]>([]);
  const [filtroPropriedade, setFiltroPropriedade] = useState("");

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
      alert("Erro ao carregar histórico");
      return;
    }

    const lista = data || [];

    setDados(lista);

    // propriedades únicas
    const propsUnicas = [...new Set(lista.map(d => d.propriedade))];
    setPropriedades(propsUnicas);
  }

  const filtrado = filtroPropriedade
    ? dados.filter(d => d.propriedade === filtroPropriedade)
    : dados;

  function formatarMoeda(valor: number) {
    if (!valor) return "R$ 0,00";
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  return (

    <div style={{ padding: "40px 50px", background: "#f3f4f6", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 22 }}>📊</div>

          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#1f2937" }}>
            Histórico de Safras
          </h1>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>
            ← Dashboard
          </button>
        </Link>

      </div>

      {/* FILTRO */}
      <div style={card}>

        <h3 style={{ marginBottom: 10 }}>Filtrar por propriedade</h3>

        <select
          value={filtroPropriedade}
          onChange={(e) => setFiltroPropriedade(e.target.value)}
          style={inputFull}
        >
          <option value="">Todas</option>
          {propriedades.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

      </div>

      {/* LISTA */}
      {filtrado.map((s, index) => (

        <div key={index} style={card}>

          <h3>{s.propriedade}</h3>

          <p>📅 Safra: {s.safra}</p>
          <p>🌾 Cultura: {s.cultura}</p>
          <p>📐 Área: {s.area || 0} ha</p>
          <p>🚜 Produtividade: {s.produtividade || 0}</p>
          <p>💸 Custo/ha: {formatarMoeda(s.custo_ha)}</p>
          <p>💰 Receita: {formatarMoeda(s.receita)}</p>
          <p>📈 Lucro: {formatarMoeda(s.lucro)}</p>

        </div>

      ))}

    </div>
  );
}

/* ESTILO */

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: 20
};

const inputFull = {
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
