
<h1 align="center">🚀 GraphQL API </h1>

Esta es una API basada en GraphQL para gestionar posts, usuarios y comentarios.  
El proyecto incluye resolvers para realizar consultas (queries) y modificaciones (mutations) sobre los datos, con validación de usuarios.  

## 🌟 Características 

- CRUD para posts.  
- CRUD para comentarios relacionados con posts.  
- Validación de usuarios para cada operación.  
- Organización modular del código.  
- Pruebas unitarias con Jest para garantizar calidad y funcionalidad.  
- Liquibase para el control de versiones de la base de datos.  

## 📋 Requisitos previos 

Asegúrate de tener instalado:  

- [Node.js](https://nodejs.org/) (v16 o superior)  
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)  
- [Docker](https://www.docker.com/) (opcional, para ejecutar la base de datos y la aplicación en contenedores)  
- [PostgreSQL](https://www.postgresql.org/) si no usas Docker para la base de datos  
- [Liquibase](https://www.liquibase.org/) para gestionar los cambios en la base de datos  
- [Jest](https://jestjs.io/) para ejecutar las pruebas unitarias  

## 🔧 Instalación 

1. Clona este repositorio:  

   ```bash
   git clone https://github.com/vaneessup/PruebaTec
   cd PruebaTec
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

### 🐳 Usando Docker (opcional)

Si prefieres usar Docker para la base de datos y la aplicación, puedes seguir estos pasos:

1. Construye y levanta los contenedores con Docker:

   ```bash
   docker-compose up --build
   ```

   Esto levantará la aplicación y PostgreSQL en contenedores. La base de datos se configurará automáticamente.

2. Si prefieres usar Docker solo para la base de datos, puedes ejecutar:

   ```bash
   docker-compose up db
   ```

### ⚙️ Usando PostgreSQL localmente

Si prefieres ejecutar PostgreSQL localmente, sigue estos pasos:

1. Instala PostgreSQL y crea una base de datos.
2. Configura las variables de entorno en el archivo `.env` (más abajo).

### 📝 Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env.local
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_clave
DB_NAME=tu_bd

```
```env.docker
DB_HOST=db
DB_PORT=5433
DB_USER=tu_usuario
DB_PASSWORD=tu_clave
DB_NAME=tu_bd

```


Asegúrate de reemplazar `usuario`, `contraseña` y `mi_base_de_datos` con tus credenciales y el nombre de tu base de datos.

## 🚀 Uso

Iniciar el servidor en desarrollo:

```bash
npm run start
```

Este comando iniciará el servidor en modo de desarrollo. Puedes acceder a [http://localhost:4000/graphql](http://localhost:4000/graphql) para interactuar con el esquema GraphQL.

### 🔬 Ejecutar pruebas unitarias

```bash
npm test
```

Este comando ejecutará las pruebas unitarias de los resolvers de GraphQL para asegurar que todo funcione correctamente.

### 🔑 Endpoints disponibles

**GraphQL Playground:** Una vez que el servidor esté ejecutándose, puedes acceder a [http://localhost:4000/graphql](http://localhost:4000/graphql) para interactuar con el esquema GraphQL.

### 💻 Ejemplo de Queries y Mutations

**Obtener todos los posts:**

```graphql
query Posts {
  posts {
    id
    content
    title
  }
}
```

**Crear un comentario:**

```graphql
mutation Mutation($userId: ID!, $postId: ID!, $text: String!) {
  createComment(userId: $userId, postId: $postId, text: $text) {
    text
  }
}
```

## 🏗️ Estructura del proyecto

```bash
src/
├── bd/
│   └── cnn.js         # Conexión a la base de datos PostgreSQL
├── models/
│   ├── comments.js    # Modelo para los comentarios
│   ├── posts.js       # Modelo para las publicaciones
│   └── users.js       # Modelo para los usuarios
├── resolvers/
│   ├── comments/
│   │   ├── commentsResolvers.js     # Lógica de resoluciones para los comentarios
│   │   └── commentsResolvers.test.js # Pruebas de resoluciones para los comentarios
│   ├── posts/
│   │   ├── postResolvers.js         # Lógica de resoluciones para las publicaciones
│   │   └── postResolvers.test.js    # Pruebas de resoluciones para las publicaciones
│   ├── users/
│   │   ├── userResolvers.js         # Lógica de resoluciones para los usuarios
│   │   └── userResolvers.test.js    # Pruebas de resoluciones para los usuarios
│   ├── resolvers.js                 # Consolidación de todos los resolvers
│   └── resolvers.test.js            # Pruebas unitarias de todos los resolvers
├── schemas/
│   └── typeDef.js                   # Definición del esquema GraphQL
├── errors.js                         # Manejo de errores globales
├── app.js                            # Configuración de la aplicación
└── server.js                         # Inicialización del servidor Express
```

### Archivos fuera de `src/`:

```bash
db.changelog-master.xml   # Archivo para gestión de cambios en la base de datos (Liquibase)
index.js                  # Entrada principal para ejecutar el servidor
liquibase.properties      # Configuración de conexión para Liquibase
jest.config.js            # Configuración de Jest para pruebas unitarias
package.json              # Dependencias y scripts del proyecto
```

## 🐳 Dockerización

Este proyecto está configurado para ser ejecutado dentro de contenedores Docker utilizando `docker-compose`. Los pasos para dockerizarlo son los siguientes:

1. Construir la imagen de la aplicación:

   ```bash
   docker-compose build
   ```

2. Iniciar los contenedores:

   ```bash
   docker-compose up
   ```

   Esto levantará tanto la aplicación como PostgreSQL en contenedores.

3. Parar los contenedores:

   ```bash
   docker-compose down
   ```

### 📜 docker-compose.yml

Asegúrate de tener un archivo `docker-compose.yml` que defina los contenedores para la base de datos y la aplicación. Aquí te dejo un ejemplo:

```yaml
services:
  # Servicio para PostgreSQL
  db:
    image: postgres:latest
    container_name: postgres
    environment:
      POSTGRES_USER: TU_USUARIOS
      POSTGRES_PASSWORD: TU_PASSWORD
      POSTGRES_DB: TU_BD
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - app-network

  # Servicio para la API de Node.js
  api:
    build: .
    container_name: api
    ports:
    - "4000:4000" 
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: TU_BD
      DB_USER: TU_USUARIOS
      DB_PASSWORD: TU_PASSWORD
    depends_on:
      - db
    networks:
      - app-network

  # Servicio para Liquibase
  liquibase:
    image: liquibase/liquibase
    container_name: liquibase
    environment:
      LIQUIBASE_URL: jdbc:TU_USUARIOS://db:5432/TU_BD
      LIQUIBASE_USER: postgres
      LIQUIBASE_PASSWORD: 1234
    volumes:
      - ./db.changelog-master.xml:/liquibase/changelog/db.changelog-master.xml
    depends_on:
      - db
    networks:
      - app-network

volumes:
  pgdata:

networks:
  app-network:
    driver: bridge

```

## 🛠️ Liquibase

Este proyecto usa Liquibase para gestionar los cambios en la base de datos. Para ejecutarlo correctamente:

1. Asegúrate de tener el archivo `liquibase.properties` configurado con las credenciales de tu base de datos.
2. Ejecuta los cambios de la base de datos usando el siguiente comando:

   ```bash
   liquibase update
   ```

### 📄 Liquibase Properties

```properties
url=jdbc:postgresql://localhost:5432/mi_base_de_datos
username=usuario
password=contraseña
driver=org.postgresql.Driver
changeLogFile=db.changelog-master.xml
```


NO OLVIDES MODIFICAR EL ARCHIVO DE CONEXIÓN A LA BASE DE DATOS!!

## 🤝 Contribuciones

¡Contribuciones son bienvenidas! Si encuentras un problema o tienes una idea para mejorar, crea un issue o envía un pull request.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
