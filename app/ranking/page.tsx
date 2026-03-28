"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RankingPage() {

  const router = useRouter();

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

  function moeda(v: any) {
    if (v === null || v === undefined) return "-";
    return Number(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function numero(v: any, sufixo = "") {
    if (v === null || v === undefined) return "-";
    return `${v}${sufixo}`;
  }

  function getMedalha(index:number){
    if(index === 0) return "🥇"
    if(index === 1) return "🥈"
    if(index === 2) return "🥉"
    return `${index + 1}º`
  }

  return (

    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f4f6f9;
        }

        .container {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-secondary {
          background: #e4e7eb;
        }

        .filtros {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .select {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .tipos {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tipo-btn {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          font-weight: bold;
        }

        .ativo {
          background: #16a34a;
          color: white;
          border: none;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          border: 1px solid #eee;
          transition: 0.2s;
        }

        .card:hover {
          transform: translateY(-3px);
        }

        .sub {
          font-size: 13px;
          color: #777;
          margin-top: 4px;
        }

        .divider {
          height: 1px;
          background: #eee;
          margin: 12px 0;
        }

        .info {
          font-size: 14px;
          color: #555;
        }

        .destaque {
          font-size: 18px;
          font-weight: bold;
          margin-top: 6px;
        }

        .lucro {
          color: #166534;
        }

        .empty {
          text-align: center;
          margin-top: 50px;
          color: #777;
        }
      `}</style>

      <div className="container">

        {/* HEADER */}
        <div className="header">

          <div className="title">
            🏆 Ranking de Propriedades
          </div>

          <div className="actions">
            <button className="btn btn-secondary" onClick={()=>router.push("/dashboard")}>
              ← Voltar
            </button>
          </div>

        </div>

        {/* TIPOS */}
        <div className="tipos">

          <button className={`tipo-btn ${tipo==="produtividade"?"ativo":""}`} onClick={()=>setTipo("produtividade")}>
            🌾 Produtividade
          </button>

          <button className={`tipo-btn ${tipo==="custo"?"ativo":""}`} onClick={()=>setTipo("custo")}>
            📉 Menor Custo
          </button>

          <button className={`tipo-btn ${tipo==="lucro"?"ativo":""}`} onClick={()=>setTipo("lucro")}>
            💰 Lucro
          </button>

        </div>

        {/* FILTROS */}
        <div className="filtros">

          <select className="select" value={safraFiltro} onChange={(e)=>setSafraFiltro(e.target.value)}>
            <option value="">Todas Safras</option>
            {safras.map((s,i)=>(
              <option key={i} value={s}>{s}</option>
            ))}
          </select>

          <select className="select" value={culturaFiltro} onChange={(e)=>setCulturaFiltro(e.target.value)}>
            <option value="">Todas Culturas</option>
            {culturas.map((c,i)=>(
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

        </div>

        {/* GRID */}
        <div className="grid">

          {ranking.length === 0 && (
            <div className="empty">
              Selecione um indicador para gerar o ranking.
            </div>
          )}

          {ranking.map((r,index)=>(

            <div key={index} className="card">

              <h3>
                {getMedalha(index)} {r.propriedade}
              </h3>

              <div className="divider"></div>

              {tipo === "produtividade" && (
                <>
                  <div className="info">Produtividade média</div>
                  <div className="destaque">
                    {numero(r.produtividade," sc/ha")}
                  </div>
                </>
              )}

              {tipo === "custo" && (
                <>
                  <div className="info">Custo médio</div>
                  <div className="destaque">
                    {moeda(r.custo)}/ha
                  </div>
                </>
              )}

              {tipo === "lucro" && (
                <>
                  <div className="info">Lucro total</div>
                  <div className="destaque lucro">
                    {moeda(r.lucro)}
                  </div>
                </>
              )}

            </div>

          ))}

        </div>

      </div>
    </>
  );
}
