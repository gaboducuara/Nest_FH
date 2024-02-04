#primera parte -> Generacion de las dependencias
# Install dependencies only when needed
FROM node:20-alpine3.18 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

#segunda parte -> la construccion de la Generacion de las dependencias
# Build the app with cache dependencies
# 20.11-alpino3.18, 20.11.0-alpino3.18
#18-alpine3.15
FROM node:20-alpine3.18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

#tercera parte -> la Ejecucion de las dependencias
# Production image, copy all the files and run next
FROM node:20-alpine3.18 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

#Asegurarse de que la aplicacion este en este directorio
# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD [ "node","dist/main" ]
