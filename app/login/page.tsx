"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("Email ou senha inválidos");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .login-bg {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        }

        .login-card {
          background: white;
          padding: 45px 35px;
          border-radius: 18px;
          width: 380px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
          animation: fadeIn 0.6s ease;
        }

        .login-card h1 {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .subtitle {
          margin-bottom: 25px;
          color: #666;
          font-size: 14px;
        }

        .login-form input {
          width: 100%;
          padding: 13px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid #ddd;
          outline: none;
          transition: 0.2s;
        }

        .login-form input:focus {
          border-color: #2c5364;
          box-shadow: 0 0 0 2px rgba(44, 83, 100, 0.1);
        }

        .login-form button {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: #2c5364;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
        }

        .login-form button:hover {
          background: #203a43;
        }

        .login-form button:disabled {
          opacity: 0.7;
        }

        .erro {
          display: block;
          margin-bottom: 10px;
          color: red;
          font-size: 13px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="login-bg">
        <div className="login-card">

          <h1><strong>Sistema Agriwest - Gestão Agroempresarial</strong></h1>
          <p className="subtitle">Acesse sua conta</p>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {erro && <span className="erro">{erro}</span>}

            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

        </div>
      </div>
    </>
  );
}