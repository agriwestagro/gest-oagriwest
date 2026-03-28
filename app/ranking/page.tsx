"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RankingPage() {

  const [dados,setDados] = useState<any[]>([])
  const [ranking,setRanking] = useState<any[]>([])

  const [tipo,setTipo] = useState("")
  const [safraFiltro,setSafraFiltro] = useState("")
  const [culturaFiltro,setCulturaFiltro] = useState("")

  const [safras,setSafras] = useState<string[]>([])
  const [culturas,setCulturas] = useState<string[]>([])

  useEffect(()=>{
    carregarDados()
  },[])

  useEffect(()=>{
    if(tipo){
      gerarRanking()
    } else {
      setRanking([])
    }
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
      const custoHa = Number(s.custo_ha) || 0
      const custoTotal = custoHa * area
      const receita = s.receita || (produtividade * area * (Number(s.preco_venda) || 0))
      const lucro = s.lucro ?? (receita - custoTotal)

      if(!mapa[nome]){
        mapa[nome] = {
          propriedade: nome,
          produtividade: 0,
          custo: 0,
          lucro: 0,
          count: 0
        }
      }

      mapa[nome].produtividade += produtividade
      mapa[nome].custo += custoHa
      mapa[nome].lucro += lucro
      mapa[nome].count += 1

    })

    const lista = Object.values(mapa).map((item:any)=>({
      propriedade: item.propriedade,
      produtividade: Math.round(item.produtividade / item.count),
      custo: item.custo / item.count,
      lucro: item.lucro
    }))

    lista.sort((a:any,b:any)=>{

      if(tipo === "lucro") return b.lucro - a.lucro
      if(tipo === "produtividade") return b.produtividade - a.produtividade
      if(tipo === "custo") return a.custo - b.custo

      return 0
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

  function botaoAtivo(valor:string){
    return tipo === valor
      ? {...btnTipo, background:"#16a34a", color:"#fff", border:"none"}
      : btnTipo
  }

  return(

    <div style={container}>

      {/* HEADER */}
      <div style={header}>

        <div>
          <h1 style={titulo}>Ranking de Propriedades</h1>
          <div style={subtitulo}>
            Compare desempenho entre áreas (visão gerencial)
          </div>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>← Voltar</button>
        </Link>

      </div>

      {/* TIPOS */}
      <div style={tipos}>

        <button style={botaoAtivo("produtividade")} onClick={()=>setTipo("produtividade")}>
          🌾 Produtividade
        </button>

        <button style={botaoAtivo("custo")} onClick={()=>setTipo("custo")}>
          📉 Menor Custo
        </button>

        <button style={botaoAtivo("lucro")} onClick={()=>setTipo("lucro")}>
          💰 Lucro
        </button>

      </div>

      {/* FILTROS */}
      <div style={filtros}>

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

        {ranking.length === 0 && (
          <div style={empty}>
            Selecione um indicador acima para gerar o ranking
          </div>
        )}

        {ranking.map((r,index)=>(

          <div key={index} style={card}>

            <div style={topoCard}>
              <span style={medalha}>{getMedalha(index)}</span>
              <strong>{r.propriedade}</strong>
            </div>

            {tipo === "produtividade" && (
              <div style={valorPrincipal}>
                {r.produtividade} <span style={unidade}>sc/ha</span>
              </div>
            )}

            {tipo === "custo" && (
              <div style={valorPrincipal}>
                {formatarMoeda(r.custo)} <span style={unidade}>/ha</span>
              </div>
            )}

            {tipo === "lucro" && (
              <div style={{...valorPrincipal, color:"#166534"}}>
                {formatarMoeda(r.lucro)}
              </div>
            )}

          </div>

        ))}

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
  fontSize:26,
  fontWeight:600,
  color:"#111827"
}

const subtitulo: React.CSSProperties = {
  fontSize:13,
  color:"#6b7280",
  marginTop:4
}

const tipos: React.CSSProperties = {
  display:"flex",
  gap:10,
  marginBottom:20
}

const btnTipo: React.CSSProperties = {
  padding:"9px 16px",
  borderRadius:10,
  border:"1px solid #d1d5db",
  background:"#fff",
  cursor:"pointer",
  fontSize:13
}

const filtros: React.CSSProperties = {
  display:"flex",
  gap:12,
  marginBottom:25
}

const grid: React.CSSProperties = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
  gap:20
}

const card: React.CSSProperties = {
  background:"#fff",
  borderRadius:14,
  padding:18,
  boxShadow:"0 3px 8px rgba(0,0,0,0.05)",
  display:"flex",
  flexDirection:"column",
  gap:10
}

const topoCard: React.CSSProperties = {
  display:"flex",
  alignItems:"center",
  gap:8,
  fontSize:14
}

const medalha: React.CSSProperties = {
  fontSize:18
}

const valorPrincipal: React.CSSProperties = {
  fontSize:26,
  fontWeight:700,
  color:"#1f2937"
}

const unidade: React.CSSProperties = {
  fontSize:14,
  fontWeight:400,
  color:"#6b7280"
}

const empty: React.CSSProperties = {
  color:"#6b7280",
  fontSize:14
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
