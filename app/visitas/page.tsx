"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function VisitasPage(){

  const [visitas,setVisitas] = useState<any[]>([])
  const [propriedades,setPropriedades] = useState<string[]>([])

  const [filtroMes,setFiltroMes] = useState("")
  const [filtroPropriedade,setFiltroPropriedade] = useState("")

  const [abertos, setAbertos] = useState<number[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [formEdit, setFormEdit] = useState<any>({})

  useEffect(()=>{
    carregarVisitas()
    carregarPropriedades()
  },[])

  async function carregarVisitas(){
    const { data } = await supabase
      .from("visitas")
      .select("*")
      .order("data_visita",{ascending:false})

    setVisitas(data || [])
  }

  async function carregarPropriedades(){
    const { data } = await supabase
      .from("propriedades")
      .select("nome")

    setPropriedades(data?.map(p=>p.nome) || [])
  }

  function toggleCard(index:number){
    if(abertos.includes(index)){
      setAbertos(abertos.filter(i => i !== index))
    }else{
      setAbertos([...abertos, index])
    }
  }

  function iniciarEdicao(visita:any){
    setEditandoId(visita.id)
    setFormEdit(visita)
  }

  async function salvarEdicao(){
    const { error } = await supabase
      .from("visitas")
      .update({
        motivo: formEdit.motivo,
        mensagem_produtor: formEdit.mensagem_produtor,
        observacao: formEdit.observacao,
        midia_link: formEdit.midia_link
      })
      .eq("id", editandoId)

    if(error){
      alert("Erro ao atualizar")
      return
    }

    setEditandoId(null)
    carregarVisitas()
  }

  async function excluirVisita(id:string){
    const confirmar = confirm("Tem certeza que deseja excluir esta visita?")
    if(!confirmar) return

    const { error } = await supabase
      .from("visitas")
      .delete()
      .eq("id", id)

    if(error){
      alert("Erro ao excluir")
      return
    }

    carregarVisitas()
  }

  function formatarData(dataString:any){
    if(!dataString) return "-"

    return new Date(dataString).toLocaleString("pt-BR",{
      timeZone: "America/Sao_Paulo",
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    })
  }

  const visitasFiltradas = visitas.filter(v=>{
    const mesOk = filtroMes ? v.data_visita?.startsWith(filtroMes) : true
    const propOk = filtroPropriedade ? v.propriedade === filtroPropriedade : true
    return mesOk && propOk
  })

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
        marginBottom:30
      }}>

        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{fontSize:22}}>📋</div>

          <h1 style={{
            margin:0,
            fontSize:24,
            fontWeight:600,
            color:"#1f2937"
          }}>
            Visitas
          </h1>
        </div>

        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <Link href="/dashboard">
            <button style={btnVoltar}>← Voltar</button>
          </Link>

          <Link href="/visitas/nova-visita">
            <button style={btnPrimary}>+ Nova Visita</button>
          </Link>
        </div>

      </div>

      {/* FILTROS */}
      <div style={{display:"flex", gap:12, marginBottom:25}}>
        <select value={filtroMes} onChange={e=>setFiltroMes(e.target.value)} style={input}>
          <option value="">Todos os meses</option>
          <option value="2026-01">Jan</option>
          <option value="2026-02">Fev</option>
          <option value="2026-03">Mar</option>
        </select>

        <select value={filtroPropriedade} onChange={e=>setFiltroPropriedade(e.target.value)} style={input}>
          <option value="">Todas propriedades</option>
          {propriedades.map((p,i)=>(
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
        gap:20
      }}>

        {visitasFiltradas.map((v,index)=>(

          <div key={v.id || index} style={card}>

            <strong style={{fontSize:15}}>
              {v.propriedade}
            </strong>

            <div style={linha}>
              <b>Data:</b> {formatarData(v.data_visita)}
            </div>

            <div style={linha}>
              <b>Motivo:</b>{" "}
              {editandoId === v.id ? (
                <input
                  value={formEdit.motivo || ""}
                  onChange={e=>setFormEdit({...formEdit, motivo:e.target.value})}
                  style={inputFull}
                />
              ) : (
                v.motivo || "-"
              )}
            </div>

            <button onClick={()=>toggleCard(index)} style={btnToggle}>
              {abertos.includes(index) ? "Ocultar" : "Ver mais"}
            </button>

            {abertos.includes(index) && (
              <div style={{marginTop:10}}>

                <div style={linha}>
                  <b>Msg Produtor:</b>{" "}
                  {editandoId === v.id ? (
                    <input
                      value={formEdit.mensagem_produtor || ""}
                      onChange={e=>setFormEdit({...formEdit, mensagem_produtor:e.target.value})}
                      style={inputFull}
                    />
                  ) : (
                    v.mensagem_produtor || "-"
                  )}
                </div>

                <div style={linha}>
                  <b>Obs:</b>{" "}
                  {editandoId === v.id ? (
                    <textarea
                      value={formEdit.observacao || ""}
                      onChange={e=>setFormEdit({...formEdit, observacao:e.target.value})}
                      style={textarea}
                    />
                  ) : (
                    v.observacao || "-"
                  )}
                </div>

                {editandoId === v.id && (
                  <button onClick={salvarEdicao} style={btnPrimary}>
                    Salvar
                  </button>
                )}

              </div>
            )}

            {v.midia_link && (
              <div style={{marginTop:12}}>
                <a href={v.midia_link} target="_blank" style={link}>
                  🔗 Abrir mídia
                </a>
              </div>
            )}

            {/* BOTÕES DISCRETOS NO CANTO */}
            <div style={acoesCard}>
              <button onClick={()=>iniciarEdicao(v)} style={btnIconMinimal}>
                ✏️
              </button>

              <button onClick={()=>excluirVisita(v.id)} style={btnIconMinimal}>
                🗑️
              </button>
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

/* 🎨 ESTILO */

const card = {
  background:"#fff",
  borderRadius:14,
  padding:16,
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)",
  position:"relative"
}

const linha = {
  fontSize:13,
  color:"#374151",
  marginBottom:6
}

const input = {
  padding:"9px",
  borderRadius:8,
  border:"1px solid #d1d5db"
}

const inputFull = {
  width:"100%",
  padding:"6px",
  borderRadius:6,
  border:"1px solid #ccc",
  marginTop:4
}

const textarea = {
  width:"100%",
  padding:"6px",
  borderRadius:6,
  border:"1px solid #ccc",
  marginTop:4
}

const btnPrimary = {
  padding:"7px 12px",
  background:"#2f4f5f",
  color:"#fff",
  border:"none",
  borderRadius:8,
  cursor:"pointer",
  marginTop:10
}

const btnVoltar = {
  padding:"7px 12px",
  background:"#e5e7eb",
  border:"none",
  borderRadius:8,
  cursor:"pointer",
  fontSize:13
}

const btnToggle = {
  marginTop:10,
  padding:"5px 9px",
  fontSize:12,
  background:"#f9fafb",
  border:"1px solid #e5e7eb",
  borderRadius:8,
  cursor:"pointer"
}

const link = {
  fontSize:13,
  color:"#2563eb",
  textDecoration:"none"
}

/* ✨ NOVO - AÇÕES DISCRETAS */

const acoesCard = {
  position:"absolute" as const,
  bottom:10,
  right:10,
  display:"flex",
  gap:6
}

const btnIconMinimal = {
  background:"transparent",
  border:"none",
  cursor:"pointer",
  fontSize:13,
  opacity:0.6
}
