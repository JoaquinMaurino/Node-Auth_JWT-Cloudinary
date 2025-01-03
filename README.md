# Node API AUTH_JWT Cloudinary

## Descripción del Proyecto

Este es un proyecto backend desarrollado con Node.js que implementa:
- **Autenticación y autorización** mediante JWT.
- **Registro y gestión de usuarios** en MongoDB.
- **Carga y gestión de imágenes** utilizando Cloudinary como almacenamiento externo.

### Características principales:
1. Los usuarios pueden registrarse con un rol predeterminado de "user" o como "admin" si se especifica explícitamente.
2. Solo los usuarios autenticados pueden acceder a determinadas rutas, dependiendo de su rol.
3. Los usuarios "admin" pueden subir imágenes, que se almacenan en Cloudinary y registran en MongoDB.
4. Solo el administrador que subió una imagen tiene permisos para eliminarla.

---

## Instalación y Configuración

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:
   ```env
   PORT=3000
   MONGO_URL=<tu_mongo_url>
   JWT_SECRET_KEY=<tu_secreto_jwt>
   CLOUDINARY_CLOUD_NAME=<tu_nombre_de_cloudinary>
   CLOUDINARY_API_KEY=<tu_api_key>
   CLOUDINARY_API_SECRET=<tu_api_secret>
   ```

   **Nota:** Este proyecto utiliza las variables de entorno mencionadas anteriormente para la configuración. El archivo `.env` debe ser creado localmente por cada usuario y debe contener valores personalizados según su entorno.

4. Ejecutar el proyecto:
   - En modo producción:
     ```bash
     npm start
     ```
   - En modo desarrollo (con Nodemon):
     ```bash
     npm run dev
     ```

---

## Endpoints

### Rutas Principales
- **`/api/auth`**: Rutas relacionadas con autenticación y autorización.
- **`/api/home`**: Página de inicio accesible para usuarios autenticados.
- **`/api/admin`**: Rutas exclusivas para usuarios con rol de administrador.
- **`/api/image`**: Rutas para subir, obtener y eliminar imágenes.

### Detalle de Endpoints

#### **Auth** (`/api/auth`):
- `POST /register`: Registro de un nuevo usuario.
- `POST /login`: Inicio de sesión y generación de un token JWT.
- `PUT /change-password`: Cambio de contraseña para usuarios autenticados.

#### **Home** (`/api/home`):
- `GET /welcome`: Devuelve información del usuario autenticado (requiere token JWT).

#### **Admin** (`/api/admin`):
- `GET /welcome`: Ruta exclusiva para administradores que devuelve información del usuario administrador autenticado.

#### **Image** (`/api/image`):
- `POST /upload`: Sube una imagen a Cloudinary (solo para administradores).
- `GET /get`: Obtiene todas las imágenes subidas (requiere autenticación).
- `DELETE /delete/:id`: Elimina una imagen específica (solo el administrador que la subió).

---

## Modelos de MongoDB

### **User**
```javascript
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User must have an username, please provide one'],
        unique: [true, 'User name is already been used, please try another one'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Must provide an email address'],
        unique: [true, 'Email already in use'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });
```

### **Image**
```javascript
const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      require: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
```

---

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: JSON Web Tokens (JWT)
- **Carga de Imágenes**: Cloudinary
- **Middleware de subida**: Multer
- **Hashing de contraseñas**: Bcrypt.js
- **Variables de Entorno**: Dotenv
- **Desarrollo**: Nodemon

