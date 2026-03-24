"use client";

import Link from "next/link";

export default function Dashboard() {

  const cardStyle = {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    textAlign: "center" as const,
    cursor: "pointer",
    fontSize: "18px",
    width: "260px",
    transition: "0.2s"
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8"
      }}
    >

      <div style={{textAlign:"center"}}>

        <h1 style={{
          fontSize:"32px",
          fontWeight:"bold",
          marginBottom:"10px",
          whiteSpace:"nowrap"
        }}>
          Sistema Agriwest de Gestão Agroempresarial
        </h1>

        <p style={{
          marginBottom:"40px",
          color:"#666"
        }}>
          Gestão de propriedades, visitas técnicas e resultados de safra
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            flexWrap: "wrap",
            maxWidth: "850px",
            margin: "0 auto"
          }}
        >

          <Link href="/propriedades">
            <div style={cardStyle}>
              🏡
              <h3>Propriedades</h3>
            </div>
          </Link>

          <Link href="/visitas">
            <div style={cardStyle}>
              🌱
              <h3>Visitas de Campo</h3>
            </div>
          </Link>

          <Link href="/nova-safra">
            <div style={cardStyle}>
              🌾
              <h3>Registrar Safra</h3>
            </div>
          </Link>

          <Link href="/safras">
            <div style={cardStyle}>
              📊
              <h3>Histórico de Safras</h3>
            </div>
          </Link>

          <Link href="/ranking">
            <div style={cardStyle}>
              🏆
              <h3>Ranking</h3>
            </div>
          </Link>

          {/* NOVO BLOCO */}
          <Link href="/analises">
            <div style={cardStyle}>
              🛰️
              <h3>Análises Agronômicas</h3>
            </div>
          </Link>

        </div>

      </div>

    </div>

  );
}