import { useState } from "react";
import "./estetica.css"; // ✅ corregido

interface Persona {
  id: string;
  nombre: string;
}

interface Props {
  onSeleccionarPersona: (persona: Persona) => void;
}

const Personas: React.FC<Props> = ({ onSeleccionarPersona }) => {
  const [nombre, setNombre] = useState<string>("");

  const personas: Persona[] = [
    { id: "1", nombre: "Alice" },
    { id: "2", nombre: "Bob" },
    { id: "3", nombre: "Charlie" },
  ];

  return (
    <div className="personas-container">
      <h2 className="personas-title">Selecciona tu persona</h2>

      <div className="chat-input">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Escribe tu nombre..."
        />
        <button onClick={() => onSeleccionarPersona({ id: Date.now().toString(), nombre })}>
          Seleccionar
        </button>
      </div>

      <h3 className="personas-subtitle">Personas disponibles:</h3>
      <ul className="personas-list">
        {personas.map((persona) => (
          <li key={persona.id} className="persona-item"
            onClick={() => onSeleccionarPersona(persona)}>
            {persona.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Personas;