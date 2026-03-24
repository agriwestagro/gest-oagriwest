"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

    // pegar valores únicos para dropdown
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

      const prod = parseFloat(s.produtividade) || 0
      const lucro = parseFloat(String(s.lucro).replace("R$","")) || 0

      if(!mapa[nome]){
        mapa[nome] = {
          propriedade: nome,
          produtividade: 0,
          lucro: 0,
          count: 0
        }
      }

      mapa[nome].produtividade += prod
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

  // 💰 formatação de dinheiro
  function formatarMoeda(valor:number){
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

  const cardStyle = {
    padding:20,
    marginBottom:15,
    borderRadius:10,
    background:"#fff",
    boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
  }

  return(

    <div style={{padding:40}}>

      <h1>🏆 Ranking de Propriedades</h1>

      <br/>

      {/* FILTROS */}
      <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>

        <select onChange={(e)=>setTipo(e.target.value)}>
          <option value="lucro">Lucro</option>
          <option value="produtividade">Produtividade</option>
        </select>

        <select onChange={(e)=>setSafraFiltro(e.target.value)}>
          <option value="">Todas Safras</option>
          {safras.map((s,index)=>(
            <option key={index} value={s}>{s}</option>
          ))}
        </select>

        <select onChange={(e)=>setCulturaFiltro(e.target.value)}>
          <option value="">Todas Culturas</option>
          {culturas.map((c,index)=>(
            <option key={index} value={c}>{c}</option>
          ))}
        </select>

      </div>

      <br/><br/>

      {/* LISTA */}
      {ranking.map((r,index)=>(
        <div key={index} style={cardStyle}>

          <h3>{index + 1}º - {r.propriedade}</h3>

          <p>🌾 Produtividade: {r.produtividade} sc/ha</p>
          <p>💰 Lucro: {formatarMoeda(r.lucro)}</p>

        </div>
      ))}

    </div>

  )
}