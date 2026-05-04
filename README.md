# 💰 Nómina Pro - Gestión Empresarial Integrada

Sistema integral para la gestión de horas laboradas, cálculo de nómina y análisis de proyectos, optimizado específicamente para la legislación laboral de **Colombia (COP)**. 

Este proyecto utiliza un stack moderno con **React** en el frontend, **Node.js/Express** en el backend y **MySQL** como base de datos persistente.

## 🚀 Características Principales

- **Autenticación Segura:** Registro e inicio de sesión con roles diferenciados (Administrador y Trabajador).
- **Gestión de Horas:** Registro detallado de jornadas (Normal, Festivo, Sábado, Domingo, Vacaciones).
- **Lógica de Nómina Colombiana:** 
    - Cálculo basado en el divisor de **220 horas mensuales**.
    - Recargos automáticos del **75% (factor 1.75)** para domingos y festivos.
    - Cálculo automático de horas de vacaciones (8h en días hábiles).
- **Panel de Administrador:** 
    - Visualización de métricas en tiempo real (KPIs).
    - Asignación dinámica de salarios base por trabajador.
    - Sistema de aprobación manual ("chuleo").
    - Análisis de inversión por proyecto.
- **Persistencia Total:** Migración completa de `localStorage` a **MySQL** para seguridad y multiusuario.

## 🛠️ Requisitos Técnicos

- **Node.js:** Versión 18 o superior.
- **Base de Datos:** MySQL (XAMPP, HeidiSQL o similar).
- **Navegador:** Chrome, Edge o Firefox.

## 📦 Instalación

1. **Clonar o descargar** el repositorio en tu carpeta local.
2. Abrir una terminal en la carpeta raíz del proyecto y ejecutar:
   ```bash
   npm install
   ```

## 🗄️ Configuración de la Base de Datos

1. Abre tu gestor de base de datos (ej. HeidiSQL).
2. Crea una base de datos llamada `nomina_app`.
3. Ejecuta el siguiente script para crear las tablas necesarias:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cedula VARCHAR(20) UNIQUE, -- Nuevo campo
    password VARCHAR(255) NOT NULL, 
    role ENUM('admin', 'trabajador') NOT NULL
);

CREATE TABLE records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    horas DECIMAL(10, 2) NOT NULL,
    pago DECIMAL(15, 2) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    projectNumber VARCHAR(50), -- Nuevo campo
    client VARCHAR(255),        -- Nuevo campo
    coordinator VARCHAR(255),   -- Nuevo campo
    proyecto VARCHAR(255),
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE user_salaries (
    user_email VARCHAR(255) PRIMARY KEY,
    salary DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);
```

## 🚦 Ejecución del Proyecto

Para levantar tanto el servidor (Backend) como la aplicación (Frontend) simultáneamente, ejecuta:

```bash
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:5000`

## ⚙️ Lógica de Cálculo

El sistema calcula el costo de cada registro mediante la fórmula:
`Costo = (Salario Base / 220) * Horas * FactorRecargo`