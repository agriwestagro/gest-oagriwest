"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NovaSafra() {

  const [propriedades, setPropriedades] = useState<any[]>([]);

  const [form, setForm] = useState({
    propriedade: "",
    safra: "",
    cultura: "",
    area: "",
    produtividade: "",
    custo_ha: "",
    preco_venda: "",
    receita: "",
    lucro: ""
  });

  useEffect(() => {
    carregarPropriedades();
  }, []);

  async function carregarPropriedades() {
    const { data } = await supabase.from("propriedades").select("*");
    setPropriedades(data || []);
  }

  function handleChange(e:any){
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvarSafra(){

    const { error } = await supabase
      .from("safras")
      .insert([form]);

    if(error){
      alert("Erro ao salvar");
      return;
    }

    alert("Safra salva com sucesso");

    setForm({
      propriedade: "",
      safra: "",
      cultura: "",
      area: "",
      produtividade: "",
      custo_ha: "",
      preco_venda: "",
      receita: "",
      lucro: ""
    });

  }

  return(

    <div style={{padding:40}}>

      <h1>Cadastro de Safra</h1>

      <br/>

      <select name="propriedade" onChange={handleChange}>
        <option value="">Selecione a propriedade</option>
        {propriedades.map((p,index)=>(
          <option key={index} value={p.nome}>{p.nome}</option>
        ))}
      </select>

      <br/><br/>

      <input name="safra" placeholder="Safra" onChange={handleChange}/>
      <br/><br/>

      <input name="cultura" placeholder="Cultura" onChange={handleChange}/>
      <br/><br/>

      <input name="area" placeholder="Área" onChange={handleChange}/>
      <br/><br/>

      <input name="produtividade" placeholder="Produtividade" onChange={handleChange}/>
      <br/><br/>

      <input name="custo_ha" placeholder="Custo/ha" onChange={handleChange}/>
      <br/><br/>

      <input name="preco_venda" placeholder="Preço venda" onChange={handleChange}/>
      <br/><br/>

      <input name="receita" placeholder="Receita" onChange={handleChange}/>
      <br/><br/>

      <input name="lucro" placeholder="Lucro" onChange={handleChange}/>
      <br/><br/>

      <button onClick={salvarSafra}>
        Salvar
      </button>

    </div>

  )
}
