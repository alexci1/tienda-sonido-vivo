# 🎸 Tienda Sonido Vivo — Proyecto Semestral Full Stack (DSY1104)

Proyecto semestral para la asignatura **Desarrollo Full Stack II (DSY1104)** - Versión Oficial Parcial 3 y EFT.

---

## 📁 Estructura del Repositorio

Siguiendo la pauta oficial del proyecto semestral:

```text
tienda-sonido-vivo/
├── frontend/           # Aplicación Front-End React (Vite, Bootstrap, Tests)
├── backend/            # Aplicación Back-End Spring Boot (REST API, JWT, Swagger)
├── database/           # Scripts SQL y esquemas de base de datos MySQL
└── documentacion/      # Pautas, rúbricas y manual de ejecución
```

---

## 🚀 Guía de Inicio Rápido

Para ver las instrucciones detalladas de configuración, puertos, base de datos y credenciales, consulta:
👉 [INSTRUCCIONES_EJECUCION.md](documentacion/INSTRUCCIONES_EJECUCION.md)

### 1. Iniciar Base de Datos
- Asegúrate de tener MySQL corriendo en el puerto 3306.

### 2. Iniciar Backend
```bash
cd backend
mvn spring-boot:run
```
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Iniciar Frontend
```bash
cd frontend
npm install
npm run dev
```
- App React: `http://localhost:5173`
