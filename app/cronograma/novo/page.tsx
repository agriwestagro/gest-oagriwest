"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NovoCronograma() {

  const [propriedades, setPropriedades] = useState<string[]>([]);

  const [form, setForm] = useState({
    titulo: "",
    motivo: "",
    descricao: "",
    propriedade: "",
    data_limite: ""
  });

  useEffect(() => {
    carregarPropriedades();
  }, []);

  async function carregarPropriedades() {
    const { data } = await supabase.from("propriedades").select("nome");
    setPropriedades(data?.map(p => p.nome) || []);
  }

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvar() {

    const { error } = await supabase
      .from("cronograma_semanal")
      .insert([form]);

    if (error) {
      alert("Erro ao salvar");
      return;
    }

    alert("Salvo com sucesso");
  }

  return (
    <div style={{ padding: 40 }}>

      <h1>Novo Cronograma</h1>

      <input name="titulo" placeholder="Título" onChange={handleChange} />
      <input name="motivo" placeholder="Motivo" onChange={handleChange} />
      <textarea name="descricao" placeholder="Descrição" onChange={handleChange} />

      <select name="propriedade" onChange={handleChange}>
        <option value="">Selecione</option>
        {propriedades.map((p,i)=>(
          <option key={i}>{p}</option>
        ))}
      </select>

      <input type="date" name="data_limite" onChange={handleChange} />

      <button onClick={salvar}>Salvar</button>

      <br /><br />
      <Link href="/cronograma">Voltar</Link>

    </div>
  );
}
