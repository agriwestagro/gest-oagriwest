"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function NovaVisitaPage() {

  const router = useRouter()

  const [form, setForm] = useState({
    propriedade: "",
    data_visita: "",
    motivo: "",
    mensagem_produtor: "",
    observacao: "",
    midia_link: ""
  })

  const [propriedades, setPropriedades] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarPropriedades()
  }, [])

  async function carregarPropriedades() {
    const { data, error } = await supabase
      .from("propriedades")
      .select("nome")

    if (error) {
      console.error("Erro ao carregar propriedades:", error)
      return
    }

    const lista = data?.map((p) => p.nome) || []
    setPropriedades(lista)
  }

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function salvar(e: any) {
    e.preventDefault()

    // DEBUG
    console.log("FORM:", form)

    if (!form.propriedade || !form.data_visita) {
      alert("Preencha Propriedade e Data da visita")
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from("visitas")
      .insert([
        {
          propriedade: form.propriedade,
          data_visita: form.data_visita,
          motivo: form.motivo,
          mensagem_produtor: form.mensagem_produtor,
          observacao: form.observacao,
          midia_link: form.midia_link
        }
      ])
      .select()

    console.log("RESULT:", { data, error })

    setLoading(false)

    if (error) {
      alert("Erro ao salvar: " + error.message)
      console.error(error)
      return
    }

    alert("Visita salva com sucesso")

    router.push("/visitas")
    router.refresh()
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          🌾 Nova Visita de Campo
        </h1>

        <form
          onSubmit={salvar}
          className="bg-white p-6 rounded-2xl shadow space-y-4"
        >

          {/* PROPRIEDADE */}
          <div>
            <label className="text-sm text-gray-600">Propriedade *</label>
            <select
              name="propriedade"
              value={form.propriedade}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Selecione</option>
              {propriedades.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* DATA */}
          <div>
            <label className="text-sm text-gray-600">Data da visita *</label>
            <input
              type="date"
              name="data_visita"
              value={form.data_visita}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* MOTIVO */}
          <div>
            <label className="text-sm text-gray-600">Motivo</label>
            <input
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="Ex: Acompanhamento, Problema, Rotina"
            />
          </div>

          {/* MENSAGEM */}
          <div>
            <label className="text-sm text-gray-600">
              Mensagem ao produtor
            </label>
            <textarea
              name="mensagem_produtor"
              value={form.mensagem_produtor}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              rows={3}
            />
          </div>

          {/* OBSERVAÇÃO */}
          <div>
            <label className="text-sm text-gray-600">Observações</label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              rows={3}
            />
          </div>

          {/* MIDIA */}
          <div>
            <label className="text-sm text-gray-600">Link de mídia</label>
            <input
              name="midia_link"
              value={form.midia_link}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="https://..."
            />
          </div>

          {/* BOTÕES */}
          <div className="flex justify-between pt-4">

            <button
              type="button"
              onClick={() => router.push("/visitas")}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              {loading ? "Salvando..." : "Salvar Visita"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}