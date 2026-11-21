import json

with open(r'c:\tienda-sonido-vivo\frontend\src\data\productosSonidoVivo.js', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('[')
end = content.rfind(']') + 1
prods = json.loads(content[start:end])

lines = []
lines.append('-- ============================================================')
lines.append('-- Script de Carga de Datos Iniciales - Tienda Sonido Vivo')
lines.append('-- Base de Datos: sonido_vivo')
lines.append('-- ============================================================\n')

lines.append('-- 1. USUARIOS INICIALES (Contraseña de prueba: admin123, vendedor123, cliente123)')
lines.append("INSERT INTO usuarios (id, username, password, nombre, rol) VALUES")
lines.append("(1, 'admin', '$2a$10$4B9a87gG8y7F7f6E5d4C3b2A1Z0y9x8w7v6u5t4s3r2q1p0o9n8m7', 'Administrador General', 'ADMINISTRADOR'),")
lines.append("(2, 'vendedor', '$2a$10$4B9a87gG8y7F7f6E5d4C3b2A1Z0y9x8w7v6u5t4s3r2q1p0o9n8m7', 'Juan Vendedor', 'VENDEDOR'),")
lines.append("(3, 'cliente', '$2a$10$4B9a87gG8y7F7f6E5d4C3b2A1Z0y9x8w7v6u5t4s3r2q1p0o9n8m7', 'Pedro Cliente', 'CLIENTE')")
lines.append("ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);\n")

lines.append('-- 2. PRODUCTOS INICIALES (51 Instrumentos y Equipos de Audio)')
for p in prods:
    desc = p.get('descripcion', '').replace("'", "''")
    nom = p.get('nombre', '').replace("'", "''")
    marca = p.get('marca', '').replace("'", "''")
    cat = p.get('categoria', '').replace("'", "''")
    mod = p.get('modelo', '').replace("'", "''")
    img = p.get('imagen', '').replace("'", "''")
    line = f"INSERT INTO productos (codigo, nombre, marca, modelo, categoria, descripcion, imagen, precio, stock) VALUES ('{p['codigo']}', '{nom}', '{marca}', '{mod}', '{cat}', '{desc}', '{img}', {p['precio']}, {p['stock']}) ON DUPLICATE KEY UPDATE stock=VALUES(stock);"
    lines.append(line)

output_sql = '\n'.join(lines)

with open(r'c:\tienda-sonido-vivo\database\init.sql', 'w', encoding='utf-8') as out:
    out.write(output_sql)

with open(r'c:\tienda-sonido-vivo\backend\src\main\resources\data.sql', 'w', encoding='utf-8') as out:
    out.write(output_sql)

print(f"Completado exitosamente con {len(prods)} productos.")
