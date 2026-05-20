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

      alert(
        "Erro ao salvar"
      );

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

    alert(
      "Alterações salvas"
    );
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
          transition: 0.2s;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-secondary {
          background: #e4e7eb;
        }

        .filtros {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .filtro {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
          min-width: 180px;
          background: white;
        }

        .lista {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .item {
          background: white;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid #ececec;
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
          transition: 0.2s;
        }

        .item:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
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
          gap: 5px;
        }

        .titulo-topo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .realizado-tag {
          font-size: 10px;
          background: #dcfce7;
          color: #166534;
          padding: 3px 7px;
          border-radius: 20px;
          font-weight: bold;
        }

        .sub {
          font-size: 13px;
          color: #666;
        }

        .detalhe {
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
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

        .link-action {
          font-size: 11px;
          color: #777;
          cursor: pointer;
          transition: 0.2s;
          user-select: none;
        }

        .link-action:hover {
          color: #111;
        }

        .link-delete:hover {
          color: #b91c1c;
        }

        .btn-obs {
          background: #f5f7fa;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 7px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-obs:hover {
          background: #edf2f7;
        }

        .check-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .check-on {
          background: #16a34a;
          color: white;
        }

        .check-off {
          background: #ececec;
          color: #999;
        }

        .check-btn:hover {
          transform: scale(1.05);
        }

        .obs-box {
          width: 100%;
          min-height: 120px;
          margin-top: 10px;
          border-radius: 12px;
          border: 1px solid #ddd;
          padding: 12px;
          font-size: 14px;
          resize: vertical;
          box-sizing: border-box;
          font-family: Arial;
        }

      `}</style>

      <div className="container">

        <div className="header">

          <div className="title">
            📅 Cronograma Semanal
          </div>

          <div className="actions">

            <button
              className="btn btn-primary"
              onClick={() =>
                router.push(
                  "/cronograma/novo"
                )
              }
            >
              + Novo
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
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
              setFiltroMes(
                e.target.value
              )
            }
          />

          <select
            className="filtro"
            value={
              filtroProdutor
            }
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
                  value={
                    produtor
                  }
                >
                  {produtor}
                </option>

              )
            )}

          </select>

        </div>

        <div className="lista">

          {dadosFiltrados.length ===
            0 && (
            <div>
              Nenhuma atividade encontrada.
            </div>
          )}

          {dadosFiltrados.map(
            (item) => (

              <div
                key={item.id}
                className="item"
              >

                <div
                  className="linha"
                  onClick={() =>
                    setAberto(
                      aberto ===
                        item.id
                        ? null
                        : item.id
                    )
                  }
                >

                  <div className="titulo-area">

                    <div className="titulo-topo">

                      <strong>
                        {
                          item.titulo
                        }
                      </strong>

                      {item.realizado && (
                        <div className="realizado-tag">
                          realizado
                        </div>
                      )}

                    </div>

                    <div className="sub">

                      {(item.produtor ||
                        item.propriedade)}{" "}
                      • Início:{" "}
                      {formatarData(
                        item.data_inicio
                      )}{" "}
                      • Fim:{" "}
                      {formatarData(
                        item.data_fim
                      )}

                    </div>

                  </div>

                  <div className="acoes-item">

                    <div
                      className="link-action"
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        abrirEdicao(
                          item
                        );
                      }}
                    >
                      editar
                    </div>

                    <div
                      className="link-action link-delete"
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        excluir(
                          item.id
                        );
                      }}
                    >
                      excluir
                    </div>

                    <button
                      className="btn-obs"
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        setAberto(
                          aberto ===
                            item.id
                            ? null
                            : item.id
                        );
                      }}
                    >
                      Observações
                    </button>

                    <button
                      className={`check-btn ${
                        item.realizado
                          ? "check-on"
                          : "check-off"
                      }`}
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        toggleRealizado(
                          item.id,
                          item.realizado
                        );
                      }}
                    >
                      {item.realizado
                        ? "✓"
                        : "○"}
                    </button>

                  </div>

                </div>

                {aberto ===
                  item.id && (

                  <div className="detalhe">

                    {editando === item.id ? (

                      <>

                        <input
                          className="obs-box"
                          style={{
                            minHeight: 45,
                          }}
                          value={
                            formEdit.titulo
                          }
                          placeholder="Título"
                          onChange={(e) =>
                            setFormEdit({
                              ...formEdit,
                              titulo:
                                e.target
                                  .value,
                            })
                          }
                        />

                        <input
                          className="obs-box"
                          style={{
                            minHeight: 45,
                            marginTop: 10,
                          }}
                          value={
                            formEdit.motivo
                          }
                          placeholder="Motivo"
                          onChange={(e) =>
                            setFormEdit({
                              ...formEdit,
                              motivo:
                                e.target
                                  .value,
                            })
                          }
                        />

                        <textarea
                          className="obs-box"
                          value={
                            formEdit.descricao
                          }
                          placeholder="Descrição"
                          onChange={(e) =>
                            setFormEdit({
                              ...formEdit,
                              descricao:
                                e.target
                                  .value,
                            })
                          }
                        />

                        <div
                          style={{
                            display:
                              "flex",
                            gap: 10,
                            marginTop: 10,
                          }}
                        >

                          <input
                            type="date"
                            className="obs-box"
                            style={{
                              minHeight: 45,
                            }}
                            value={
                              formEdit.data_inicio
                            }
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                data_inicio:
                                  e.target
                                    .value,
                              })
                            }
                          />

                          <input
                            type="date"
                            className="obs-box"
                            style={{
                              minHeight: 45,
                            }}
                            value={
                              formEdit.data_fim
                            }
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                data_fim:
                                  e.target
                                    .value,
                              })
                            }
                          />

                        </div>

                        <textarea
                          className="obs-box"
                          value={
                            formEdit.observacoes
                          }
                          placeholder="Observações"
                          onChange={(e) =>
                            setFormEdit({
                              ...formEdit,
                              observacoes:
                                e.target
                                  .value,
                            })
                          }
                        />

                        <div
                          style={{
                            marginTop: 15,
                            display:
                              "flex",
                            gap: 10,
                          }}
                        >

                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              salvarEdicao(
                                item.id
                              )
                            }
                          >
                            Salvar
                          </button>

                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              setEditando(
                                null
                              )
                            }
                          >
                            Cancelar
                          </button>

                        </div>

                      </>

                    ) : (

                      <>

                        <p>
                          <strong>
                            Motivo:
                          </strong>{" "}
                          {item.motivo ||
                            "-"}
                        </p>

                        <p>
                          <strong>
                            Descrição:
                          </strong>{" "}
                          {item.descricao ||
                            "-"}
                        </p>

                        <p
                          className={
                            item.realizado
                              ? "status-ok"
                              : "status-pendente"
                          }
                        >
                          {item.realizado
                            ? "✓ Atividade realizada"
                            : "⏳ Atividade pendente"}
                        </p>

                        <div
                          style={{
                            marginTop: 20,
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              marginBottom: 10,
                            }}
                          >

                            <strong>
                              Observações
                            </strong>

                            <div
                              className="link-action"
                              onClick={() => {

                                setEditando(
                                  item.id
                                );

                                setFormEdit({
                                  titulo:
                                    item.titulo ||
                                    "",
                                  motivo:
                                    item.motivo ||
                                    "",
                                  descricao:
                                    item.descricao ||
                                    "",
                                  data_inicio:
                                    item.data_inicio ||
                                    "",
                                  data_fim:
                                    item.data_fim ||
                                    "",
                                  observacoes:
                                    item.observacoes ||
                                    "",
                                });
                              }}
                            >
                              editar observações
                            </div>

                          </div>

                          <textarea
                            className="obs-box"
                            value={
                              editando ===
                              item.id
                                ? formEdit.observacoes
                                : item.observacoes ||
                                  ""
                            }
                            placeholder="Adicionar observações..."
                            onChange={(e) => {

                              const novoTexto =
                                e.target
                                  .value;

                              setDados(
                                (
                                  prev
                                ) =>
                                  prev.map(
                                    (
                                      d
                                    ) =>
                                      d.id ===
                                      item.id
                                        ? {
                                            ...d,
                                            observacoes:
                                              novoTexto,
                                          }
                                        : d
                                  )
                              );

                              setFormEdit({
                                ...formEdit,
                                observacoes:
                                  novoTexto,
                              });
                            }}
                          />

                          <div
                            style={{
                              marginTop: 10,
                              display:
                                "flex",
                              gap: 10,
                            }}
                          >

                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                salvarEdicao(
                                  item.id
                                )
                              }
                            >
                              Salvar Observações
                            </button>

                          </div>

                        </div>

                      </>

                    )}

                  </div>

                )}

              </div>

            )
          )}

        </div>

      </div>
    </>
  );
}
