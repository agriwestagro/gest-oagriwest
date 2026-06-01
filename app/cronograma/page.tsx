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
      .order("data_fim", {
        ascending: true,
      });

    if (error) {
      console.log(error);
      return;
    }

    setDados(data || []);
  }

  async function toggleRealizado(id: any, atual: boolean) {
    const { error } = await supabase
      .from("cronograma_semanal")
      .update({
        realizado: !atual,
        status: !atual ? "realizado" : "pendente",
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
              status: !atual ? "realizado" : "pendente",
            }
          : item
      )
    );
  }

  async function excluir(id: any) {
    const confirmar = confirm("Deseja realmente excluir esta atividade?");
    if (!confirmar) return;

    const { data, error } = await supabase
      .from("cronograma_semanal")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
      alert("Erro ao excluir");
      return;
    }

    if (data && data.length === 0) {
      alert("A atividade não pôde ser excluída no banco de dados. Verifique as permissões (RLS) no Supabase.");
      carregar(); 
      return;
    }

    setDados((prev) => prev.filter((item) => item.id !== id));
  }

  function abrirEdicao(item: any) {
    setEditando(item.id);
    setAberto(item.id);

    setFormEdit({
      titulo: item.titulo || "",
      motivo: item.motivo || "",
      descricao: item.descricao || "",
      data_inicio: item.data_inicio || "",
      data_fim: item.data_fim || "",
      observacoes: item.observacoes || "",
    });
  }

  async function salvarEdicao(id: any) {
    const { error } = await supabase
      .from("cronograma_semanal")
      .update({
        titulo: formEdit.titulo,
        motivo: formEdit.motivo,
        descricao: formEdit.descricao,
        data_inicio: formEdit.data_inicio,
        data_fim: formEdit.data_fim,
        observacoes: formEdit.observacoes,
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

  async function salvarObservacoes(id: any, observacoes: string) {
    const { error } = await supabase
      .from("cronograma_semanal")
      .update({
        observacoes,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      alert("Erro ao salvar observações");
      return;
    }
  }

  function formatarData(data: string) {
    if (!data) return "";
    const partes = data.substring(0, 10).split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function verificarAlerta(dataFim: string, realizado: boolean) {
    if (!dataFim || realizado) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const fim = new Date(dataFim);
    fim.setHours(0, 0, 0, 0);

    const diff = (fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 3 && diff >= 0;
  }

  function verificarAtraso(dataFim: string, realizado: boolean) {
    if (!dataFim || realizado) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const fim = new Date(dataFim);
    fim.setHours(0, 0, 0, 0);

    return fim < hoje;
  }

  const produtores = useMemo(() => {
    return [
      ...new Set(
        dados.map((d) => d.produtor || d.propriedade).filter(Boolean)
      ),
    ];
  }, [dados]);

const dadosFiltrados = useMemo(() => {
  return dados
    .filter((item) => {
      let matchMes = true;

      if (filtroMes) {
        const anoMes = item.data_inicio?.substring(0, 7);
        matchMes = anoMes === filtroMes;
      }

      const produtor = item.produtor || item.propriedade;
      const matchProdutor =
        !filtroProdutor || produtor === filtroProdutor;

      return matchMes && matchProdutor;
    })
    .sort((a, b) => {
      // Pendentes primeiro, realizados por último
      if (a.realizado !== b.realizado) {
        return a.realizado ? 1 : -1;
      }

      // Dentro de cada grupo mantém ordenação por data fim
      return (
        new Date(a.data_fim).getTime() -
        new Date(b.data_fim).getTime()
      );
    });
}, [dados, filtroMes, filtroProdutor]);

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background: #f5f7fb;
          font-family: Inter, Arial;
          color: #111827;
        }
        .container {
          max-width: 1150px;
          margin: auto;
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
        }
        .actions {
          display: flex;
          gap: 10px;
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
        }
        .btn-light {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 11px 18px;
          border-radius: 12px;
        }
        .filtros {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }
        .filtro {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 11px 14px;
          min-width: 180px;
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
          box-shadow: 0 4px 12px rgba(15,23,42,0.04);
        }
        .item-alerta {
          border: 1px solid #facc15;
          background: linear-gradient(180deg, #fffdf5 0%, #ffffff 100%);
        }
        .item-atrasado {
          border: 1px solid #ef4444;
          background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
          box-shadow: 0 4px 14px rgba(239,68,68,0.12);
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
        }
        .realizado-tag {
          background: #dcfce7;
          color: #166534;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .alerta-badge {
          background: #fef3c7;
          color: #92400e;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .atrasado-badge {
          background: #fee2e2;
          color: #991b1b;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
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
          cursor: pointer;
        }
        .check-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: 0.2s;
        }
        .check-on {
          background: #16a34a;
          color: white;
        }
        .check-off {
          background: #eef2f7;
          color: #9ca3af;
        }
        .detalhe {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }
        .obs-box {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          padding: 14px;
          margin-top: 10px;
          resize: vertical;
          box-sizing: border-box;
          font-size: 14px;
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
          cursor: pointer;
        }
        .btn-cancel-small {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          cursor: pointer;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="title">📅 Cronograma Semanal</div>
          <div className="actions">
            <button
              className="btn btn-main"
              onClick={() => router.push("/cronograma/novo")}
            >
              + Novo
            </button>
            <button
              className="btn btn-light"
              onClick={() => router.push("/dashboard")}
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
            onChange={(e) => setFiltroMes(e.target.value)}
          />
          <select
            className="filtro"
            value={filtroProdutor}
            onChange={(e) => setFiltroProdutor(e.target.value)}
          >
            <option value="">Todos produtores</option>
            {produtores.map((produtor) => (
              <option key={produtor} value={produtor}>
                {produtor}
              </option>
            ))}
          </select>
        </div>

        <div className="lista">
          {dadosFiltrados.map((item) => (
            <div
              key={item.id}
              className={`item ${
                verificarAtraso(item.data_fim, item.realizado)
                  ? "item-atrasado"
                  : verificarAlerta(item.data_fim, item.realizado)
                  ? "item-alerta"
                  : ""
              }`}
            >
              <div
                className="linha"
                onClick={() =>
                  setAberto(aberto === item.id ? null : item.id)
                }
              >
                <div className="titulo-area">
                  <div className="titulo-topo">
                    <strong>{item.titulo}</strong>
                    {item.realizado && (
                      <div className="realizado-tag">realizado</div>
                    )}
                    {verificarAtraso(item.data_fim, item.realizado) ? (
                      <div className="atrasado-badge">em atraso</div>
                    ) : (
                      verificarAlerta(item.data_fim, item.realizado) && (
                        <div className="alerta-badge">prazo próximo</div>
                      )
                    )}
                  </div>
                  <div className="sub">
                    {item.produtor || item.propriedade} • Início:{" "}
                    {formatarData(item.data_inicio)} • Fim:{" "}
                    {formatarData(item.data_fim)}
                  </div>
                </div>

                <div className="acoes-item">
                  <div
                    className="link-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirEdicao(item);
                    }}
                  >
                    editar
                  </div>
                  <div
                    className="link-action link-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      excluir(item.id);
                    }}
                  >
                    excluir
                  </div>
                  <button
                    className="btn-obs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAberto(aberto === item.id ? null : item.id);
                    }}
                  >
                    Observações
                  </button>
                  <button
                    className={`check-btn ${
                      item.realizado ? "check-on" : "check-off"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRealizado(item.id, item.realizado);
                    }}
                  >
                    {item.realizado ? "✓" : "○"}
                  </button>
                </div>
              </div>

              {aberto === item.id && (
                <div className="detalhe">
                  {editando === item.id ? (
                    <>
                      <input
                        className="obs-box"
                        value={formEdit.titulo}
                        placeholder="Título"
                        onChange={(e) =>
                          setFormEdit({ ...formEdit, titulo: e.target.value })
                        }
                      />
                      <input
                        className="obs-box"
                        value={formEdit.motivo}
                        placeholder="Motivo"
                        onChange={(e) =>
                          setFormEdit({ ...formEdit, motivo: e.target.value })
                        }
                      />
                      <textarea
                        className="obs-box"
                        value={formEdit.descricao}
                        placeholder="Descrição"
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            descricao: e.target.value,
                          })
                        }
                      />
                      <div style={{ display: "flex", gap: 10 }}>
                        <input
                          type="date"
                          className="obs-box"
                          value={formEdit.data_inicio}
                          onChange={(e) =>
                            setFormEdit({
                              ...formEdit,
                              data_inicio: e.target.value,
                            })
                          }
                        />
                        <input
                          type="date"
                          className="obs-box"
                          value={formEdit.data_fim}
                          onChange={(e) =>
                            setFormEdit({
                              ...formEdit,
                              data_fim: e.target.value,
                            })
                          }
                        />
                      </div>
                      <textarea
                        className="obs-box"
                        value={formEdit.observacoes}
                        placeholder="Observações"
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            observacoes: e.target.value,
                          })
                        }
                      />
                      <div className="mini-actions">
                        <button
                          className="btn-save-small"
                          onClick={() => salvarEdicao(item.id)}
                        >
                          salvar alterações
                        </button>
                        <button
                          className="btn-cancel-small"
                          onClick={() => setEditando(null)}
                        >
                          cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Motivo:</strong> {item.motivo || "-"}
                      </p>
                      <p>
                        <strong>Descrição:</strong> {item.descricao || "-"}
                      </p>
                      <textarea
                        className="obs-box"
                        value={item.observacoes || ""}
                        placeholder="Adicionar observações..."
                        onChange={(e) => {
                          const texto = e.target.value;
                          setDados((prev) =>
                            prev.map((d) =>
                              d.id === item.id
                                ? { ...d, observacoes: texto }
                                : d
                            )
                          );
                        }}
                        onBlur={() =>
                          salvarObservacoes(item.id, item.observacoes || "")
                        }
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
