# a partir de que imagen existente del dockerHub vamos a crear la app
FROM node:8

# directorio donde vamos a alojar la aplicacion
WORKDIR /usr/src/app

# copimos y pegamos el package.json en la el directorio que creamos
COPY package*.json ./

# ejecutamos el comando para instalar todas las dependencias
RUN npm install

# Traemos todo el codigo
COPY . .

# exponemos el puerto donde va a estar corriendo la app dentro del container
EXPOSE 8080

#con el comando que vamos a correr la api
CMD [ "node", "api/Api.js" ]