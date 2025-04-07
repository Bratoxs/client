import { useState } from "react";
import styles from "./Consulta.module.css";

export default function App() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleConsultarYDescargar = async () => {
    if (text.trim() === "") {
      setError("Por favor, ingrese la clave de acceso.");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/consultar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claveAcceso: text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error en la consulta");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${text}.xml`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.texto}>Ingrese la clave de acceso</h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
          placeholder="Clave de Acceso..."
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.accept}`}
            onClick={handleConsultarYDescargar}
          >
            Consultar y Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
