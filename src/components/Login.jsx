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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, ingresa tu correo y contraseña.',
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userFound = users.find(
      (u) =>
        u.email === form.email &&
        u.password === form.password
    );

    if (!userFound) {
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: 'El correo o la contraseña son incorrectos.',
      });
      return;
    }

    // 🔥 el rol ya viene del usuario guardado
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