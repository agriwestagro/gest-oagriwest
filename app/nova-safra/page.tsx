"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NovaSafra() {

  const [propriedades,setPropriedades] = useState<string[]>([])

  const [form,setForm] = useState({
    propriedade:"",
    safra:"",
    cultura:"",
    area:"",
    produtividade_alq:"",
    custo_total:"",
    preco_medio:"",
    receita:"",
    margem:""
  })

  useEffect(()=>{
    carregarPropriedades()
  },[])

  async function carregarPropriedades(){
    const { data } = await supabase
      .from("propriedades")
      .select("nome")

    setPropriedades(data?.map(p=>p.nome) || [])
  }

  function handleChange(e:any){
    setForm({
      ...form,
      [e.target.name]: e.target.value
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
        produtividade_alqueire: Number(form.produtividade_alq),
        custo_total: Number(form.custo_total),
        preco_medio: Number(form.preco_medio),
        receita: Number(form.receita),
        margem: Number(form.margem)
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
      produtividade_alq:"",
      custo_total:"",
      preco_medio:"",
      receita:"",
      margem:""
    })
  }

  return(

    <div style={{
      padding:"40px 20px",
      background:"#f3f4f6",
      minHeight:"100vh",
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
    }}>

      {/* HEADER */}
      <div style={{
        width:"100%",
        maxWidth:500,
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

        <select
          name="propriedade"
          value={form.propriedade}
          onChange={handleChange}
          style={inputFull}
        >
          <option value="">Selecione a propriedade</option>
          {propriedades.map((p,i)=>(
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

        <input name="safra" placeholder="Safra (ex: 2024/25)" value={form.safra} onChange={handleChange} style={inputFull}/>
        <input name="cultura" placeholder="Cultura" value={form.cultura} onChange={handleChange} style={inputFull}/>
        <input name="area" placeholder="Área (ha)" value={form.area} onChange={handleChange} style={inputFull}/>

        <input name="produtividade_alq" placeholder="Produtividade (sc/alq)" value={form.produtividade_alq} onChange={handleChange} style={inputFull}/>
        <input name="custo_total" placeholder="Custo total (R$)" value={form.custo_total} onChange={handleChange} style={inputFull}/>
        <input name="preco_medio" placeholder="Preço médio (R$/sc)" value={form.preco_medio} onChange={handleChange} style={inputFull}/>
        <input name="receita" placeholder="Receita total (R$)" value={form.receita} onChange={handleChange} style={inputFull}/>
        <input name="margem" placeholder="Margem (%)" value={form.margem} onChange={handleChange} style={inputFull}/>

        <button onClick={salvarSafra} style={btn}>
          Salvar Safra
        </button>

      </div>

    </div>
  )
}

/* 🎨 ESTILO */

const card = {
  background:"#fff",
  padding:20,
  borderRadius:12,
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)",
  width:"100%",
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
  fontWeight:500,
  width:"100%"
}

const btnVoltar = {
  padding:"8px 14px",
  background:"#e5e7eb",
  border:"none",
  borderRadius:10,
  cursor:"pointer"
}
