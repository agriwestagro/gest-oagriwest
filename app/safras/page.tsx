"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function HistoricoSafras(){

  const [safras,setSafras] = useState<any[]>([])
  const [propriedades,setPropriedades] = useState<string[]>([])

  const [filtroPropriedade,setFiltroPropriedade] = useState("")

  useEffect(()=>{
    carregarSafras()
    carregarPropriedades()
  },[])

  async function carregarSafras(){
    const { data } = await supabase
      .from("safras")
      .select("*")
      .order("safra",{ascending:false})

    setSafras(data || [])
  }

  async function carregarPropriedades(){
    const { data } = await supabase
      .from("safras")
      .select("propriedade")

    const listaUnica = [...new Set(data?.map((p:any)=>p.propriedade))]
    setPropriedades(listaUnica || [])
  }

  const safrasFiltradas = safras.filter(s=>{
    const propOk = filtroPropriedade ? s.propriedade === filtroPropriedade : true
    return propOk
  })

  function formatarMoeda(valor:any){
    if(!valor) return "R$ 0,00"
    return Number(valor).toLocaleString("pt-BR",{
      style:"currency",
      currency:"BRL"
    })
  }

  return(

    <div style={container}>

      {/* HEADER */}
      <div style={header}>

        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{fontSize:22}}>🌱</div>

          <h1 style={titulo}>
            Histórico de Safras
          </h1>
        </div>

        <div>
          <Link href="/dashboard">
            <button style={btnVoltar}>← Voltar</button>
          </Link>
        </div>

      </div>

      {/* FILTRO */}
      <div style={filtros}>
        <select 
          value={filtroPropriedade} 
          onChange={e=>setFiltroPropriedade(e.target.value)} 
          style={input}
        >
          <option value="">Todas propriedades</option>
          {propriedades.map((p,i)=>(
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div style={grid}>

        {safrasFiltradas.map((s,index)=>{

          const custoTotal = (s.custo_ha || 0) * (s.area || 0)
          const receita = s.receita || (s.produtividade * s.area * s.preco_venda)
          const lucro = s.lucro || (receita - custoTotal)

          return(

            <div key={index} style={card}>

              <strong>{s.propriedade}</strong>

              <div style={linha}>
                <b>Safra:</b> {s.safra}
              </div>

              <div style={linha}>
                <b>Cultura:</b> {s.cultura}
              </div>

              <div style={linha}>
                <b>Área:</b> {s.area} ha
              </div>

              <div style={linha}>
                <b>Produtividade:</b> {s.produtividade} sc/ha
              </div>

              <div style={linha}>
                <b>Preço:</b> {formatarMoeda(s.preco_venda)}
              </div>

              <hr style={{margin:"10px 0"}} />

              <div style={linha}>
                <b>Custo Total:</b> {formatarMoeda(custoTotal)}
              </div>

              <div style={linha}>
                <b>Receita:</b> {formatarMoeda(receita)}
              </div>

              <div style={{
                ...linha,
                fontWeight:600,
                color: lucro >= 0 ? "#166534" : "#b91c1c"
              }}>
                <b>Lucro:</b> {formatarMoeda(lucro)}
              </div>

            </div>

          )
        })}

      </div>

    </div>
  )
}

/* 🎨 ESTILO */

const container: React.CSSProperties = {
  padding:"40px 50px",
  background:"#f3f4f6",
  minHeight:"100vh"
}

const header: React.CSSProperties = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:30
}

const titulo: React.CSSProperties = {
  margin:0,
  fontSize:24,
  fontWeight:600,
  color:"#1f2937"
}

const filtros: React.CSSProperties = {
  display:"flex",
  gap:12,
  marginBottom:25
}

const grid: React.CSSProperties = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
  gap:20
}

const card: React.CSSProperties = {
  background:"#fff",
  borderRadius:14,
  padding:16,
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)"
}

const linha: React.CSSProperties = {
  fontSize:13,
  color:"#374151",
  marginBottom:6
}

const input: React.CSSProperties = {
  padding:"9px",
  borderRadius:8,
  border:"1px solid #d1d5db"
}

const btnVoltar: React.CSSProperties = {
  padding:"7px 12px",
  background:"#e5e7eb",
  border:"none",
  borderRadius:8,
  cursor:"pointer",
  fontSize:13
}
