"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NovaSafra() {

  const [form,setForm] = useState({
    propriedade:"",
    safra:"",
    cultura:"",
    area:"",
    produtividade:"",
    custo:"",
    preco:""
  })

  function handleChange(e:any){
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const prod = Number(form.produtividade)
  const preco = Number(form.preco)
  const custo = Number(form.custo)

  const receita = prod * preco
  const lucro = receita - custo

  function formatarMoeda(valor:number){
    if(!valor) return "R$ 0,00"
    return valor.toLocaleString("pt-BR",{
      style:"currency",
      currency:"BRL"
    })
  }

  async function salvarSafra(){

    if(!form.propriedade || !form.safra){
      alert("Preencha os campos obrigatórios")
      return
    }

    const { error } = await supabase
      .from("safras")
      .insert([{
        propriedade: form.propriedade,
        safra: form.safra,
        cultura: form.cultura,
        area: form.area,
        produtividade: prod,
        custo_ha: custo,
        preco_venda: preco,
        receita: receita,
        lucro: lucro
      }])

    if(error){
      alert("Erro ao salvar safra")
      console.log(error)
      return
    }

    alert("Safra salva com sucesso")

    setForm({
      propriedade:"",
      safra:"",
      cultura:"",
      area:"",
      produtividade:"",
      custo:"",
      preco:""
    })
  }

  return(

    <div style={{
      padding:"40px 50px",
      background:"#f3f4f6",
      minHeight:"100vh"
    }}>

      {/* HEADER */}
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:25
      }}>

        <div style={{
          display:"flex",
          alignItems:"center",
          gap:10
        }}>
          <div style={{fontSize:22}}>🌱</div>

          <h1 style={{
            margin:0,
            fontSize:24,
            fontWeight:600,
            color:"#1f2937"
          }}>
            Nova Safra
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

        <h3 style={{marginBottom:15}}>Cadastro</h3>

        <input
          name="propriedade"
          placeholder="Propriedade"
          value={form.propriedade}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="safra"
          placeholder="Safra (ex: 2024/25)"
          value={form.safra}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="cultura"
          placeholder="Cultura"
          value={form.cultura}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="area"
          placeholder="Área (ha)"
          value={form.area}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="produtividade"
          placeholder="Produtividade (sc/ha)"
          value={form.produtividade}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="custo"
          placeholder="Custo por ha (R$)"
          value={form.custo}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="preco"
          placeholder="Preço de venda (R$)"
          value={form.preco}
          onChange={handleChange}
          style={inputFull}
        />

        {/* RESUMO AUTOMÁTICO */}
        <div style={resumoBox}>
          <p><b>Receita estimada:</b> {formatarMoeda(receita)}</p>
          <p style={{
            color: lucro >= 0 ? "#16a34a" : "#dc2626",
            fontWeight:600
          }}>
            <b>Lucro estimado:</b> {formatarMoeda(lucro)}
          </p>
        </div>

        <button onClick={salvarSafra} style={btn}>
          Salvar Safra
        </button>

      </div>

    </div>
  )
}

/* 🎨 ESTILO PADRÃO */

const card = {
  background:"#fff",
  padding:20,
  borderRadius:12,
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)",
  marginBottom:20,
  maxWidth:500
}

const inputFull = {
  padding:"10px",
  borderRadius:8,
  border:"1px solid #ccc",
  width:"100%",
  marginBottom:10
}

const btn = {
  padding:"10px 16px",
  background:"#2f4f5f",
  color:"#fff",
  border:"none",
  borderRadius:10,
  cursor:"pointer",
  fontWeight:500
}

const btnVoltar = {
  padding:"8px 14px",
  background:"#e5e7eb",
  border:"none",
  borderRadius:10,
  cursor:"pointer"
}

const resumoBox = {
  background:"#f9fafb",
  padding:12,
  borderRadius:10,
  marginBottom:15,
  border:"1px solid #e5e7eb"
}
