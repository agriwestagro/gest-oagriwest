"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NovoCronograma() {

  const router = useRouter();

  const [propriedades, setPropriedades] = useState<string[]>([]);

  const [form, setForm] = useState({
    titulo: "",
    motivo: "",
    descricao: "",
    propriedade: "",
    data_limite: "",
  });

  useEffect(() => {
    carregarPropriedades();
  }, []);

  async function carregarPropriedades() {
    const { data } = await supabase.from("propriedades").select("nome");
    setPropriedades(data?.map((p) => p.nome) || []);
  }

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function salvar() {

    if (!form.titulo || !form.propriedade || !form.data_limite) {
      alert("Preencha Título, Propriedade e Data");
      return;
    }

    const { error } = await supabase
      .from("cronograma_semanal")
      .insert([{
        titulo: form.titulo,
        motivo: form.motivo || null,
        descricao: form.descricao || null,
        propriedade: form.propriedade,
        data_limite: form.data_limite,
        data: form.data_limite, // 👈 resolve o NOT NULL
        status: "pendente"
      }]);

    if (error) {
      console.log("ERRO COMPLETO:", error);
      alert(error.message);
      return;
    }

    alert("Salvo com sucesso");
    router.push("/cronograma");
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
          max-width: 700px;
          margin: 40px auto;
          padding: 30px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input, .textarea, .select {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .textarea {
          min-height: 100px;
        }

        .row {
          display: flex;
          gap: 10px;
        }

        .row > * {
          flex: 1;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-secondary {
          background: #e5e7eb;
        }
      `}</style>

      <div className="container">

        <div className="title">➕ Novo Cronograma</div>

        <div className="form">

          <input
            className="input"
            name="titulo"
            placeholder="Título"
            onChange={handleChange}
          />

          <input
            className="input"
            name="motivo"
            placeholder="Motivo"
            onChange={handleChange}
          />

          <textarea
            className="textarea"
            name="descricao"
            placeholder="Descrição"
            onChange={handleChange}
          />

          <div className="row">

            <select
              className="select"
              name="propriedade"
              onChange={handleChange}
            >
              <option value="">Propriedade</option>
              {propriedades.map((p, i) => (
                <option key={i}>{p}</option>
              ))}
            </select>

            <input
              className="input"
              type="date"
              name="data_limite"
              onChange={handleChange}
            />

          </div>

        </div>

        <div className="actions">

          <button
            className="btn btn-secondary"
            onClick={() => router.push("/cronograma")}
          >
            ← Voltar
          </button>

          <button
            className="btn btn-primary"
            onClick={salvar}
          >
            Salvar
          </button>

        </div>

      </div>
    </>
  );
}
