# INFORME DE COBERTURA Y ANÁLISIS DE PRUEBAS UNITARIAS
**Proyecto:** Tienda E-commerce de Audio e Instrumentos Musicales — **Sonido Vivo**  
**Asignatura:** Desarrollo Full Stack II (DSY1104)  
**Stack de Testing:** Vitest + React Testing Library (Actualización moderna de Jasmine/Karma)

---

## 1. Introducción y Propósito del Testing
El objetivo de este proceso de control de calidad es asegurar el correcto funcionamiento de las funciones lógicas clave, el servicio de autenticación con persistencia local (`localStorage`) y la manipulación de datos del carrito de compras en la aplicación frontend desarrollada en React y Vite. 

Para cumplir con este estándar, se implementó un entorno de pruebas automatizadas utilizando **Vitest**, el cual permite ejecutar assertions rápidas y verificar que los componentes y utilidades respondan de manera previsible ante distintos escenarios de uso.

---

## 2. Configuración del Entorno de Pruebas
El entorno de pruebas fue configurado utilizando la integración nativa de Vite para optimizar la velocidad de ejecución:
* **Framework de pruebas:** `Vitest v5.0.5`
* **Entorno DOM simulado:** `jsdom` (permite simular objetos globales del navegador como `localStorage` sin necesidad de un navegador real).
* **Librerías de soporte:** `@testing-library/react` y `@testing-library/jest-dom`.

---

## 3. Detalle de Pruebas Unitarias Implementadas

### Módulo 1: Validaciones de Entrada (`src/test/validaciones.test.js`)
* **Propósito:** Validar las funciones utilitarias encargadas de comprobar la correcta longitud de textos (como nombres o códigos) y el formato de correos electrónicos.
* **Casos probados:**
  1. `validarTexto`: Verifica que un texto cumpla con el mínimo de caracteres especificado (retornando `true` si es válido y `false` si es menor al rango).
  2. `validarCorreo`: Comprueba cadenas de texto para asegurar que contengan estructuras válidas de correo electrónico (ej. `admin@sonidovivo.cl`).
* **Resultado:** **Aprobado (Pass)**. Las reglas de validación previenen entradas vacías o incorrectas en los formularios del sistema.

### Módulo 2: Servicio de Autenticación y Sesión (`src/test/auth.test.js`)
* **Propósito:** Asegurar la integridad del sistema de login simulado mediante `localStorage`, evaluando tanto credenciales correctas como incorrectas y el cierre de sesión.
* **Casos probados:**
  1. *Credenciales incorrectas:* Verifica que al introducir un usuario o clave inválida la función retorne un valor nulo o falsy, manteniendo el estado de autenticación en `false`.
  2. *Credenciales válidas:* Comprueba que al iniciar sesión como administrador (`admin / admin123`), la función retorne el objeto del usuario correspondiente y guarde la sesión de forma persistente en `localStorage`.
  3. *Cierre de sesión:* Verifica que el método `cerrarSesion()` limpie correctamente el almacenamiento local y redefina el estado de acceso.
* **Resultado:** **Aprobado (Pass)**. El comportamiento de los roles y la persistencia de sesión operan sin fugas de datos.

### Módulo 3: Lógica del Carrito de Compras (`src/test/carrito.test.js`)
* **Propósito:** Validar el cálculo matemático de subtotales de equipos de música e instrumentos, así como la correcta serialización y persistencia de los productos seleccionados en el carro.
* **Casos probados:**
  1. *Cálculo de subtotales:* Comprueba que la multiplicación entre el precio de un instrumento (ej. Guitarra Eléctrica) y su cantidad seleccionada entregue el monto total exacto.
  2. *Persistencia en `localStorage`:* Simula la incorporación de un equipo de audio (ej. Micrófono Condensador Shure) al carrito, asegurando que se guarde como JSON y pueda recuperarse íntegramente con sus propiedades y cantidades correctas.
* **Resultado:** **Aprobado (Pass)**. El flujo de compra y la persistencia del carrito responden con precisión matemática y estructural.

---

## 4. Análisis de Resultados y Conclusión
* **Cobertura de Funcionalidades Principales:** Las pruebas ejecutadas cubren los tres pilares críticos de la aplicación: validaciones de formularios, seguridad/sesión y lógica comercial del carrito.
* **Estabilidad del Código:** La ejecución automatizada mediante el comando `npm test` reporta un **100% de éxito en las suites de pruebas**, garantizando que cambios futuros en el código frontend no rompan la lógica esencial del negocio.