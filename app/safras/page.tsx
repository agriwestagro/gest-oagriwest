"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SafrasPage(){

  const [safras,setSafras] = useState<any[]>([])

  useEffect(()=>{
    carregarSafras()
  },[])

  async function carregarSafras(){
    const { data } = await supabase
      .from("safras")
      .select("*")
      .order("created_at",{ascending:false})

    setSafras(data || [])
  }

  function formatarMoeda(valor:any){
    if(valor === null || valor === undefined) return "-"
    return valor.toLocaleString("pt-BR",{
      style:"currency",
      currency:"BRL"
    })
  }

  function formatarNumero(valor:any){
    if(valor === null || valor === undefined) return "-"
    return valor.toLocaleString("pt-BR")
  }

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

        <div style={{
          display:"flex",
          alignItems:"center",
          gap:10
        }}>
          <div style={{fontSize:22}}>🌱</div>

          <h1 style={{
            margin:0,
            fontSize:24,
            fontWeight:600,
            color:"#1f2937"
          }}>
            Safras
          </h1>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>
            ← Dashboard
          </button>
        </Link>

      </div>

      {/* LISTA */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
        gap:20
      }}>

        {safras.map((s,index)=>{

          const lucroPositivo = s.lucro >= 0

          return(

            <div key={index} style={cardElegante}>

              <div style={{marginBottom:10}}>
                <strong style={{fontSize:16}}>
                  {s.propriedade}
                </strong>
              </div>

              <div style={linha}><b>Safra:</b> {s.safra}</div>
              <div style={linha}><b>Cultura:</b> {s.cultura}</div>
              <div style={linha}><b>Área:</b> {formatarNumero(s.area)} ha</div>

              <div style={linha}>
                <b>Produtividade:</b> {formatarNumero(s.produtividade)} sc/ha
              </div>

              <div style={linha}>
                <b>Custo:</b> {formatarMoeda(s.custo_ha)}
              </div>

              <div style={linha}>
                <b>Preço:</b> {formatarMoeda(s.preco_venda)}
              </div>

              <div style={linha}>
                <b>Receita:</b> {formatarMoeda(s.receita)}
              </div>

              <div style={{
                ...linha,
                marginTop:8,
                fontWeight:600,
                color: lucroPositivo ? "#16a34a" : "#dc2626"
              }}>
                <b>Lucro:</b> {formatarMoeda(s.lucro)}
              </div>

            </div>

          )
        })}

      </div>

    </div>
  )
}

/* 🎨 ESTILO (igual página de análises) */

const cardElegante = {
  background:"#fff",
  padding:20,
  borderRadius:14,
  border:"1px solid #e5e7eb"
}

const btnVoltar = {
  padding:"8px 14px",
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
