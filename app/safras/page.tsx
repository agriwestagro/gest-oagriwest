"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HistoricoSafra() {

  const router = useRouter();

  const [dados, setDados] = useState<any[]>([]);
  const [propriedades, setPropriedades] = useState<string[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    const { data, error } = await supabase
      .from("safras")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Erro ao carregar");
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

  function moeda(v: any) {
    if (v === null || v === undefined) return "-";
    return Number(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function numero(v: any, sufixo = "") {
    if (v === null || v === undefined) return "-";
    return `${v}${sufixo}`;
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
          transition: 0.2s;
        }

        .card:hover {
          transform: translateY(-3px);
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

        .lucro {
          font-weight: bold;
          color: #166534;
        }

        .empty {
          text-align: center;
          margin-top: 50px;
          color: #777;
        }
      `}</style>

      <div className="container">

        {/* HEADER */}
        <div className="header">

          <div className="title">
            📊 Histórico de Safras
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
            <div className="empty">
              Nenhuma safra encontrada.
            </div>
          )}

          {filtrado.map((s, index) => (

            <div key={index} className="card">

              <h3>{s.propriedade}</h3>

              <div className="sub">
                {s.safra} • {s.cultura} • {numero(s.area, " ha")}
              </div>

              <div className="divider"></div>

              <div className="info">
                <strong>Produtividade:</strong> {numero(s.produtividade, " sc/alq")}
              </div>

              <div className="info">
                <strong>Custo/ha:</strong> {moeda(s.custo_ha)}
              </div>

              <div className="info">
                <strong>Preço Médio de Venda:</strong> {moeda(s.preco_venda)}
              </div>

              <div className="info">
                <strong>Receita:</strong> {moeda(s.receita)}
              </div>

              <div className="info lucro">
                <strong>Lucro por ha:</strong> {moeda(s.lucro)}
              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}
