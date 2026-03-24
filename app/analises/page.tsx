"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AnalisesPage(){

  const [analises,setAnalises] = useState<any[]>([])
  const [propriedades,setPropriedades] = useState<string[]>([])
  const [propriedadeSelecionada,setPropriedadeSelecionada] = useState("")

  const [form,setForm] = useState({
    link:"",
    motivo:"",
    decisao:"",
    periodo_cultura:"",
    responsavel:"",
    data_coleta:"",
    data_laudo:""
  })

  useEffect(()=>{
    carregarPropriedades()
    carregarAnalises()
  },[])

  async function carregarPropriedades(){
    const { data } = await supabase.from("propriedades").select("nome")
    setPropriedades(data?.map(p=>p.nome) || [])
  }

  async function carregarAnalises(){
    const { data } = await supabase
      .from("analises")
      .select("*")
      .order("created_at",{ascending:false})

    setAnalises(data || [])
  }

  function formatarData(data:any){
    if(!data) return "-"
    return new Date(data).toLocaleDateString("pt-BR")
  }

  async function salvarAnalise(){

    if(!propriedadeSelecionada){
      alert("Selecione a propriedade")
      return
    }

    const { error } = await supabase
      .from("analises")
      .insert([{
        ...form,
        propriedade: propriedadeSelecionada
      }])

    if(error){
      alert("Erro ao salvar")
      return
    }

    setForm({
      link:"",
      motivo:"",
      decisao:"",
      periodo_cultura:"",
      responsavel:"",
      data_coleta:"",
      data_laudo:""
    })

    carregarAnalises()
  }

  const analisesFiltradas = analises.filter(a =>
    propriedadeSelecionada ? a.propriedade === propriedadeSelecionada : true
  )

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
          <div style={{fontSize:22}}>🛰️</div>

          <h1 style={{
            margin:0,
            fontSize:24,
            fontWeight:600,
            color:"#1f2937"
          }}>
            Análises Agronômicas
          </h1>
        </div>

        <Link href="/dashboard">
          <button style={btnVoltar}>
            ← Dashboard
          </button>
        </Link>

      </div>

      {/* SELETOR */}
      <div style={{marginBottom:20}}>
        <select
          value={propriedadeSelecionada}
          onChange={e=>setPropriedadeSelecionada(e.target.value)}
          style={input}
        >
          <option value="">Selecione a propriedade</option>
          {propriedades.map((p,i)=>(
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* FORM */}
      <div style={card}>

        <h3 style={{marginBottom:15}}>Nova Análise</h3>

        <input
          placeholder="Link da análise"
          value={form.link}
          onChange={e=>setForm({...form,link:e.target.value})}
          style={inputFull}
        />

        <input
          placeholder="Motivo da análise"
          value={form.motivo}
          onChange={e=>setForm({...form,motivo:e.target.value})}
          style={inputFull}
        />

        <input
          placeholder="Período da cultura (ex: V4, R1...)"
          value={form.periodo_cultura}
          onChange={e=>setForm({...form,periodo_cultura:e.target.value})}
          style={inputFull}
        />

        <input
          placeholder="Responsável"
          value={form.responsavel}
          onChange={e=>setForm({...form,responsavel:e.target.value})}
          style={inputFull}
        />

        <div style={{display:"flex", gap:10}}>
          <input
            type="date"
            value={form.data_coleta}
            onChange={e=>setForm({...form,data_coleta:e.target.value})}
            style={inputFull}
          />

          <input
            type="date"
            value={form.data_laudo}
            onChange={e=>setForm({...form,data_laudo:e.target.value})}
            style={inputFull}
          />
        </div>

        <textarea
          placeholder="Decisão tomada"
          value={form.decisao}
          onChange={e=>setForm({...form,decisao:e.target.value})}
          style={textarea}
        />

        <button onClick={salvarAnalise} style={btn}>
          Salvar Análise
        </button>

      </div>

      {/* HISTÓRICO */}
      <div style={{marginTop:30}}>

        <h3 style={{marginBottom:15}}>Histórico</h3>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
          gap:20
        }}>

          {analisesFiltradas.map((a,index)=>(

            <div key={index} style={cardElegante}>

              <div style={{marginBottom:10}}>
                <strong style={{fontSize:16}}>
                  {a.propriedade}
                </strong>
              </div>

              <div style={linha}><b>Motivo:</b> {a.motivo}</div>
              <div style={linha}><b>Período:</b> {a.periodo_cultura}</div>
              <div style={linha}><b>Responsável:</b> {a.responsavel}</div>

              <div style={linha}>
                <b>Coleta:</b> {formatarData(a.data_coleta)}
              </div>

              <div style={linha}>
                <b>Laudo:</b> {formatarData(a.data_laudo)}
              </div>

              <div style={linha}><b>Decisão:</b> {a.decisao}</div>

              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={link}
                >
                  🔗 Abrir análise
                </a>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

/* 🎨 ESTILO */

const card = {
  background:"#fff",
  padding:20,
  borderRadius:12,
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)",
  marginBottom:20
}

const cardElegante = {
  background:"#fff",
  padding:20,
  borderRadius:14,
  border:"1px solid #e5e7eb"
}

const input = {
  padding:"10px",
  borderRadius:8,
  border:"1px solid #ccc"
}

const inputFull = {
  padding:"10px",
  borderRadius:8,
  border:"1px solid #ccc",
  width:"100%",
  marginBottom:10
}

const textarea = {
  padding:"10px",
  borderRadius:8,
  border:"1px solid #ccc",
  width:"100%",
  height:80,
  marginBottom:10
}

const btn = {
  padding:"10px 16px",
  background:"#2f4f5f",
  color:"#fff",
  border:"none",
  borderRadius:10,
  cursor:"pointer",
  fontWeight:500
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

const link = {
  display:"inline-block",
  marginTop:10,
  color:"#2563eb",
  textDecoration:"none",
  fontSize:14
}