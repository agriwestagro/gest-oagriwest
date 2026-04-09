"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AnalisesPage(){

  const router = useRouter();

  const [analises,setAnalises] = useState<any[]>([])
  const [propriedades,setPropriedades] = useState<string[]>([])
  const [propriedadeSelecionada,setPropriedadeSelecionada] = useState("")

  useEffect(()=>{
    carregarAnalises()
    carregarPropriedades()
  },[])

  async function carregarPropriedades(){
    const { data } = await supabase.from("propriedades").select("nome")
    setPropriedades(data?.map(p=>p.nome) || [])
  }

  async function carregarAnalises(){
    const { data } = await supabase
      .from("analises")
      .select("*")
      .order("created_at",{ascending:false})

    setAnalises(data || [])
  }

  function formatarData(data:any){
    if(!data) return "-"
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const analisesFiltradas = analises.filter(a =>
    propriedadeSelecionada ? a.propriedade === propriedadeSelecionada : true
  )

  return(

    <div style={{ padding:"40px 50px", background:"#f3f4f6", minHeight:"100vh" }}>

      {/* HEADER */}
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:25
      }}>

        <h1 style={{ fontSize:24 }}>🛰️ Análises Agronômicas</h1>

        <div style={{display:"flex", gap:10}}>
          <button onClick={()=>router.push("/dashboard")} style={btnVoltar}>
            ← Dashboard
          </button>

          <button onClick={()=>router.push("/analises/nova-analise")} style={btn}>
            + Nova Análise
          </button>
        </div>

      </div>

      {/* FILTRO */}
      <select
        value={propriedadeSelecionada}
        onChange={e=>setPropriedadeSelecionada(e.target.value)}
        style={input}
      >
        <option value="">Todas propriedades</option>
        {propriedades.map((p,i)=>(
          <option key={i} value={p}>{p}</option>
        ))}
      </select>

      {/* GRID */}
      <div style={{
        marginTop:20,
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
        gap:20
      }}>

        {analisesFiltradas.map((a,index)=>(

          <div key={index} style={card}>

            <strong>{a.propriedade}</strong>

            <div>Motivo: {a.motivo}</div>
            <div>Período: {a.periodo_cultura}</div>
            <div>Responsável: {a.responsavel}</div>

            <div>Coleta: {formatarData(a.data_coleta)}</div>
            <div>Laudo: {formatarData(a.data_laudo)}</div>

            <div style={{marginTop:10}}>Decisão: {a.decisao}</div>

            {a.link && (
              <a href={a.link} target="_blank" style={link}>
                🔗 Abrir análise
              </a>
            )}

          </div>

        ))}

      </div>

    </div>
  )
}

/* estilos iguais */
const card = { background:"#fff", padding:20, borderRadius:12 }
const input = { padding:10, borderRadius:8, border:"1px solid #ccc" }
const btn = { padding:"10px 16px", background:"#2f4f5f", color:"#fff", border:"none", borderRadius:10 }
const btnVoltar = { padding:"10px 16px", background:"#e5e7eb", border:"none", borderRadius:10 }
const link = { display:"block", marginTop:10, color:"#2563eb" }
