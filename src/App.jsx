import { useState } from "react";
import Swal from "sweetalert2";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);

  const logout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Tendrás que volver a ingresar tus credenciales.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setUser(null);
        setView("login");
      }
    });
  };

  return (
    <div className="app-wrapper">
      <div className="main-content">
        {!user ? (
          view === "login" ? (
            <Login
              setUser={setUser}
              goToRegister={() => setView("register")}
            />
          ) : (
            <Register goToLogin={() => setView("login")} />
          )
        ) : (
          <Dashboard user={user} logout={logout} />
        )}
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} <strong>Nómina Pro</strong> - Gestión Empresarial Integrada</p>
        <p>Sistema optimizado para la legislación laboral de <strong>Colombia (COP)</strong></p>
      </footer>
    </div>
  );
}

export default App;