"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Safras() {

  const [safras,setSafras] = useState<any[]>([])

  useEffect(()=>{
    carregarSafras()
  },[])

  async function carregarSafras(){

    const { data } = await supabase
      .from("safras")
      .select("*")
      .order("created_at",{ascending:false})

    if(data){
      setSafras(data)
    }

  }

  return(

    <div style={{padding:40}}>

      <h1>Safras</h1>

      <br/>

      {safras.map((s)=>(
        
        <div
        key={s.id}
        style={{
          border:"1px solid #ccc",
          padding:15,
          marginBottom:15
        }}
        >

          <h2>{s.propriedade}</h2>

          <p><b>Safra:</b> {s.safra}</p>

          <p><b>Cultura:</b> {s.cultura}</p>

          <p><b>Área:</b> {s.area} ha</p>

          <p><b>Produtividade:</b> {s.produtividade} sc/ha</p>

          <p><b>Custo:</b> R$ {s.custo_ha}</p>

          <p><b>Preço:</b> R$ {s.preco_venda}</p>

          <p><b>Receita:</b> R$ {s.receita}</p>

          <p><b>Lucro:</b> R$ {s.lucro}</p>

        </div>

      ))}

    </div>

  )

}