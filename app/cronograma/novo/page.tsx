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
    data_inicio: "",
    data_fim: "",
  });

  useEffect(() => {
    carregarPropriedades();
  }, []);

  async function carregarPropriedades() {

    const { data } = await supabase
      .from("propriedades")
      .select("nome");

    setPropriedades(data?.map((p) => p.nome) || []);
  }

  function handleChange(e: any) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function salvar() {

    if (
      !form.titulo ||
      !form.propriedade ||
      !form.data_inicio ||
      !form.data_fim
    ) {
      alert("Preencha título, propriedade e datas.");
      return;
    }

    if (form.data_inicio > form.data_fim) {
      alert("A data de início não pode ser maior que a data final.");
      return;
    }

    const { error } = await supabase
      .from("cronograma_semanal")
      .insert([
        {
          titulo: form.titulo,
          motivo: form.motivo || null,
          descricao: form.descricao || null,
          propriedade: form.propriedade,

          data_inicio: form.data_inicio,
          data_fim: form.data_fim,

          data: form.data_inicio,

          realizado: false,
          status: "pendente",
        },
      ]);

    if (error) {
      console.log("ERRO COMPLETO:", error);
      alert(error.message);
      return;
    }

    alert("Cronograma salvo com sucesso.");

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
          max-width: 750px;
          margin: 40px auto;
          padding: 30px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input,
        .textarea,
        .select {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
          box-sizing: border-box;
        }

        .textarea {
          min-height: 120px;
          resize: vertical;
        }

        .row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .row > * {
          flex: 1;
          min-width: 200px;
        }

        .label {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 6px;
          color: #444;
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
          gap: 10px;
        }

        .btn {
          padding: 12px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: 0.2s;
        }

        .btn:hover {
          opacity: 0.9;
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

        <div className="title">
          ➕ Novo Cronograma
        </div>

        <div className="form">

          <div className="field">
            <div className="label">Título</div>

            <input
              className="input"
              name="titulo"
              placeholder="Digite o título"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <div className="label">Motivo</div>

            <input
              className="input"
              name="motivo"
              placeholder="Motivo da atividade"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <div className="label">Descrição</div>

            <textarea
              className="textarea"
              name="descricao"
              placeholder="Descrição da atividade"
              onChange={handleChange}
            />
          </div>

          <div className="row">

            <div className="field">

              <div className="label">
                Propriedade / Produtor
              </div>

              <select
                className="select"
                name="propriedade"
                onChange={handleChange}
              >

                <option value="">
                  Selecione
                </option>

                {propriedades.map((p, i) => (
                  <option key={i} value={p}>
                    {p}
                  </option>
                ))}

              </select>

            </div>

          </div>

          <div className="row">

            <div className="field">

              <div className="label">
                Data de Início
              </div>

              <input
                className="input"
                type="date"
                name="data_inicio"
                onChange={handleChange}
              />

            </div>

            <div className="field">

              <div className="label">
                Data Final
              </div>

              <input
                className="input"
                type="date"
                name="data_fim"
                onChange={handleChange}
              />

            </div>

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
            Salvar Cronograma
          </button>

        </div>

      </div>
    </>
  );
}
