"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AnalisesPage(){

  const router = useRouter();

  const [analises,setAnalises] = useState<any[]>([])
  const [propriedades,setPropriedades] = useState<string[]>([])
  const [propriedadeSelecionada,setPropriedadeSelecionada] = useState("")
  const [abertos, setAbertos] = useState<number[]>([])

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

  function toggleCard(index:number){
    if(abertos.includes(index)){
      setAbertos(abertos.filter(i => i !== index))
    }else{
      setAbertos([...abertos, index])
    }
  }

  function formatarData(data:any){
    if(!data) return "-"
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const analisesFiltradas = analises.filter(a =>
    propriedadeSelecionada ? a.propriedade === propriedadeSelecionada : true
  )

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

        <h1 style={{
          fontSize:24,
          fontWeight:600,
          color:"#1f2937"
        }}>
          🛰️ Análises Agronômicas
        </h1>

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
      <div style={{marginBottom:20}}>
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
      </div>

      {/* GRID */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
        gap:20
      }}>

        {analisesFiltradas.map((a,index)=>(

          <div key={index} style={cardElegante}>

            <div style={{marginBottom:10}}>
              <strong style={{fontSize:16}}>
                {a.propriedade}
              </strong>
            </div>

            <div style={linha}><b>Motivo:</b> {a.motivo}</div>
            <div style={linha}><b>Período:</b> {a.periodo_cultura}</div>
            <div style={linha}><b>Responsável:</b> {a.responsavel}</div>

            <div style={linha}>
              <b>Coleta:</b> {formatarData(a.data_coleta)}
            </div>

            <div style={linha}>
              <b>Laudo:</b> {formatarData(a.data_laudo)}
            </div>

            {/* TOGGLE */}
            <div
              onClick={()=>toggleCard(index)}
              style={toggle}
            >
              {abertos.includes(index) ? "▲ Ocultar decisão" : "▼ Ver decisão"}
            </div>

            {/* DECISÃO */}
            {abertos.includes(index) && (
              <div style={box}>
                <div style={linha}>
                  <b>Decisão:</b> {a.decisao || "-"}
                </div>
              </div>
            )}

            {a.link && (
              <a
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                style={link}
              >
                🔗 Abrir análise
              </a>
            )}

          </div>

        ))}

      </div>

    </div>
  )
}

/* 🎨 ESTILO */

const cardElegante = {
  background:"#fff",
  padding:20,
  borderRadius:14,
  border:"1px solid #e5e7eb",
  boxShadow:"0 8px 20px rgba(0,0,0,0.05)",
  transition:"0.2s"
}

const input = {
  padding:"10px",
  borderRadius:10,
  border:"1px solid #ddd"
}

const btn = {
  padding:"10px 16px",
  background:"#2f4f5f",
  color:"#fff",
  border:"none",
  borderRadius:10,
  cursor:"pointer",
  fontWeight:600
}

const btnVoltar = {
  padding:"10px 16px",
  background:"#e5e7eb",
  border:"none",
  borderRadius:10,
  cursor:"pointer"
}

const linha = {
  fontSize:14,
  marginBottom:5,
  color:"#374151"
}

const toggle = {
  marginTop:10,
  fontSize:13,
  cursor:"pointer",
  color:"#2f4f5f",
  fontWeight:"bold"
}

const box = {
  marginTop:10,
  padding:10,
  background:"#f9fafb",
  borderRadius:8,
  border:"1px solid #eee"
}

const link = {
  display:"inline-block",
  marginTop:10,
  color:"#2563eb",
  textDecoration:"none",
  fontSize:14
}
