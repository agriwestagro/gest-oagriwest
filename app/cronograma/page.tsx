"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Cronograma() {

  const router = useRouter();

  const [dados, setDados] = useState<any[]>([]);
  const [aberto, setAberto] = useState<string | null>(null);

  const [filtroMes, setFiltroMes] = useState("");
  const [filtroProdutor, setFiltroProdutor] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    const { data } = await supabase
      .from("cronograma_semanal")
      .select("*")
      .order("data_inicio", { ascending: true });

    setDados(data || []);
  }

  async function toggleRealizado(id: string, atual: boolean) {

    await supabase
      .from("cronograma_semanal")
      .update({ realizado: !atual })
      .eq("id", id);

    carregar();
  }

  function formatarData(data: string) {

    if (!data) return "";

    return new Date(data).toLocaleDateString("pt-BR");
  }

  const produtores = useMemo(() => {

    return [...new Set(dados.map((d) => d.produtor).filter(Boolean))];

  }, [dados]);

  const dadosFiltrados = useMemo(() => {

    return dados.filter((item) => {

      const mesAtividade = item.data_inicio?.slice(0, 7);

      const matchMes =
        !filtroMes || mesAtividade === filtroMes;

      const matchProdutor =
        !filtroProdutor || item.produtor === filtroProdutor;

      return matchMes && matchProdutor;
    });

  }, [dados, filtroMes, filtroProdutor]);

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
          max-width: 1100px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title {
          font-size: 26px;
          font-weight: bold;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-secondary {
          background: #e4e7eb;
        }

        .btn-edit {
          background: #facc15;
        }

        .filtros {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filtro {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
          min-width: 180px;
        }

        .lista {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item {
          background: white;
          border-radius: 14px;
          padding: 18px;
          border: 1px solid #eee;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .linha {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          gap: 20px;
        }

        .sub {
          font-size: 13px;
          color: #666;
          margin-top: 5px;
        }

        .detalhe {
          margin-top: 15px;
          font-size: 14px;
          color: #444;
        }

        .status-ok {
          color: #16a34a;
          font-weight: bold;
        }

        .status-pendente {
          color: #b45309;
          font-weight: bold;
        }

        .acoes-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

      `}</style>

      <div className="container">

        {/* HEADER */}
        <div className="header">

          <div className="title">
            📅 Cronograma Semanal
          </div>

          <div className="actions">

            <button
              className="btn btn-primary"
              onClick={() => router.push("/cronograma/novo")}
            >
              + Novo
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => router.push("/dashboard")}
            >
              ← Voltar
            </button>

          </div>

        </div>

        {/* FILTROS */}
        <div className="filtros">

          <input
            type="month"
            className="filtro"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
          />

          <select
            className="filtro"
            value={filtroProdutor}
            onChange={(e) => setFiltroProdutor(e.target.value)}
          >

            <option value="">
              Todos produtores
            </option>

            {produtores.map((produtor) => (

              <option key={produtor} value={produtor}>
                {produtor}
              </option>

            ))}

          </select>

        </div>

        {/* LISTA */}
        <div className="lista">

          {dadosFiltrados.length === 0 && (
            <div>Nenhuma atividade encontrada.</div>
          )}

          {dadosFiltrados.map((item) => (

            <div key={item.id} className="item">

              <div
                className="linha"
                onClick={() =>
                  setAberto(aberto === item.id ? null : item.id)
                }
              >

                <div>

                  <strong>{item.titulo}</strong>

                  <div className="sub">

                    {item.produtor} •
                    Início: {formatarData(item.data_inicio)} •
                    Fim: {formatarData(item.data_fim)}

                  </div>

                </div>

                <div className="acoes-item">

                  <button
                    className="btn btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/cronograma/editar/${item.id}`);
                    }}
                  >
                    Editar
                  </button>

                  <input
                    type="checkbox"
                    checked={item.realizado}
                    onChange={() =>
                      toggleRealizado(item.id, item.realizado)
                    }
                  />

                </div>

              </div>

              {aberto === item.id && (

                <div className="detalhe">

                  <p>
                    <strong>Motivo:</strong> {item.motivo}
                  </p>

                  <p>
                    <strong>Descrição:</strong> {item.descricao}
                  </p>

                  <p
                    className={
                      item.realizado
                        ? "status-ok"
                        : "status-pendente"
                    }
                  >
                    {item.realizado
                      ? "Realizado"
                      : "Pendente"}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>
    </>
  );
}
