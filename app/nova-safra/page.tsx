"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NovaSafra() {

  const [propriedade,setPropriedade] = useState("")
  const [safra,setSafra] = useState("")
  const [cultura,setCultura] = useState("")
  const [area,setArea] = useState("")
  const [produtividade,setProdutividade] = useState("")
  const [custo,setCusto] = useState("")
  const [preco,setPreco] = useState("")

  async function salvarSafra(){

    const prod = Number(produtividade)
    const p = Number(preco)
    const c = Number(custo)

    const receita = prod * p
    const lucro = receita - c

    const { error } = await supabase
      .from("safras")
      .insert([{
        propriedade: propriedade,
        safra: safra,
        cultura: cultura,
        area: area,
        produtividade: prod,
        custo_ha: c,
        preco_venda: p,
        receita: receita,
        lucro: lucro
      }])

    if(error){
      alert("erro ao salvar safra")
      console.log(error)
    }else{
      alert("safra salva")
    }

  }

  return(

    <div style={{padding:40}}>

      <h1>Registrar Safra</h1>

      <br/>

      <input placeholder="Propriedade"
      value={propriedade}
      onChange={(e)=>setPropriedade(e.target.value)}
      />

      <br/><br/>

      <input placeholder="Safra (ex: 2024/25)"
      value={safra}
      onChange={(e)=>setSafra(e.target.value)}
      />

      <br/><br/>

      <input placeholder="Cultura"
      value={cultura}
      onChange={(e)=>setCultura(e.target.value)}
      />

      <br/><br/>

      <input placeholder="Área (ha)"
      value={area}
      onChange={(e)=>setArea(e.target.value)}
      />

      <br/><br/>

      <input placeholder="Produtividade sc/ha"
      value={produtividade}
      onChange={(e)=>setProdutividade(e.target.value)}
      />

      <br/><br/>

      <input placeholder="Custo por ha"
      value={custo}
      onChange={(e)=>setCusto(e.target.value)}
      />

      <br/><br/>

      <input placeholder="Preço venda"
      value={preco}
      onChange={(e)=>setPreco(e.target.value)}
      />

      <br/><br/>

      <button onClick={salvarSafra}>
        Salvar Safra
      </button>

    </div>

  )

}