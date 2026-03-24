"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function PropriedadePage({ params }: any) {

  const [propriedade,setPropriedade] = useState<any>(null)
  const [visitas,setVisitas] = useState<any[]>([])
  const [safras,setSafras] = useState<any[]>([])
  const [grafico,setGrafico] = useState<any[]>([])

  const [mediaProd,setMediaProd] = useState(0)
  const [mediaLucro,setMediaLucro] = useState(0)

  useEffect(()=>{
    carregarDados()
  },[])

  async function carregarDados(){

    const { data } = await supabase
      .from("propriedades")
      .select("*")
      .eq("id",params.id)
      .single()

    setPropriedade(data)

    const { data:visitasData } = await supabase
      .from("visitas")
      .select("*")
      .eq("propriedade",data.nome)

    setVisitas(visitasData || [])

    const { data:safrasData } = await supabase
      .from("safras")
      .select("*")
      .eq("propriedade",data.nome)

    const listaSafras = safrasData || []
    setSafras(listaSafras)
console.log("SAFRAS:", listaSafras)

    if(listaSafras.length > 0){

      const somaProd = listaSafras.reduce((total,s)=> 
        total + (parseFloat(s.produtividade) || 0)
      ,0)

      const somaLucro = listaSafras.reduce((total,s)=> 
        total + (parseFloat(String(s.lucro).replace("R$","")) || 0)
      ,0)

      setMediaProd(Math.round(somaProd / listaSafras.length))
      setMediaLucro(Math.round(somaLucro / listaSafras.length))

      const dadosGrafico = listaSafras.map((s)=>({
        safra: s.safra,
        produtividade: parseFloat(s.produtividade) || 0,
        lucro: parseFloat(String(s.lucro).replace("R$","")) || 0
      }))

      setGrafico(dadosGrafico)

    }

  }

  if(!propriedade){
    return <div style={{padding:40}}>Carregando...</div>
  }

  return(

    <div style={{padding:40}}>

      <h1>{propriedade.nome}</h1>

      <p>Produtor: {propriedade.produtor}</p>
      <p>Município: {propriedade.municipio}</p>

      <br/>

      <h2>Indicadores da Fazenda</h2>

      <p><b>Produtividade média:</b> {mediaProd} sc/ha</p>
      <p><b>Lucro médio:</b> R$ {mediaLucro}</p>
      <p><b>Safras registradas:</b> {safras.length}</p>
      <p><b>Visitas realizadas:</b> {visitas.length}</p>

      <br/><br/>

      <h2>Produtividade e Lucro por Safra</h2>

      <div style={{width:"100%", height:300}}>
        <ResponsiveContainer>
          <LineChart data={grafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="safra" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="produtividade" name="Produtividade" />
            <Line type="monotone" dataKey="lucro" name="Lucro" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <br/><br/>

      <h2>Safras</h2>

      {safras.map((s)=>(
        <div key={s.id}>
          {s.cultura} – {s.safra} – {s.produtividade} sc/ha – R$ {s.lucro}
        </div>
      ))}

      <br/><br/>

      <h2>Visitas de Campo</h2>

      {visitas.map((v)=>(
        <div key={v.id}>
          {v.data_visita} – Talhão {v.talhao} – {v.observacao}
        </div>
      ))}

    </div>

  )
}