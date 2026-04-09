"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NovaAnalise(){

  const router = useRouter();

  const [propriedades,setPropriedades] = useState<string[]>([])

  const [form,setForm] = useState({
    propriedade:"",
    link:"",
    motivo:"",
    decisao:"",
    periodo_cultura:"",
    responsavel:"",
    data_coleta:"",
    data_laudo:""
  })

  useEffect(()=>{
    carregarPropriedades()
  },[])

  async function carregarPropriedades(){
    const { data, error } = await supabase
      .from("propriedades")
      .select("nome")

    if(error){
      alert("Erro ao carregar propriedades")
      return
    }

    setPropriedades(data?.map(p=>p.nome) || [])
  }

  function handleChange(e:any){
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function salvarAnalise(){

    if(!form.propriedade){
      alert("Selecione a propriedade")
      return
    }

    const { error } = await supabase
      .from("analises")
      .insert([form])

    if(error){
      alert("Erro ao salvar análise")
      return
    }

    alert("Análise salva com sucesso")

    router.push("/analises")
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
        maxWidth:600,
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:25
      }}>

        <h1 style={{
          margin:0,
          fontSize:24,
          fontWeight:600,
          color:"#1f2937"
        }}>
          🛰️ Nova Análise
        </h1>

        <button onClick={()=>router.push("/analises")} style={btnVoltar}>
          ← Voltar
        </button>

      </div>

      {/* FORM CENTRALIZADO */}
      <div style={card}>

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

        <input
          name="link"
          placeholder="Link da análise (opcional)"
          value={form.link}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="motivo"
          placeholder="Motivo da análise"
          value={form.motivo}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="periodo_cultura"
          placeholder="Período da cultura (ex: V4, R1...)"
          value={form.periodo_cultura}
          onChange={handleChange}
          style={inputFull}
        />

        <input
          name="responsavel"
          placeholder="Responsável"
          value={form.responsavel}
          onChange={handleChange}
          style={inputFull}
        />

        {/* DATAS COM LABEL */}
        <div style={{display:"flex", gap:10, marginBottom:10}}>

          <div style={{flex:1}}>
            <label style={label}>Data de Coleta</label>
            <input
              type="date"
              name="data_coleta"
              value={form.data_coleta}
              onChange={handleChange}
              style={inputFull}
            />
          </div>

          <div style={{flex:1}}>
            <label style={label}>Data do Laudo</label>
            <input
              type="date"
              name="data_laudo"
              value={form.data_laudo}
              onChange={handleChange}
              style={inputFull}
            />
          </div>

        </div>

        <textarea
          name="decisao"
          placeholder="Decisão tomada"
          value={form.decisao}
          onChange={handleChange}
          style={textarea}
        />

        <button onClick={salvarAnalise} style={btn}>
          Salvar Análise
        </button>

      </div>

    </div>
  )
}

/* 🎨 ESTILO */

const card = {
  background:"#fff",
  padding:25,
  borderRadius:14,
  boxShadow:"0 8px 20px rgba(0,0,0,0.05)",
  width:"100%",
  maxWidth:600
}

const inputFull = {
  padding:"10px",
  borderRadius:8,
  border:"1px solid #ccc",
  width:"100%",
  marginBottom:10
}

const textarea = {
  padding:"10px",
  borderRadius:8,
  border:"1px solid #ccc",
  width:"100%",
  height:100,
  marginBottom:10
}

const label = {
  fontSize:13,
  fontWeight:600,
  marginBottom:4,
  display:"block",
  color:"#374151"
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
