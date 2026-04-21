import { useState } from "react";
import Swal from "sweetalert2";
import "../styles/auth.css";

export default function Register({ goToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rol: ""
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

    if (!form.name || !form.email || !form.password || !form.rol) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios para el registro.',
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existe = users.find((u) => u.email === form.email);

    if (existe) {
      Swal.fire({
        icon: 'error',
        title: 'Usuario existente',
        text: 'Este correo electrónico ya se encuentra registrado.',
      });
      return;
    }

    const nuevoUsuario = {
      nombre: form.name,
      email: form.email,
      password: form.password,
      role: form.rol === "admin" ? "admin" : "trabajador"
    };

    users.push(nuevoUsuario);
    localStorage.setItem("users", JSON.stringify(users));

    setRolStyle(nuevoUsuario.role === "admin" ? "admin" : "worker");

    Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada!',
      text: 'Ya puedes iniciar sesión con tus credenciales.',
      timer: 2000,
      showConfirmButton: false
    }).then(() => goToLogin());
  };

  return (
    <div className={`card ${rolStyle}`}>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          onChange={handleChange}
        />

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

        <select name="rol" onChange={handleChange}>
          <option value="">Selecciona tu rol</option>
          <option value="admin">Administrador</option>
          <option value="worker">Trabajador</option>
        </select>

        <button type="submit">Crear cuenta</button>
      </form>

      <p className="switch">
        ¿Ya tienes cuenta?{" "}
        <span onClick={goToLogin}>Inicia sesión</span>
      </p>
    </div>
  );
}