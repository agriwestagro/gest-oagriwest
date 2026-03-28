"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RankingPage() {

  const [dados,setDados] = useState<any[]>([])
  const [ranking,setRanking] = useState<any[]>([])

  const [tipo,setTipo] = useState("") // 🔥 começa vazio
  const [safraFiltro,setSafraFiltro] = useState("")
  const [culturaFiltro,setCulturaFiltro] = useState("")

  const [safras,setSafras] = useState<string[]>([])
  const [culturas,setCulturas] = useState<string[]>([])

  useEffect(()=>{
    carregarDados()
  },[])

  useEffect(()=>{
    if(tipo) gerarRanking() // 🔥 só roda se escolher
    else setRanking([])
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
      const custo_ha = Number(s.custo_ha) || 0
      const area = Number(s.area) || 0

      const custoTotal = custo_ha * area
      const receita = s.receita || (produtividade * area * (Number(s.preco_venda) || 0))
      const lucro = s.lucro ?? (receita - custoTotal)

      if(!mapa[nome]){
        mapa[nome] = {
          propriedade: nome,
          produtividade: 0,
          custo_ha: 0,
          lucro: 0,
          count: 0
        }
      }

      mapa[nome].produtividade += produtividade
      mapa[nome].custo_ha += custo_ha
      mapa[nome].lucro += lucro
      mapa[nome].count += 1

    })

    const lista = Object.values(mapa).map((item:any)=>({
      propriedade: item.propriedade,
      produtividade: item.produtividade / item.count,
      custo_ha: item.custo_ha / item.count,
      lucro: item.lucro
    }))

    lista.sort((a:any,b:any)=>{

      if(tipo === "produtividade"){
        return b.produtividade - a.produtividade
      }

      if(tipo === "custo"){
        return a.custo_ha - b.custo_ha // 🔥 menor é melhor
      }

      return b.lucro - a.lucro
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
          <option value="">Selecionar métrica</option>
          <option value="produtividade">Produtividade</option>
          <option value="custo">Custo/ha (menor melhor)</option>
          <option value="lucro">Lucro</option>
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

      {/* ESTADO VAZIO */}
      {!tipo && (
        <div style={{color:"#6b7280", fontSize:14}}>
          Selecione uma métrica para visualizar o ranking
        </div>
      )}

      {/* GRID */}
      <div style={grid}>

        {ranking.map((r,index)=>(

          <div key={index} style={card}>

            <strong style={{fontSize:16}}>
              {getMedalha(index)} {r.propriedade}
            </strong>

            {tipo === "produtividade" && (
              <div style={linha}>
                🌾 {r.produtividade.toFixed(1)} sc/ha
              </div>
            )}

            {tipo === "custo" && (
              <div style={linha}>
                💸 {formatarMoeda(r.custo_ha)} /ha
              </div>
            )}

            {tipo === "lucro" && (
              <div style={{
                ...linha,
                fontWeight:600,
                color:"#166534"
              }}>
                💰 {formatarMoeda(r.lucro)}
              </div>
            )}

          </div>

        ))}

      </div>

    </div>
  )
}

/* estilos mantidos */
