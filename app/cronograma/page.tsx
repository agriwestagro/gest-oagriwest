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

  const [editando, setEditando] = useState<any>(null);

  const [formEdit, setFormEdit] = useState({
    titulo: "",
    motivo: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    observacoes: "",
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    const { data, error } = await supabase
      .from("cronograma_semanal")
      .select("*")
      .order("data_inicio", {
        ascending: true,
      });

    if (error) {
      console.log(error);
      return;
    }

    setDados(data || []);
  }

  async function toggleRealizado(
    id: any,
    atual: boolean
  ) {

    const { error } = await supabase
      .from("cronograma_semanal")
      .update({
        realizado: !atual,
        status: !atual
          ? "realizado"
          : "pendente",
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setDados((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              realizado: !atual,
              status: !atual
                ? "realizado"
                : "pendente",
            }
          : item
      )
    );
  }

  async function excluir(id: any) {

    const confirmar = confirm(
      "Deseja realmente excluir esta atividade?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("cronograma_semanal")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);

      alert(
        "Erro ao excluir: " +
          error.message
      );

      return;
    }

    setDados((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    if (aberto === id) {
      setAberto(null);
    }
  }

  function abrirEdicao(item: any) {

    setEditando(item.id);

    setAberto(item.id);

    setFormEdit({
      titulo: item.titulo || "",
      motivo: item.motivo || "",
      descricao:
        item.descricao || "",
      data_inicio:
        item.data_inicio || "",
      data_fim:
        item.data_fim || "",
      observacoes:
        item.observacoes || "",
    });
  }

  async function salvarEdicao(
    id: any
  ) {

    const { error } = await supabase
      .from("cronograma_semanal")
      .update({
        titulo:
          formEdit.titulo,
        motivo:
          formEdit.motivo,
        descricao:
          formEdit.descricao,
        data_inicio:
          formEdit.data_inicio,
        data_fim:
          formEdit.data_fim,
        observacoes:
          formEdit.observacoes,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      alert("Erro ao salvar");
      return;
    }

    setDados((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...formEdit,
            }
          : item
      )
    );

    setEditando(null);

    alert("Alterações salvas");
  }

  async function salvarSomenteObservacoes(
    id: any,
    observacoes: string
  ) {

    const { error } = await supabase
      .from("cronograma_semanal")
      .update({
        observacoes,
      })
      .eq("id", id);

    if (error) {
      console.log(error);

      alert(
        "Erro ao salvar observações"
      );

      return;
    }

    alert("Observações salvas");
  }

  function formatarData(
    data: string
  ) {

    if (!data) return "";

    const partes = data
      .substring(0, 10)
      .split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function verificarAlerta(
    dataFim: string,
    realizado: boolean
  ) {

    if (
      !dataFim ||
      realizado
    ) return false;

    const hoje = new Date();

    hoje.setHours(0,0,0,0);

    const fim = new Date(dataFim);

    fim.setHours(0,0,0,0);

    const diff =
      (fim.getTime() -
        hoje.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff <= 3 && diff >= 0;
  }

  const produtores = useMemo(() => {

    return [
      ...new Set(
        dados
          .map(
            (d) =>
              d.produtor ||
              d.propriedade
          )
          .filter(Boolean)
      ),
    ];

  }, [dados]);

  const dadosFiltrados =
    useMemo(() => {

      return dados.filter(
        (item) => {

          let matchMes = true;

          if (filtroMes) {

            const anoMesItem =
              item.data_inicio?.substring(
                0,
                7
              );

            matchMes =
              anoMesItem ===
              filtroMes;
          }

          const produtorItem =
            item.produtor ||
            item.propriedade;

          const matchProdutor =
            !filtroProdutor ||
            produtorItem ===
              filtroProdutor;

          return (
            matchMes &&
            matchProdutor
          );
        }
      );

    }, [
      dados,
      filtroMes,
      filtroProdutor,
    ]);

  return (
    <>
      <style>{`

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f5f7fb;
          color: #111827;
        }

        .container {
          max-width: 1150px;
          margin: 0 auto;
          padding: 35px 25px 60px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          border: none;
          cursor: pointer;
          transition: 0.2s;
          font-weight: 600;
        }

        .btn-main {
          background: #111827;
          color: white;
          padding: 11px 18px;
          border-radius: 12px;
          font-size: 14px;
        }

        .btn-main:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .btn-light {
          background: white;
          border: 1px solid #e5e7eb;
          color: #374151;
          padding: 11px 18px;
          border-radius: 12px;
          font-size: 14px;
        }

        .btn-light:hover {
          background: #f9fafb;
        }

        .filtros {
          display: flex;
          gap: 15px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .filtro {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 11px 14px;
          min-width: 190px;
          font-size: 14px;
          color: #374151;
        }

        .lista {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .item {
          background: white;
          border-radius: 20px;
          padding: 22px;
          border: 1px solid #edf0f5;
          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.04),
            0 1px 2px rgba(15, 23, 42, 0.03);
          transition: 0.25s;
        }

        .item-alerta {
          border: 1px solid #facc15;
          background:
            linear-gradient(
              180deg,
              #fffdf5 0%,
              #ffffff 100%
            );
          box-shadow:
            0 4px 14px rgba(250, 204, 21, 0.12);
        }

        .item:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 24px rgba(15, 23, 42, 0.08),
            0 2px 6px rgba(15, 23, 42, 0.05);
        }

        .linha {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          cursor: pointer;
        }

        .titulo-area {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .titulo-topo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .titulo-topo strong {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.2px;
        }

        .realizado-tag {
          background: #dcfce7;
          color: #166534;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alerta-badge {
          background: #fef3c7;
          color: #92400e;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sub {
          font-size: 13px;
          color: #6b7280;
        }

        .acoes-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .link-action {
          font-size: 11px;
          color: #9ca3af;
          cursor: pointer;
          transition: 0.2s;
          user-select: none;
          font-weight: 500;
        }

        .link-action:hover {
          color: #111827;
        }

        .link-delete:hover {
          color: #dc2626;
        }

        .btn-obs {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 7px 11px;
          font-size: 12px;
          color: #374151;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-obs:hover {
          background: #f3f4f6;
        }

        .check-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: 0.2s;
        }

        .check-on {
          background: #16a34a;
          color: white;
          box-shadow: 0 4px 10px rgba(22,163,74,0.25);
        }

        .check-off {
          background: #eef2f7;
          color: #9ca3af;
        }

        .check-btn:hover {
          transform: scale(1.06);
        }

        .detalhe {
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }

        .detalhe p {
          font-size: 14px;
          line-height: 1.7;
          color: #374151;
        }

        .status-ok {
          color: #15803d;
          font-weight: 700;
        }

        .status-pendente {
          color: #b45309;
          font-weight: 700;
        }

        .obs-box {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          padding: 14px;
          font-size: 14px;
          margin-top: 10px;
          resize: vertical;
          box-sizing: border-box;
          font-family: Inter, Arial, sans-serif;
          background: #fafafa;
          transition: 0.2s;
        }

        .obs-box:focus {
          outline: none;
          border-color: #94a3b8;
          background: white;
        }

        .mini-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .btn-save-small {
          background: #111827;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-save-small:hover {
          opacity: 0.92;
        }

        .btn-cancel-small {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #374151;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-cancel-small:hover {
          background: #e5e7eb;
        }

      `}</style>

      <div className="container">

        <div className="header">

          <div className="title">
            📅 Cronograma Semanal
          </div>

          <div className="actions">

            <button
              className="btn btn-main"
              onClick={() =>
                router.push("/cronograma/novo")
              }
            >
              + Novo
            </button>

            <button
              className="btn btn-light"
              onClick={() =>
                router.push("/dashboard")
              }
            >
              ← Voltar
            </button>

          </div>

        </div>

        <div className="filtros">

          <input
            type="month"
            className="filtro"
            value={filtroMes}
            onChange={(e) =>
              setFiltroMes(e.target.value)
            }
          />

          <select
            className="filtro"
            value={filtroProdutor}
            onChange={(e) =>
              setFiltroProdutor(
                e.target.value
              )
            }
          >

            <option value="">
              Todos produtores
            </option>

            {produtores.map(
              (produtor) => (

                <option
                  key={produtor}
                  value={produtor}
                >
                  {produtor}
                </option>

              )
            )}

          </select>

        </div>

        <div className="lista">

          {dadosFiltrados.length === 0 && (
            <div>
              Nenhuma atividade encontrada.
            </div>
          )}

          {dadosFiltrados.map((item) => (

            <div
              key={item.id}
              className={`item ${
                verificarAlerta(
                  item.data_fim,
                  item.realizado
                )
                  ? "item-alerta"
                  : ""
              }`}
            >

              {/* restante permanece igual */}

            </div>

          ))}

        </div>

      </div>
    </>
  );
}
