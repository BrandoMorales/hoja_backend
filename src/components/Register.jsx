import { useState } from "react";
import Swal from "sweetalert2";
import "../styles/auth.css";

export default function Register({ goToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cedula: "", // Nuevo campo
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.cedula || !form.password || !form.rol) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios para el registro.',
      });
      return;
    }

    const nuevoUsuario = {
      nombre: form.name,
      email: form.email,
      cedula: form.cedula, // Incluir cédula
      password: form.password,
      role: form.rol === "admin" ? "admin" : "trabajador"
    };

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        setRolStyle(nuevoUsuario.role === "admin" ? "admin" : "worker");
        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada!',
          text: 'Ya puedes iniciar sesión con tus credenciales.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => goToLogin());
      } else {
        const errorData = await response.json();
        Swal.fire('Error', errorData.message || 'Error al registrar', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
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
          type="text"
          name="cedula"
          placeholder="Número de Identificación (Cédula)"
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