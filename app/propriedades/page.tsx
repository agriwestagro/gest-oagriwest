"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PropriedadesPage() {
  const router = useRouter();
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aberto, setAberto] = useState<string | null>(null);

  async function carregarPropriedades() {
    const { data, error } = await supabase
      .from("propriedades")
      .select("*");

    if (!error && data) {
      setPropriedades(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarPropriedades();
  }, []);

  function toggleObservacao(id: string) {
    setAberto(aberto === id ? null : id);
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

        .btn-primary {
          background: #2c5364;
          color: white;
        }

        .btn-secondary {
          background: #e4e7eb;
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
          margin-bottom: 10px;
          font-size: 18px;
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

        .obs-btn {
          margin-top: 10px;
          font-size: 13px;
          cursor: pointer;
          color: #2c5364;
          font-weight: bold;
        }

        .observacoes {
          margin-top: 10px;
          padding: 10px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 13px;
          color: #444;
          border: 1px solid #eee;
        }

        .empty {
          text-align: center;
          margin-top: 50px;
          color: #777;
        }
      `}</style>

      <div className="container">

        <div className="header">
          <div className="title">
            🏡 Propriedades
          </div>

          <div className="actions">
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/dashboard")}
            >
              ← Voltar
            </button>

            <button
              className="btn btn-primary"
              onClick={() => router.push("/propriedades/nova")}
            >
              + Nova Propriedade
            </button>
          </div>
        </div>

        {loading && <p>Carregando propriedades...</p>}

        {!loading && propriedades.length > 0 && (
          <div className="grid">
            {propriedades.map((prop) => (
              <div key={prop.id} className="card">
                <h3>{prop.nome}</h3>

                <div className="divider"></div>

                <div className="info">
                  <strong>Produtor:</strong> {prop.produtor}
                </div>

                <div className="info">
                  <strong>Município:</strong> {prop.municipio}
                </div>

                <div className="info">
                  <strong>Área:</strong> {prop.area} ha
                </div>

                <div className="info">
                  <strong>Cultura:</strong> {prop.cultura}
                </div>

                {/* BOTÃO OBS */}
                {prop.observacoes && (
                  <div
                    className="obs-btn"
                    onClick={() => toggleObservacao(prop.id)}
                  >
                    {aberto === prop.id ? "▲ Ocultar observações" : "▼ Ver observações"}
                  </div>
                )}

                {/* OBS EXPANDIDA */}
                {aberto === prop.id && (
                  <div className="observacoes">
                    {prop.observacoes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && propriedades.length === 0 && (
          <div className="empty">
            Nenhuma propriedade cadastrada ainda.
          </div>
        )}

      </div>
    </>
  );
}