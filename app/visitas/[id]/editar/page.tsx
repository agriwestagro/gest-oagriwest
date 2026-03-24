"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function EditarVisita({ params }: any) {

  const router = useRouter()
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    const { data } = await supabase
      .from("visitas")
      .select("*")
      .eq("id", params.id)
      .single()

    setForm(data)
  }

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function salvar(e: any) {
    e.preventDefault()

    await supabase
      .from("visitas")
      .update(form)
      .eq("id", params.id)

    router.push("/visitas")
  }

  if (!form) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-xl font-bold mb-6">Editar Visita</h1>

      <form onSubmit={salvar} className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          name="propriedade"
          value={form.propriedade}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="motivo"
          value={form.motivo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="mensagem_produtor"
          value={form.mensagem_produtor || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Mensagem ao produtor"
        />

        <textarea
          name="observacao"
          value={form.observacao || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Observações"
        />

        <input
          name="midia_link"
          value={form.midia_link || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Link da mídia"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Salvar
        </button>

      </form>

    </div>
  )
}