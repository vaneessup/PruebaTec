FROM node:22

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar archivos necesarios
COPY package.json package-lock.json ./ 

# Instalar dependencias
RUN npm install --legacy-peer-deps --production --verbose
RUN npm install --only=dev --verbose
RUN npm install -g nodemon

# Copiar el resto del código
COPY . . 

# Copiar el archivo .env.docker (si existe) al contenedor
COPY .env.docker .env

# Establecer permisos
RUN chown -R node /usr/src/app

# Establecer el usuario por defecto para ejecutar la app
USER node

# Comando para iniciar la aplicación
CMD ["nodemon", "--exec", "babel-node", "index.js"]
