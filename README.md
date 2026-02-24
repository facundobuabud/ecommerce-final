# 🛒 Ecommerce API

REST API para una plataforma de ecommerce construida con Node.js, Express, TypeScript y MongoDB. Permite gestionar productos, usuarios y órdenes de compra con autenticación JWT y control de roles.

---

## 🛠️ Tecnologías

- **Node.js** + **Express** — servidor y rutas
- **TypeScript** — tipado estático
- **MongoDB** + **Mongoose** — base de datos
- **JWT** — autenticación por tokens
- **bcryptjs** — encriptación de contraseñas
- **Zod** — validación de schemas
- **dotenv** — manejo de variables de entorno

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ecommers-final
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce
PORT=3000
JWT_SECRET=tu_clave_secreta
```

### 4. Iniciar el servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

El servidor corre en `http://localhost:3000` por defecto.

---

## 📚 Documentación de endpoints

### 🔐 Auth — `/auth`

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Registrar un nuevo usuario | Público |
| POST | `/auth/login` | Iniciar sesión y obtener token | Público |

#### POST `/auth/register`
```json
{
  "name": "Juan Perez",
  "email": "juan@email.com",
  "password": "123456"
}
```

#### POST `/auth/login`
```json
{
  "email": "juan@email.com",
  "password": "123456"
}
```
**Respuesta:** devuelve un token JWT que debe usarse en los headers de las rutas protegidas.

---

### 📦 Productos — `/products`

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/products` | Obtener todos los productos activos | Público |
| POST | `/products` | Crear un producto | Admin |
| PATCH | `/products/:id` | Actualizar un producto | Admin |
| DELETE | `/products/:id` | Eliminar (soft delete) un producto | Admin |
| PATCH | `/products/:id/restore` | Restaurar un producto eliminado | Admin |

#### Query params disponibles en GET `/products`

| Param | Tipo | Descripción |
|-------|------|-------------|
| `category` | string | Filtrar por categoría |
| `brand` | string | Filtrar por marca |
| `minPrice` | number | Precio mínimo |
| `maxPrice` | number | Precio máximo |
| `search` | string | Buscar por nombre o descripción |
| `sortBy` | string | Campo por el que ordenar (`price`, `name`, etc.) |
| `order` | string | `asc` o `desc` |
| `page` | number | Número de página (default: 1) |
| `limit` | number | Resultados por página (default: 10) |

**Ejemplo:**
```
GET /products?category=electronica&minPrice=100&maxPrice=500&sortBy=price&order=asc&page=1&limit=10
```

#### Body para POST `/products`
```json
{
  "name": "Producto ejemplo",
  "price": 999,
  "category": "electronica",
  "brand": "samsung",
  "stock": 50,
  "description": "Descripción del producto"
}
```

---

### 🧾 Órdenes — `/orders`

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/orders` | Crear una nueva orden | Usuario autenticado |
| GET | `/orders/my-orders` | Ver mis órdenes | Usuario autenticado |
| GET | `/orders/:id` | Ver una orden por ID | Usuario dueño o Admin |
| GET | `/orders` | Ver todas las órdenes | Admin |
| PATCH | `/orders/:id/status` | Actualizar estado de una orden | Admin |
| DELETE | `/orders/:id` | Cancelar una orden | Usuario dueño |

#### POST `/orders`
```json
{
  "items": [
    { "product": "ID_DEL_PRODUCTO", "quantity": 2 },
    { "product": "ID_DEL_PRODUCTO_2", "quantity": 1 }
  ]
}
```

#### PATCH `/orders/:id/status`
```json
{
  "status": "CONFIRMED"
}
```
Estados válidos: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## 🔑 Autenticación

Las rutas protegidas requieren enviar el token JWT en el header de la petición:

```
Authorization: Bearer <token>
```

---

## 👤 Roles

| Rol | Descripción |
|-----|-------------|
| `USER` | Usuario estándar, puede comprar y gestionar sus propias órdenes |
| `ADMIN` | Acceso completo a productos, órdenes y usuarios |