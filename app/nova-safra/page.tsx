"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NovaSafra() {

  const [propriedades, setPropriedades] = useState<string[]>([]);

  const [form, setForm] = useState({
    propriedade: "",
    safra: "",
    cultura: "",
    area: "",
    produtividade: "",
    custo_ha: "",
    preco_venda: ""
  });

  useEffect(() => {
    carregarPropriedades();
  }, []);

  async function carregarPropriedades() {
    const { data, error } = await supabase
      .from("propriedades")
      .select("nome");

    if (error) {
      console.error(error);
      alert("Erro ao carregar propriedades");
      return;
    }

    setPropriedades(data?.map((p) => p.nome) || []);
  }

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function toNumber(value: string) {
    if (!value || value.trim() === "") return 0;
    return Number(value);
  }

  async function salvarSafra() {

    if (!form.propriedade) {
      alert("Selecione a propriedade");
      return;
    }

    const area = toNumber(form.area);
    const produtividade = toNumber(form.produtividade);
    const custo_ha = toNumber(form.custo_ha);
    const preco_venda = toNumber(form.preco_venda);

    // 🔥 CÁLCULO AUTOMÁTICO
    const receita = produtividade * area * preco_venda;
    const custoTotal = custo_ha * area;
    const lucro = receita - custoTotal;

    const payload = {
      propriedade: form.propriedade,
      safra: form.safra,
      cultura: form.cultura,
      area,
      produtividade,
      custo_ha,
      preco_venda,
      receita,
      lucro
    };

    const { error } = await supabase
      .from("safras")
      .insert([payload]);

    if (error) {
      console.error(error);
      alert("Erro ao salvar: " + error.message);
      return;
    }

    alert("Safra salva com sucesso");

    setForm({
      propriedade: "",
      safra: "",
      cultura: "",
      area: "",
      produtividade: "",
      custo_ha: "",
      preco_venda: ""
    });
  }

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>

        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{ fontSize: 22 }}>🌱</div>

          <h1 style={titulo}>
            Safras
          </h1>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>
            ← Dashboard
          </button>
        </Link>

      </div>

      {/* FORM */}
      <div style={card}>

        <h3 style={{ marginBottom: 15 }}>Nova Safra</h3>

        <select
          name="propriedade"
          value={form.propriedade}
          onChange={handleChange}
          style={inputFull}
        >
          <option value="">Selecione a propriedade</option>
          {propriedades.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

        <input name="safra" placeholder="Safra (ex: 2024/25)" value={form.safra} onChange={handleChange} style={inputFull}/>
        <input name="cultura" placeholder="Cultura" value={form.cultura} onChange={handleChange} style={inputFull}/>
        <input name="area" placeholder="Área (ha)" value={form.area} onChange={handleChange} style={inputFull}/>
        <input name="produtividade" placeholder="Produtividade (sc/ha)" value={form.produtividade} onChange={handleChange} style={inputFull}/>
        <input name="custo_ha" placeholder="Custo por ha (R$)" value={form.custo_ha} onChange={handleChange} style={inputFull}/>
        <input name="preco_venda" placeholder="Preço venda (R$/sc)" value={form.preco_venda} onChange={handleChange} style={inputFull}/>

        <button onClick={salvarSafra} style={btn}>
          Salvar Safra
        </button>

      </div>

    </div>
  );
}

/* 🎨 ESTILO */

const container: React.CSSProperties = {
  padding: "40px 50px",
  background: "#f3f4f6",
  minHeight: "100vh"
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 25
};

const titulo: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 600,
  color: "#1f2937"
};

const card: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: 20
};

const inputFull: React.CSSProperties = {
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #ccc",
  width: "100%",
  marginBottom: 10
};

const btn: React.CSSProperties = {
  padding: "10px 16px",
  background: "#2f4f5f",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 500
};

const btnVoltar: React.CSSProperties = {
  padding: "8px 14px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};
