"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NovaAnalise(){

  const router = useRouter();

  const [propriedades,setPropriedades] = useState<string[]>([])
  const [propriedadeSelecionada,setPropriedadeSelecionada] = useState("")

  const [form,setForm] = useState({
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
    const { data } = await supabase.from("propriedades").select("nome")
    setPropriedades(data?.map(p=>p.nome) || [])
  }

  async function salvarAnalise(){

    if(!propriedadeSelecionada){
      alert("Selecione a propriedade")
      return
    }

    const { error } = await supabase
      .from("analises")
      .insert([{
        ...form,
        propriedade: propriedadeSelecionada
      }])

    if(error){
      alert("Erro ao salvar")
      return
    }

    router.push("/analises") // volta pro histórico
  }

  return(

    <div style={{ padding:40 }}>

      <h2>Nova Análise</h2>

      <select
        value={propriedadeSelecionada}
        onChange={e=>setPropriedadeSelecionada(e.target.value)}
        style={inputFull}
      >
        <option value="">Selecione a propriedade</option>
        {propriedades.map((p,i)=>(
          <option key={i} value={p}>{p}</option>
        ))}
      </select>

      <input placeholder="Link" onChange={e=>setForm({...form,link:e.target.value})} style={inputFull}/>
      <input placeholder="Motivo" onChange={e=>setForm({...form,motivo:e.target.value})} style={inputFull}/>
      <input placeholder="Período" onChange={e=>setForm({...form,periodo_cultura:e.target.value})} style={inputFull}/>
      <input placeholder="Responsável" onChange={e=>setForm({...form,responsavel:e.target.value})} style={inputFull}/>

      <div style={{display:"flex", gap:10}}>
        <input type="date" onChange={e=>setForm({...form,data_coleta:e.target.value})} style={inputFull}/>
        <input type="date" onChange={e=>setForm({...form,data_laudo:e.target.value})} style={inputFull}/>
      </div>

      <textarea placeholder="Decisão" onChange={e=>setForm({...form,decisao:e.target.value})} style={textarea}/>

      <button onClick={salvarAnalise} style={btn}>
        Salvar
      </button>

    </div>
  )
}

const inputFull = { width:"100%", padding:10, marginBottom:10 }
const textarea = { width:"100%", height:80, marginBottom:10 }
const btn = { padding:"10px 16px", background:"#2f4f5f", color:"#fff", border:"none", borderRadius:10 }