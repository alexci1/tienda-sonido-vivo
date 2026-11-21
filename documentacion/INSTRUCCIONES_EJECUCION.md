# Instrucciones de Ejecución — Proyecto Tienda Sonido Vivo (DSY1104)

Este documento detalla los pasos para levantar y evaluar la solución Full Stack (Backend Spring Boot + Base de Datos MySQL + Frontend React).

---

## 1. Requisitos Previos
* **Java**: JDK 17 o superior instalado (`java -version`).
* **Maven**: Apache Maven 3.8+ instalado (`mvn -version`) o utilizar `./mvnw`.
* **Node.js**: v18+ o v20+ con `npm` o `pnpm`.
* **MySQL**: Servidor MySQL corriendo en el puerto `3306` (ej. vía XAMPP, MySQL Workbench o Docker).

---

## 2. Base de Datos
1. Iniciar el servicio de MySQL.
2. La base de datos `sonido_vivo` se crea automáticamente por la configuración del backend (`createDatabaseIfNotExist=true`).
3. Si deseas inicializarla o inspeccionarla manualmente, ejecuta el script localizado en:
   ```bash
   database/init.sql
   ```
   Este archivo contiene la creación de usuarios demo y los 51 productos categorizados del inventario.

---

## 3. Levantar el Backend (Spring Boot)
1. Abrir una terminal en el directorio `backend`:
   ```bash
   cd backend
   ```
2. Ejecutar la aplicación:
   ```bash
   mvn spring-boot:run
   ```
3. El servidor iniciará en:
   * **API Base**: `http://localhost:8080/api`
   * **Swagger OpenAPI UI**: `http://localhost:8080/swagger-ui.html`
   * **Documentación JSON**: `http://localhost:8080/v3/api-docs`

---

## 4. Levantar el Frontend (React + Vite)
1. Abrir otra terminal en el directorio `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Abrir en el navegador:
   * `http://localhost:5173`

---

## 5. Credenciales de Prueba (RBAC)

| Rol | Usuario | Contraseña | Vistas y Permisos |
|---|---|---|---|
| **Administrador** | `admin` | `admin123` | Acceso a todo el catálogo, Panel Admin completo (pedidos, productos, usuarios) |
| **Vendedor** | `vendedor` | `vendedor123` | Acceso a Gestión de Stock (pedidos y productos) |
| **Cliente** | `cliente` | `cliente123` | Catálogo, Carrito de compras y Checkout de pedidos |

---

## 7. Ejecución con Docker y Docker Compose (Opcional)

Si cuentas con **Docker Desktop** instalado, puedes levantar la arquitectura completa (Base de datos MySQL, Backend Spring Boot y Frontend React con Nginx) con un solo comando:

```bash
docker compose up --build
```

Esto desplegará automáticamente:
- **Base de datos MySQL 8.0**: En el puerto `3306`, con la inicialización automática de `database/init.sql`.
- **Backend Spring Boot**: En el puerto `8080`, con healthcheck esperando a que la base de datos esté lista.
- **Frontend Nginx / React**: En los puertos `80` y `5173`.
- **Swagger UI**: Disponible en `http://localhost:8080/swagger-ui.html`.

Para detener los contenedores:
```bash
docker compose down
```
