"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CronogramaSemana() {

  const router = useRouter();

  const [dados, setDados] = useState<any[]>([]);
  const [propriedades, setPropriedades] = useState<string[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    const hoje = new Date();

    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    const { data, error } = await supabase
      .from("cronograma_semanal")
      .select("*")
      .gte("data", inicioSemana.toISOString())
      .lte("data", fimSemana.toISOString())
      .order("data", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao carregar cronograma");
      return;
    }

    const lista = data || [];
    setDados(lista);

    const props = [...new Set(lista.map(d => d.propriedade))];
    setPropriedades(props);
  }

  const filtrado = filtro
    ? dados.filter(d => d.propriedade === filtro)
    : dados;

  async function concluir(id: string) {
    const { error } = await supabase
      .from("cronograma_semanal")
      .update({ status: "feito" })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar");
      return;
    }

    carregarDados();
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
        }

        .card h3 {
          margin: 0;
          font-size: 16px;
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
          margin-bottom: 6px;
        }

        .status {
          font-weight: bold;
        }

        .feito {
          color: #166534;
        }

        .pendente {
          color: #b45309;
        }

        .btn-done {
          margin-top: 10px;
          padding: 8px;
          border-radius: 8px;
          border: none;
          background: #22c55e;
          color: white;
          cursor: pointer;
        }
      `}</style>

      <div className="container">

        {/* HEADER */}
        <div className="header">

          <div className="title">
            📅 Cronograma Semanal
          </div>

          <div className="actions">
            <button className="btn btn-secondary" onClick={()=>router.push("/dashboard")}>
              ← Voltar
            </button>
          </div>

        </div>

        {/* FILTRO */}
        <div className="filtros">
          <select
            className="select"
            value={filtro}
            onChange={(e)=>setFiltro(e.target.value)}
          >
            <option value="">Todas propriedades</option>
            {propriedades.map((p,i)=>(
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* GRID */}
        <div className="grid">

          {filtrado.length === 0 && (
            <div>Nenhuma atividade na semana</div>
          )}

          {filtrado.map((item) => (

            <div key={item.id} className="card">

              <h3>{item.propriedade}</h3>

              <div className="sub">
                {new Date(item.data).toLocaleDateString("pt-BR")}
              </div>

              <div className="divider"></div>

              <div className="info">
                <strong>Atividade:</strong> {item.atividade}
              </div>

              <div className="info">
                <strong>Responsável:</strong> {item.responsavel}
              </div>

              <div className={`status ${item.status === "feito" ? "feito" : "pendente"}`}>
                {item.status}
              </div>

              {item.status !== "feito" && (
                <button
                  className="btn-done"
                  onClick={() => concluir(item.id)}
                >
                  Concluir
                </button>
              )}

            </div>

          ))}

        </div>

      </div>
    </>
  );
}