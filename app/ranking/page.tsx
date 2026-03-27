"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RankingPage() {

  const [dados,setDados] = useState<any[]>([])
  const [ranking,setRanking] = useState<any[]>([])

  const [tipo,setTipo] = useState("lucro")
  const [safraFiltro,setSafraFiltro] = useState("")
  const [culturaFiltro,setCulturaFiltro] = useState("")

  const [safras,setSafras] = useState<string[]>([])
  const [culturas,setCulturas] = useState<string[]>([])

  useEffect(()=>{
    carregarDados()
  },[])

  useEffect(()=>{
    gerarRanking()
  },[dados,tipo,safraFiltro,culturaFiltro])

  async function carregarDados(){

    const { data } = await supabase.from("safras").select("*")
    const lista = data || []

    setDados(lista)

    const safraUnica = [...new Set(lista.map(d => d.safra))]
    const culturaUnica = [...new Set(lista.map(d => d.cultura))]

    setSafras(safraUnica)
    setCulturas(culturaUnica)
  }

  function gerarRanking(){

    let filtrado = [...dados]

    if(safraFiltro){
      filtrado = filtrado.filter(d => d.safra === safraFiltro)
    }

    if(culturaFiltro){
      filtrado = filtrado.filter(d => d.cultura === culturaFiltro)
    }

    const mapa:any = {}

    filtrado.forEach((s)=>{

      const nome = s.propriedade

      const produtividade = Number(s.produtividade) || 0
      const area = Number(s.area) || 0
      const custoTotal = (Number(s.custo_ha) || 0) * area
      const receita = s.receita || (produtividade * area * (Number(s.preco_venda) || 0))
      const lucro = s.lucro ?? (receita - custoTotal)

      if(!mapa[nome]){
        mapa[nome] = {
          propriedade: nome,
          produtividade: 0,
          lucro: 0,
          count: 0
        }
      }

      mapa[nome].produtividade += produtividade
      mapa[nome].lucro += lucro
      mapa[nome].count += 1

    })

    const lista = Object.values(mapa).map((item:any)=>({
      propriedade: item.propriedade,
      produtividade: Math.round(item.produtividade / item.count),
      lucro: item.lucro
    }))

    lista.sort((a:any,b:any)=>{
      return tipo === "lucro"
        ? b.lucro - a.lucro
        : b.produtividade - a.produtividade
    })

    setRanking(lista)
  }

  function formatarMoeda(valor:number){
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

  function getMedalha(index:number){
    if(index === 0) return "🥇"
    if(index === 1) return "🥈"
    if(index === 2) return "🥉"
    return `${index + 1}º`
  }

  return(

    <div style={container}>

      {/* HEADER */}
      <div style={header}>

        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{fontSize:22}}>🏆</div>

          <h1 style={titulo}>
            Ranking de Propriedades
          </h1>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>← Voltar</button>
        </Link>

      </div>

      {/* FILTROS */}
      <div style={filtros}>

        <select value={tipo} onChange={(e)=>setTipo(e.target.value)} style={input}>
          <option value="lucro">Lucro</option>
          <option value="produtividade">Produtividade</option>
        </select>

        <select value={safraFiltro} onChange={(e)=>setSafraFiltro(e.target.value)} style={input}>
          <option value="">Todas Safras</option>
          {safras.map((s,index)=>(
            <option key={index} value={s}>{s}</option>
          ))}
        </select>

        <select value={culturaFiltro} onChange={(e)=>setCulturaFiltro(e.target.value)} style={input}>
          <option value="">Todas Culturas</option>
          {culturas.map((c,index)=>(
            <option key={index} value={c}>{c}</option>
          ))}
        </select>

      </div>

      {/* GRID */}
      <div style={grid}>

        {ranking.map((r,index)=>(

          <div key={index} style={card}>

            <strong style={{fontSize:16}}>
              {getMedalha(index)} {r.propriedade}
            </strong>

            <div style={linha}>
              🌾 Produtividade: {r.produtividade} sc/ha
            </div>

            <div style={{
              ...linha,
              fontWeight:600,
              color:"#166534"
            }}>
              💰 Lucro: {formatarMoeda(r.lucro)}
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

/* 🎨 PADRÃO VISUAL */

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
  marginBottom:25,
  flexWrap:"wrap"
}

const grid: React.CSSProperties = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",
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
  marginTop:6
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
