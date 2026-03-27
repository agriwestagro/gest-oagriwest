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
    preco_venda: "",
    receita: "",
    lucro: ""
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
    if (!value || value.trim() === "") return null;

    const tratado = value.replace(",", ".");
    const numero = Number(tratado);

    if (isNaN(numero)) return null;

    return numero;
  }

  async function salvarSafra() {

    if (!form.propriedade) {
      alert("Selecione a propriedade");
      return;
    }

    const payload = {
      propriedade: form.propriedade,
      safra: form.safra,
      cultura: form.cultura,
      area: toNumber(form.area),
      produtividade: toNumber(form.produtividade),
      custo_ha: toNumber(form.custo_ha),
      preco_venda: toNumber(form.preco_venda),
      receita: toNumber(form.receita),
      lucro: toNumber(form.lucro)
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
      preco_venda: "",
      receita: "",
      lucro: ""
    });
  }

  return (

    <div style={{ padding: "40px 50px", background: "#f3f4f6", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 22 }}>🌱</div>

          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#1f2937" }}>
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

        {/* ALTERADO */}
        <input name="produtividade" placeholder="Produtividade (sc/alq)" value={form.produtividade} onChange={handleChange} style={inputFull}/>

        <input name="custo_ha" placeholder="Custo por ha (R$)" value={form.custo_ha} onChange={handleChange} style={inputFull}/>

        {/* ALTERADO */}
        <input name="preco_venda" placeholder="Preço Médio de Venda (R$/sc)" value={form.preco_venda} onChange={handleChange} style={inputFull}/>

        <input name="receita" placeholder="Receita total (R$)" value={form.receita} onChange={handleChange} style={inputFull}/>

        {/* ALTERADO */}
        <input name="lucro" placeholder="Lucro por ha (R$/ha)" value={form.lucro} onChange={handleChange} style={inputFull}/>

        <button onClick={salvarSafra} style={btn}>
          Salvar Safra
        </button>

      </div>

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
  width: "100%",
  marginBottom: 10
};

const btn = {
  padding: "10px 16px",
  background: "#2f4f5f",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 500
};

const btnVoltar = {
  padding: "8px 14px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};
