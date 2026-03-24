"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NovaPropriedade() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [produtor, setProdutor] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [area, setArea] = useState("");
  const [cultura, setCultura] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  async function salvar() {
    setLoading(true);

    const { error } = await supabase.from("propriedades").insert([
      {
        nome,
        produtor,
        municipio,
        area,
        cultura,
        observacoes,
      },
    ]);

    if (error) {
      alert("Erro ao salvar");
      setLoading(false);
    } else {
      alert("Propriedade salva com sucesso");
      router.push("/propriedades");
    }
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
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          width: 420px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }

        .title {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          margin-bottom: 5px;
          color: #555;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          outline: none;
          transition: 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #2c5364;
          box-shadow: 0 0 0 2px rgba(44,83,100,0.1);
        }

        textarea {
          resize: none;
          height: 80px;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .btn {
          padding: 10px 15px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-secondary {
          background: #e4e7eb;
        }

        .btn-primary {
          background: #2c5364;
          color: white;
        }

        .btn-primary:hover {
          background: #203a43;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      <div className="container">
        <div className="card">

          <div className="title">
            🏡 Nova Propriedade
          </div>

          <div className="form-group">
            <label>Nome da Propriedade</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Produtor</label>
            <input
              value={produtor}
              onChange={(e) => setProdutor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Município</label>
            <input
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Área (ha)</label>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cultura</label>
            <input
              value={cultura}
              onChange={(e) => setCultura(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div className="actions">
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/propriedades")}
            >
              Voltar
            </button>

            <button
              className="btn btn-primary"
              onClick={salvar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}