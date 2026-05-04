import { useState } from "react";
import Swal from "sweetalert2";
import "../styles/auth.css";

export default function Login({ goToRegister, setUser }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [rolStyle, setRolStyle] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, ingresa tu correo y contraseña.',
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (response.ok) {
        const userFound = await response.json(); // Ahora incluirá la cédula
        setRolStyle(userFound.role === "admin" ? "admin" : "worker");

        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${userFound.nombre}!`,
          text: 'Iniciando sesión...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          setUser(userFound);
        });
      } else {
        const errorData = await response.json();
        Swal.fire('Error', errorData.message || 'Credenciales incorrectas', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  return (
    <div className={`card ${rolStyle}`}>
      <h2>Iniciar Sesión</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />

        <button type="submit">Entrar</button>
      </form>

      <p className="switch">
        ¿No tienes cuenta?{" "}
        <span onClick={goToRegister}>Regístrate</span>
      </p>
    </div>
  );
}