"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function VisitasPage(){

  const [visitas,setVisitas] = useState<any[]>([])
  const [propriedades,setPropriedades] = useState<string[]>([])

  const [filtroMes,setFiltroMes] = useState("")
  const [filtroPropriedade,setFiltroPropriedade] = useState("")

  const [abertos, setAbertos] = useState<number[]>([])

  useEffect(()=>{
    carregarVisitas()
    carregarPropriedades()
  },[])

  async function carregarVisitas(){
    const { data } = await supabase
      .from("visitas")
      .select("*")
      .order("data_visita",{ascending:false})

    setVisitas(data || [])
  }

  async function carregarPropriedades(){
    const { data } = await supabase
      .from("propriedades")
      .select("nome")

    setPropriedades(data?.map(p=>p.nome) || [])
  }

  function toggleCard(index:number){
    if(abertos.includes(index)){
      setAbertos(abertos.filter(i => i !== index))
    }else{
      setAbertos([...abertos, index])
    }
  }

  function formatarData(dataString:any){
    if(!dataString) return "-"

    return new Date(dataString).toLocaleString("pt-BR",{
      timeZone: "America/Sao_Paulo",
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    })
  }

  const visitasFiltradas = visitas.filter(v=>{
    const mesOk = filtroMes ? v.data_visita?.startsWith(filtroMes) : true
    const propOk = filtroPropriedade ? v.propriedade === filtroPropriedade : true
    return mesOk && propOk
  })

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
        marginBottom:30
      }}>

        <div style={{display:"flex", alignItems:"center", gap:10}}>
          
          <div style={{fontSize:22}}>📋</div>

          <h1 style={{
            margin:0,
            fontSize:24,
            fontWeight:600,
            color:"#1f2937"
          }}>
            Visitas
          </h1>
        </div>

        <div style={{display:"flex", gap:10}}>

          <Link href="/dashboard">
            <button style={btnVoltar}>
              ← Voltar
            </button>
          </Link>

          <Link href="/visitas/nova-visita">
            <button style={btnPrimary}>
              + Nova Visita
            </button>
          </Link>

        </div>

      </div>

      {/* FILTROS */}
      <div style={{
        display:"flex",
        gap:12,
        marginBottom:25
      }}>
        <select value={filtroMes} onChange={e=>setFiltroMes(e.target.value)} style={input}>
          <option value="">Todos os meses</option>
          <option value="2026-01">Jan</option>
          <option value="2026-02">Fev</option>
          <option value="2026-03">Mar</option>
        </select>

        <select value={filtroPropriedade} onChange={e=>setFiltroPropriedade(e.target.value)} style={input}>
          <option value="">Todas propriedades</option>
          {propriedades.map((p,i)=>(
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
        gap:20
      }}>

        {visitasFiltradas.map((v,index)=>(

          <div key={v.id || index} style={card}>

            {/* PROPRIEDADE */}
            <div style={{marginBottom:10}}>
              <strong style={{fontSize:16}}>
                {v.propriedade}
              </strong>
            </div>

            {/* VISÍVEL */}
            <div style={linha}>
              <b>Data:</b> {formatarData(v.data_visita)}
            </div>

            <div style={linha}>
              <b>Motivo:</b> {v.motivo || "-"}
            </div>

            {/* BOTÃO */}
            <button
              onClick={()=>toggleCard(index)}
              style={btnToggle}
            >
              {abertos.includes(index) ? "Ocultar" : "Ver mais"}
            </button>

            {/* OCULTO */}
            {abertos.includes(index) && (
              <div style={{marginTop:10}}>

                <div style={linha}>
                  <b>Msg Produtor:</b> {v.mensagem_produtor || "-"}
                </div>

                <div style={linha}>
                  <b>Obs:</b> {v.observacao || "-"}
                </div>

              </div>
            )}

            {/* LINK SEMPRE VISÍVEL */}
            {v.midia_link && (
              <div style={{marginTop:12}}>
                <a
                  href={v.midia_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={link}
                >
                  🔗 Abrir mídia
                </a>
              </div>
            )}

          </div>

        ))}

      </div>

    </div>
  )
}

/* 🎨 ESTILO */

const card = {
  background:"#fff",
  borderRadius:14,
  padding:18,
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)"
}

const linha = {
  fontSize:14,
  color:"#374151",
  marginBottom:4
}

const link = {
  fontSize:14,
  color:"#2563eb",
  textDecoration:"none"
}

const input = {
  padding:"10px",
  borderRadius:8,
  border:"1px solid #d1d5db",
  fontSize:14
}

const btnPrimary = {
  padding:"10px 16px",
  background:"#2f4f5f",
  color:"#fff",
  border:"none",
  borderRadius:10,
  cursor:"pointer"
}

const btnVoltar = {
  padding:"8px 14px",
  background:"#e5e7eb",
  border:"none",
  borderRadius:10,
  cursor:"pointer"
}

const btnToggle = {
  marginTop:10,
  padding:"6px 10px",
  fontSize:13,
  background:"#f3f4f6",
  border:"1px solid #d1d5db",
  borderRadius:8,
  cursor:"pointer"
}
