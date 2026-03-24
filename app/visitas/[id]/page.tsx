import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function DetalheVisita({ params }: any) {

  const { data: visita } = await supabase
    .from("visitas")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!visita) {
    return <div className="p-8">Visita não encontrada</div>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="mb-6 flex justify-between">
        <Link href="/visitas">
          <button className="text-sm text-gray-600">← Voltar</button>
        </Link>

        <Link href={`/visitas/${visita.id}/editar`}>
          <button className="text-sm text-blue-600">Editar</button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow border">

        <h1 className="text-xl font-bold mb-2">
          {visita.propriedade}
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          {new Date(visita.data_visita).toLocaleDateString("pt-BR")}
        </p>

        {visita.motivo && (
          <div className="mb-4">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
              {visita.motivo}
            </span>
          </div>
        )}

        {visita.mensagem_produtor && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Mensagem ao produtor</p>
            <p>{visita.mensagem_produtor}</p>
          </div>
        )}

        {visita.observacao && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Observações</p>
            <p>{visita.observacao}</p>
          </div>
        )}

        {visita.midia_link && (
          <a
            href={visita.midia_link}
            target="_blank"
            className="text-green-600"
          >
            📎 Ver mídia
          </a>
        )}

      </div>

    </div>
  )
}