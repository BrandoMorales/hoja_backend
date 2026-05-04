const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas para async/await

const app = express();
app.use(cors());
app.use(express.json()); // Express ya incluye body-parser para JSON

// Configuración de la conexión a MySQL
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'nomina_app',
  port: 3306,
  timezone: 'Z', // Ayuda a manejar fechas de forma consistente
  dateStrings: true // 👈 ESTO EVITA EL FORMATO 00.000Z Y LO DEJA COMO TEXTO
};

// Pool de conexiones para MySQL
let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    // Probar la conexión inmediatamente
    await pool.query('SELECT 1');
    console.log('✅ Conexión exitosa a MySQL (Base de datos: nomina_app)');
  } catch (error) {
    console.error('❌ ERROR: No se pudo conectar a MySQL. Asegúrate de que el servidor esté corriendo y la base de datos "nomina_app" exista.');
    console.error(error.message);
    process.exit(1); // Salir de la aplicación si no se puede conectar a la DB
  }
}

// Inicializar la base de datos al iniciar el servidor
initializeDatabase();

// --- Rutas de Autenticación ---
app.post('/api/register', async (req, res) => {
  const { nombre, email, password, role, cedula } = req.body; // Añadir cedula
  try {
    const [rows] = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }
    await pool.execute('INSERT INTO users (nombre, email, password, role, cedula) VALUES (?, ?, ?, ?, ?)', [nombre, email, password, role, cedula]); // Insertar cedula
    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try { 
    const [rows] = await pool.execute('SELECT nombre, email, role, cedula FROM users WHERE email = ? AND password = ?', [email, password]); // Seleccionar cedula
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- Ruta para obtener todos los usuarios (Solo para el Admin) ---
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT nombre, email, role, cedula FROM users WHERE role != "admin"'); // Seleccionar cedula
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener la lista de usuarios.' });
  }
});

// --- Rutas de Registros de Nómina ---
app.get('/api/records', async (req, res) => {
  const { email, role } = req.query;
  try { 
    let query = "SELECT id, user_email AS user, nombre, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, horas, pago, tipo, proyecto, projectNumber, client, coordinator FROM records"; // Añadir nuevos campos
    let params = [];
    if (role !== 'admin') {
      query += " WHERE user_email = ?";
      params.push(email);
    }
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/api/records', async (req, res) => {
  const { user, nombre, fecha, horas, pago, tipo, proyecto, projectNumber, client, coordinator } = req.body; // Añadir nuevos campos
  try {
    const [result] = await pool.execute(
      'INSERT INTO records (user_email, nombre, fecha, horas, pago, tipo, proyecto, projectNumber, client, coordinator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', // Insertar nuevos campos
      [user, nombre, fecha, horas, pago, tipo, proyecto, projectNumber, client, coordinator]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.delete('/api/records/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM records WHERE id = ?', [id]);
    res.json({ message: 'Registro eliminado.' });
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- Rutas de Configuración ---
app.get('/api/config/salaries', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT user_email, salary FROM user_salaries');
    const salariesMap = rows.reduce((acc, row) => ({ ...acc, [row.user_email]: row.salary }), {});
    res.json(salariesMap);
  } catch (error) {
    console.error('Error al obtener salarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/api/config/salaries', async (req, res) => {
  let { email, salary } = req.body;

  // 🛡️ Validación de seguridad: Si no hay email o salario, no intentamos guardar
  if (!email || salary === undefined || salary === null || isNaN(salary)) {
    return res.status(400).json({ message: 'Email y un salario válido son obligatorios' });
  }

  try {
    await pool.execute('INSERT INTO user_salaries (user_email, salary) VALUES (?, ?) ON DUPLICATE KEY UPDATE salary = ?', [email, salary, salary]);
    const [rows] = await pool.execute('SELECT user_email, salary FROM user_salaries');
    const salariesMap = rows.reduce((acc, row) => ({ ...acc, [row.user_email]: row.salary }), {});
    res.json(salariesMap);
  } catch (error) {
    console.error('Error al actualizar salario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.get('/api/config/approvals', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT user_email, approved FROM user_approvals');
    const approvalsMap = rows.reduce((acc, row) => ({ ...acc, [row.user_email]: row.approved }), {});
    res.json(approvalsMap);
  } catch (error) {
    console.error('Error al obtener aprobaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/api/config/approvals', async (req, res) => {
  const { email, approved } = req.body;
  try {
    await pool.execute('INSERT INTO user_approvals (user_email, approved) VALUES (?, ?) ON DUPLICATE KEY UPDATE approved = ?', [email, approved, approved]);
    const [rows] = await pool.execute('SELECT user_email, approved FROM user_approvals');
    const approvalsMap = rows.reduce((acc, row) => ({ ...acc, [row.user_email]: row.approved }), {});
    res.json(approvalsMap);
  } catch (error) {
    console.error('Error al actualizar aprobación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Vaciar historial (Admin)
app.delete('/api/records-all', async (req, res) => {
  try {
    // TRUNCATE elimina los datos y reinicia el contador AUTO_INCREMENT a 1
    await pool.execute('TRUNCATE TABLE records');
    res.json({ message: 'Historial vaciado.' });
  } catch (error) {
    console.error('Error al vaciar historial:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});