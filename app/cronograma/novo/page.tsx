"use client";

import { useState, useEffect } from "react";
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NovoCronograma() {

  const [propriedades, setPropriedades] = useState<string[]>([]);

  const [form, setForm] = useState({
    data: "",
    propriedade: "",
    atividade: "",
    responsavel: ""
  });

  useEffect(() => {
    carregarPropriedades();
  }, []);

  async function carregarPropriedades() {
    const { data } = await supabase
      .from("propriedades")
      .select("nome");

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

      <input type="date" name="data" onChange={handleChange} />
      
      <select name="propriedade" onChange={handleChange}>
        <option>Selecione</option>
        {propriedades.map((p,i)=>(
          <option key={i}>{p}</option>
        ))}
      </select>

      <input name="atividade" placeholder="Atividade" onChange={handleChange} />
      <input name="responsavel" placeholder="Responsável" onChange={handleChange} />

      <button onClick={salvar}>Salvar</button>

      <Link href="/cronograma">Voltar</Link>

    </div>
  );
}