"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VisitasPage(){

  const router = useRouter();

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

    setPropriedades(data?.map((p:any)=>p.nome) || [])
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

        .btn-primary {
          background: #2c5364;
          color: white;
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
          position: relative;
        }

        .card:hover {
          transform: translateY(-3px);
        }

        .card h3 {
          margin-bottom: 10px;
          font-size: 16px;
        }

        .info {
          font-size: 14px;
          color: #555;
          margin-bottom: 6px;
        }

        .divider {
          height: 1px;
          background: #eee;
          margin: 10px 0;
        }

        .toggle {
          margin-top: 10px;
          font-size: 13px;
          cursor: pointer;
          color: #2c5364;
          font-weight: bold;
        }

        .box {
          margin-top: 10px;
          padding: 10px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        .input {
          width: 100%;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid #ccc;
          margin-top: 4px;
        }

        .acoes {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          gap: 6px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0.6;
        }

        .link {
          font-size: 13px;
          color: #2563eb;
          text-decoration: none;
        }
      `}</style>

      <div className="container">

        <div className="header">
          <div className="title">📋 Visitas</div>

          <div className="actions">
            <button className="btn btn-secondary" onClick={()=>router.push("/dashboard")}>
              ← Voltar
            </button>

            <button className="btn btn-primary" onClick={()=>router.push("/visitas/nova-visita")}>
              + Nova Visita
            </button>
          </div>
        </div>

        <div className="filtros">
          <select className="select" value={filtroMes} onChange={e=>setFiltroMes(e.target.value)}>
            <option value="">Todos os meses</option>
            <option value="2026-01">Jan</option>
            <option value="2026-02">Fev</option>
            <option value="2026-03">Mar</option>
          </select>

          <select className="select" value={filtroPropriedade} onChange={e=>setFiltroPropriedade(e.target.value)}>
            <option value="">Todas propriedades</option>
            {propriedades.map((p,i)=>(
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="grid">

          {visitasFiltradas.map((v,index)=>(

            <div key={v.id || index} className="card">

              <h3>{v.propriedade}</h3>

              <div className="divider"></div>

              <div className="info">
                <strong>Data:</strong> {formatarData(v.data_visita)}
              </div>

              <div className="info">
                <strong>Motivo:</strong>{" "}
                {editandoId === v.id ? (
                  <input
                    className="input"
                    value={formEdit.motivo || ""}
                    onChange={e=>setFormEdit({...formEdit, motivo:e.target.value})}
                  />
                ) : v.motivo || "-"}
              </div>

              <div className="toggle" onClick={()=>toggleCard(index)}>
                {abertos.includes(index) ? "▲ Ocultar detalhes" : "▼ Ver detalhes"}
              </div>

              {abertos.includes(index) && (
                <div className="box">

                  <div className="info">
                    <strong>Mensagem:</strong>{" "}
                    {editandoId === v.id ? (
                      <input
                        className="input"
                        value={formEdit.mensagem_produtor || ""}
                        onChange={e=>setFormEdit({...formEdit, mensagem_produtor:e.target.value})}
                      />
                    ) : v.mensagem_produtor || "-"}
                  </div>

                  <div className="info">
                    <strong>Observação:</strong>{" "}
                    {editandoId === v.id ? (
                      <textarea
                        className="input"
                        value={formEdit.observacao || ""}
                        onChange={e=>setFormEdit({...formEdit, observacao:e.target.value})}
                      />
                    ) : v.observacao || "-"}
                  </div>

                  {editandoId === v.id && (
                    <button className="btn btn-primary" onClick={salvarEdicao}>
                      Salvar
                    </button>
                  )}

                </div>
              )}

              {v.midia_link && (
                <div style={{marginTop:10}}>
                  <a href={v.midia_link} target="_blank" className="link">
                    🔗 Abrir mídia
                  </a>
                </div>
              )}

              <div className="acoes">
                <button className="icon-btn" onClick={()=>iniciarEdicao(v)}>✏️</button>
                <button className="icon-btn" onClick={()=>excluirVisita(v.id)}>🗑️</button>
              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  )
}
