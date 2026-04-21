import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import "react-calendar/dist/Calendar.css";
import "../styles/dashboard.css";

export default function Dashboard({ user, logout }) {
  const [registros, setRegistros] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [busqueda, setBusqueda] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");

  const [aprobados, setAprobados] = useState(() => {
    return JSON.parse(localStorage.getItem("aprobaciones")) || {};
  });

  const [salarios, setSalarios] = useState(() => {
    return JSON.parse(localStorage.getItem("config_salarios")) || {};
  });

  // 💰 HELPER: Formatear moneda a Pesos Colombianos
  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor || 0);
  };

  const [form, setForm] = useState({
    fecha: "",
    horas: "",
    tipo: "normal",
    proyecto: "",
  });

  const META = 220;

  // 🔥 FUNCIÓN PARA CARGAR REGISTROS SEGÚN EL ROL
  const loadRegistros = () => {
    if (!user) return;

    if (user.role === "admin") {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("registros_")
      );
      let todos = [];
      keys.forEach((k) => {
        const data = JSON.parse(localStorage.getItem(k)) || [];
        todos = [...todos, ...data];
      });
      setRegistros(todos);
    } else {
      const data = JSON.parse(localStorage.getItem(`registros_${user.email}`)) || [];
      setRegistros(data);
    }
  };

  // 🔥 CARGAR DATOS AL INICIO O CAMBIO DE USUARIO
  useEffect(() => {
    loadRegistros();
  }, [user]); // Dependencia: se ejecuta cuando el usuario cambia

  // 🔹 CÁLCULO PROFESIONAL DE NÓMINA
  const calcular = () => {
    if (!form.fecha) return { horas: 0, pago: 0 };

    const salarioBase = salarios[user.email] || 0;
    const VALOR_HORA_BASE = salarioBase / 220; 

    let horas = parseFloat(form.horas || 0);
    let factorRecargo = 1.0; // Valor por defecto (100%)

    // Convertimos la fecha para obtener el día de la semana (0: Domingo, 6: Sábado)
    const [year, month, day] = form.fecha.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);
    const diaSemana = fechaObj.getDay(); 
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

    if (form.tipo === "vacaciones") {
      // Las vacaciones cuentan 8 horas pero solo en días hábiles
      horas = esFinDeSemana ? 0 : 8;
      factorRecargo = 1.0;
    } else if (form.tipo === "domingo" || form.tipo === "festivo") {
      // Recargo dominical/festivo legal (75% adicional)
      factorRecargo = 1.75;
    }

    return {
      horas,
      pago: horas * VALOR_HORA_BASE * factorRecargo
    };
  };

  // 🔹 AGREGAR
  const agregar = () => {
    // Permitimos agregar sin horas si es vacaciones (porque se calculan solas)
    if (!form.fecha || (form.tipo !== "vacaciones" && !form.horas)) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos obligatorios.',
      });
      return;
    }

    const calc = calcular();

    if (form.tipo === "vacaciones" && calc.horas === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Día no laboral',
        text: 'No se pueden asignar horas de vacaciones en fin de semana.',
      });
      return;
    }

    const nuevo = {
      id: Date.now(),
      user: user.email,
      nombre: user.nombre,
      fecha: form.fecha,
      horas: calc.horas,
      pago: calc.pago, // Guardamos el valor calculado
      tipo: form.tipo,
      proyecto: form.proyecto,
    };

    // Guardar en el storage específico del usuario
    const userKey = `registros_${user.email}`;
    const actualData = JSON.parse(localStorage.getItem(userKey)) || [];
    const updatedData = [...actualData, nuevo];
    localStorage.setItem(userKey, JSON.stringify(updatedData));

    // Actualizar estado local para la vista
    loadRegistros(); // Recargar todos los registros para asegurar consistencia

    setForm({
      fecha: "",
      horas: "",
      tipo: "normal",
      proyecto: "",
    });
  };

  // 🔥 TOGGLE APROBACION (EL CHULEO)
  const toggleAprobacion = (email) => {
    const nuevosAprobados = { ...aprobados, [email]: !aprobados[email] };
    setAprobados(nuevosAprobados);
    localStorage.setItem("aprobaciones", JSON.stringify(nuevosAprobados));
  };

  // 🔥 ELIMINAR
  const eliminar = async (id, ownerEmail) => {
    if (user.role !== "admin") return;

    const result = await Swal.fire({
      title: '¿Eliminar este registro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const data = JSON.parse(localStorage.getItem(`registros_${ownerEmail}`)) || [];
      const nuevos = data.filter((r) => r.id !== id);
      localStorage.setItem(`registros_${ownerEmail}`, JSON.stringify(nuevos));
      loadRegistros(); // Recargar todos los registros para asegurar consistencia
      
      Swal.fire({
        title: '¡Eliminado!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // 🔥 ACTUALIZAR SALARIO (Solo Admin)
  const updateSalario = (email, valor) => {
    const nuevos = { ...salarios, [email]: parseFloat(valor) || 0 };
    setSalarios(nuevos);
    localStorage.setItem("config_salarios", JSON.stringify(nuevos));
  };

  // 🔥 ELIMINAR TODO EL HISTORIAL (Solo Admin)
  const eliminarTodo = async () => {
    const result = await Swal.fire({
      title: '¿Vaciar TODO el historial?',
      text: "Se borrarán los registros de TODOS los usuarios. Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith("registros_"));
      keys.forEach(k => localStorage.removeItem(k));
      loadRegistros();
      Swal.fire('¡Vaciado!', 'Se han eliminado todos los registros.', 'success');
    }
  };

  // 📅 HELPER: Convierte objeto Date a string YYYY-MM-DD local
  const dateToLocalStr = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 📅 FILTROS MENSUALES
  const mesFiltro = dateToLocalStr(fechaSeleccionada).substring(0, 7); // "YYYY-MM"

  const registrosDelMes = registros.filter((r) => r.fecha.startsWith(mesFiltro));

  const registrosParaMostrar = filtroEmail
    ? registrosDelMes.filter((r) => r.user === filtroEmail)
    : registrosDelMes;

  const registrosDelDia = registrosParaMostrar.filter((r) => {
    // Comparamos el string YYYY-MM-DD directamente
    return r.fecha === dateToLocalStr(fechaSeleccionada);
  });

  const registrosFiltrados = registrosParaMostrar.filter((r) => {
    const texto = busqueda.toLowerCase();

    return (
      r.nombre.toLowerCase().includes(texto) ||
      r.user.toLowerCase().includes(texto) ||
      (r.proyecto || "").toLowerCase().includes(texto)
    );
  });

  // 📅 CÁLCULO DE COSTOS REALES SEGÚN SALARIO CONFIGURADO
  const getCostoRegistro = (reg) => {
    const salary = salarios[reg.user] || 0;
    const hourlyRate = salary / 220;
    let factor = 1.0;
    if (reg.tipo === "domingo" || reg.tipo === "festivo") factor = 1.75;
    return reg.horas * hourlyRate * factor;
  };

  const totalHoras = registrosParaMostrar.reduce((acc, r) => acc + r.horas, 0);
  const liquidacionProyectada = registrosParaMostrar.reduce((acc, r) => acc + getCostoRegistro(r), 0);
  
  const porcentajeCumplimiento = Math.min((totalHoras / META) * 100, 100).toFixed(1);
  const esMetaCumplida = totalHoras >= META || (filtroEmail ? aprobados[filtroEmail] : aprobados[user.email]);

  // 📊 AGRUPAR POR USUARIO PARA ADMIN
  const usuariosUnicos = [...new Set(registrosDelMes.map((r) => r.user))];
  const resumenUsuarios = usuariosUnicos.map((email) => {
    const registrosUser = registrosDelMes.filter((r) => r.user === email);
    const total = registrosUser.reduce((acc, r) => acc + r.horas, 0);
    const pagoTotal = registrosUser.reduce((acc, r) => acc + getCostoRegistro(r), 0);
    const nombre = registrosUser[0]?.nombre || email;
    const rendimiento = ((total / META) * 100).toFixed(1);
    return { email, nombre, total, honorarios: pagoTotal, rendimiento };
  });

  // 📊 AGRUPAR POR PROYECTO PARA ADMIN
  const proyectosUnicos = [...new Set(registrosDelMes.map((r) => r.proyecto || "General/Sin Proyecto"))];
  const resumenProyectos = proyectosUnicos.map((nombreProyecto) => {
    const registrosProyecto = registrosDelMes.filter((r) => (r.proyecto || "General/Sin Proyecto") === nombreProyecto);
    const horasProyecto = registrosProyecto.reduce((acc, r) => acc + r.horas, 0);
    const inversionProyecto = registrosProyecto.reduce((acc, r) => acc + getCostoRegistro(r), 0);
    return { nombre: nombreProyecto, horas: horasProyecto, costo: inversionProyecto };
  });

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <h2>
          Bienvenido {user.nombre}
          <span className="badge">{user.role}</span>
        </h2>
        <button onClick={logout}>Cerrar sesión</button>
      </div>

      {/* 🧾 FORMULARIO (PARA TODOS) */}
      <div className="form">
          <input
            type="date"
            value={form.fecha}
            onChange={(e) =>
              setForm({ ...form, fecha: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Horas"
            value={form.horas}
            onChange={(e) =>
              setForm({ ...form, horas: e.target.value })
            }
          />

          <select
            value={form.tipo}
            onChange={(e) =>
              setForm({ ...form, tipo: e.target.value })
            }
          >
            <option value="normal">Normal</option>
            <option value="festivo">Festivo</option>
            <option value="sabado">Sábado</option>
            <option value="domingo">Domingo</option>
            <option value="vacaciones">Vacaciones</option>
          </select>

          <input
            placeholder="Proyecto"
            value={form.proyecto}
            onChange={(e) =>
              setForm({ ...form, proyecto: e.target.value })
            }
          />

          <button onClick={agregar}>Agregar</button>
      </div>

      {/* 📅 SELECTOR DE PERIODO */}
      <div className="period-selector">
        <label>Periodo de Nómina:</label>
        <input 
          type="month" 
          value={mesFiltro} 
          onChange={(e) => {
            const [y, m] = e.target.value.split("-");
            setFechaSeleccionada(new Date(parseInt(y), parseInt(m) - 1, 1));
          }}
        />
      </div>

      {/* 📈 DASHBOARD DE MÉTRICAS (KPIs) */}
      <div className="metrics-container">
        <div className="metric-card">
          <span className="metric-label">Horas Totales</span>
          <span className="metric-value">{totalHoras}h</span>
          <div className="metric-sub">Meta: {META}h</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Liquidación Proyectada</span>
          <span className="metric-value">{formatCOP(liquidacionProyectada)}</span>
          <div className="metric-sub">Incluye recargos dom/fest</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Cumplimiento</span>
          <span className={`metric-value ${esMetaCumplida ? 'ok' : 'bad'}`}>
            {porcentajeCumplimiento}%
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${porcentajeCumplimiento}%`, backgroundColor: esMetaCumplida ? '#10b981' : '#6366f1' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 🧑‍💼 ADMIN */}
      {user.role === "admin" && (
        <>
          {/*  CALENDARIO */}
          <div className="calendar-section">
            <Calendar
              onChange={setFechaSeleccionada}
              value={fechaSeleccionada}
              tileClassName={({ date }) => {
                const dateStr = dateToLocalStr(date);
                const existe = registros.some((r) => r.fecha === dateStr);
                return existe ? "highlight" : null;
              }}
            />
          </div>

          {/* 🔍 SELECTOR Y BUSCADOR (Solo Admin) */}
          <div className="section-title">Panel de Control de Personal</div>
          <div className="form" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select 
              value={filtroEmail} 
              onChange={(e) => setFiltroEmail(e.target.value)}
              style={{ flex: 1, minWidth: '200px' }}
            >
              <option value="">Ver Todos los Trabajadores</option>
              {resumenUsuarios.map(u => (
                <option key={u.email} value={u.email}>
                  👤 {u.nombre} ({u.email})
                </option>
              ))}
            </select>

            <input
              className="search"
              style={{ flex: 2, margin: 0 }}
              placeholder="Buscar registros específicos (nombre, email o proyecto)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* 📋 RESUMEN POR PERSONA */}
          <div className="section-title">Estado de Usuarios</div>
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Salario Base</th>
                <th>Total Horas</th>
                <th>Liquidación</th>
                <th>Rendimiento</th>
                <th>Meta ({META})</th>
                <th>¿Cumplió?</th>
                <th>Chulear (Manual)</th>
              </tr>
            </thead>
            <tbody>
              {resumenUsuarios.map((u) => (
                <tr key={u.email}>
                  <td>{u.nombre}</td>
                  <td>
                    <input 
                      type="number" 
                      className="search" 
                      style={{ width: '100px', margin: 0 }}
                      value={salarios[u.email] || ""} 
                      onChange={(e) => updateSalario(u.email, e.target.value)}
                    />
                  </td>
                  <td>{u.total}</td>
                  <td>{formatCOP(u.honorarios)}</td>
                  <td>{u.rendimiento}%</td>
                  <td className={u.total >= META ? "ok" : "bad"}>
                    {u.total >= META ? "Superada" : "Pendiente"}
                  </td>
                  <td>{aprobados[u.email] || u.total >= META ? "✅ SI" : "❌ NO"}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!aprobados[u.email]}
                      onChange={() => toggleAprobacion(u.email)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📁 INVERSIÓN POR PROYECTO */}
          <div className="section-title">Análisis de Inversión por Proyecto</div>
          <table>
            <thead>
              <tr>
                <th>Nombre del Proyecto</th>
                <th>Horas Invertidas</th>
                <th>Costo de Inversión</th>
                <th>% Participación</th>
              </tr>
            </thead>
            <tbody>
              {resumenProyectos.length > 0 ? (
                resumenProyectos.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nombre}</td>
                    <td>{p.horas}h</td>
                    <td>{formatCOP(p.costo)}</td>
                    <td>{p.participacion}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay datos de proyectos este mes</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button className="danger" onClick={eliminarTodo}>
              ⚠️ Vaciar Todo el Historial
            </button>
          </div>
        </>
      )}

      {/* 📊 REGISTROS DEL DÍA (Visible para todos) */}
      <div className="section-title">
        Registros del día: {fechaSeleccionada.toLocaleDateString()}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Horas</th>
            <th>Tipo</th>
            <th>Proyecto</th>
            {user.role === "admin" && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {registrosDelDia.length > 0 ? (
            registrosDelDia.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{r.user}</td>
                <td>{r.fecha.split("-").reverse().join("/")}</td>
                <td>{r.horas}</td>
                <td>{r.tipo}</td>
                <td>{r.proyecto || "-"}</td>
                {user.role === "admin" && (
                  <td>
                    <button className="danger" onClick={() => eliminar(r.id, r.user)}>❌</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr><td colSpan={user.role === "admin" ? 7 : 6}>No hay registros para este día</td></tr>
          )}
        </tbody>
      </table>

      {/* 📊 HISTORIAL (Visible para todos) */}
      <div className="section-title">Historial completo</div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Horas</th>
            <th>Tipo</th>
            <th>Proyecto</th>
            {user.role === "admin" && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((r) => (
            <tr key={r.id}>
              <td>{r.nombre}</td>
              <td>{r.user}</td>
              <td>{r.fecha.split("-").reverse().join("/")}</td>
              <td>{r.horas}</td>
              <td>{r.tipo}</td>
              <td>{r.proyecto || "-"}</td>
              {user.role === "admin" && (
                <td>
                  <button className="danger" onClick={() => eliminar(r.id, r.user)}>❌</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}