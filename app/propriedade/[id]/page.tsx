"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function Propriedade() {

  const params = useParams()

  const [propriedade,setPropriedade] = useState<any>(null)
  const [visitas,setVisitas] = useState<any[]>([])

  useEffect(()=>{
    carregarDados()
  },[])

  async function carregarDados(){

    const { data: prop } = await supabase
      .from("propriedades")
      .select("*")
      .eq("id", params.id)
      .single()

    if(prop){
      setPropriedade(prop)

      const { data: visitasData } = await supabase
        .from("visitas")
        .select("*")
        .eq("propriedade", prop.nome)
        .order("data_visita",{ascending:false})

      if(visitasData){
        setVisitas(visitasData)
      }
    }

  }

  if(!propriedade){
    return <div style={{padding:40}}>Carregando...</div>
  }

  return(

    <div style={{padding:40}}>

      <h1>{propriedade.nome}</h1>

      <p><b>Produtor:</b> {propriedade.produtor}</p>
      <p><b>Município:</b> {propriedade.municipio}</p>

      <br/>

      <h2>Histórico de Visitas</h2>

      <br/>

      {visitas.map((v)=>(
        <div key={v.id} style={{border:"1px solid #ccc",padding:10,marginBottom:10}}>

          <p><b>Data:</b> {v.data_visita}</p>
          <p><b>Talhão:</b> {v.talhao}</p>
          <p><b>Cultura:</b> {v.cultura}</p>
          <p><b>Status:</b> {v.status}</p>
          <p><b>Observação:</b> {v.observacao}</p>

        </div>
      ))}

    </div>

  )

}