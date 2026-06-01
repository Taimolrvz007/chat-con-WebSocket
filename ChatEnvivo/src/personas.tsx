// haremos que la persona que envie mensajes tenga un nombre, para eso crearemos un nuevo componente llamado Personas.tsx

import { useState } from "react";

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

  const seleccionarPersona = (persona: Persona) => {
    onSeleccionarPersona(persona);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Selecciona tu persona</h2>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Escribe tu nombre..."
      />
      <button onClick={() => seleccionarPersona({ id: Date.now().toString(), nombre })}>
        Seleccionar
      </button>

      <h3>Personas disponibles:</h3>
      <ul>
        {personas.map((persona) => (
          <li key={persona.id} onClick={() => seleccionarPersona(persona)}>
            {persona.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Personas;