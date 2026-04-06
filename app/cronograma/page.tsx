"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Cronograma() {

  const router = useRouter();
  const [dados, setDados] = useState<any[]>([]);
  const [aberto, setAberto] = useState<string | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await supabase
      .from("cronograma_semanal")
      .select("*")
      .order("data_limite", { ascending: true });

    setDados(data || []);
  }

  async function toggleRealizado(id: string, atual: boolean) {

    await supabase
      .from("cronograma_semanal")
      .update({ realizado: !atual })
      .eq("id", id);

    carregar();
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
          max-width: 1000px;
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
          background: #2563eb;
          color: white;
        }

        .btn-secondary {
          background: #e4e7eb;
        }

        .lista {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item {
          background: white;
          border-radius: 12px;
          padding: 15px;
          border: 1px solid #eee;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .linha {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .sub {
          font-size: 13px;
          color: #777;
        }

        .detalhe {
          margin-top: 10px;
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

        {/* LISTA */}
        <div className="lista">

          {dados.length === 0 && (
            <div>Nenhuma atividade cadastrada.</div>
          )}

          {dados.map((item) => (

            <div key={item.id} className="item">

              {/* LINHA RESUMO */}
              <div
                className="linha"
                onClick={() => setAberto(aberto === item.id ? null : item.id)}
              >

                <div>
                  <strong>{item.titulo}</strong>
                  <div className="sub">
                    {item.propriedade} • {item.data_limite}
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={item.realizado}
                  onChange={() => toggleRealizado(item.id, item.realizado)}
                />

              </div>

              {/* DETALHE */}
              {aberto === item.id && (

                <div className="detalhe">

                  <p><strong>Motivo:</strong> {item.motivo}</p>
                  <p><strong>Descrição:</strong> {item.descricao}</p>

                  <p className={item.realizado ? "status-ok" : "status-pendente"}>
                    {item.realizado ? "Realizado" : "Pendente"}
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
