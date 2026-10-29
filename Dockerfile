FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js postcss.config.js tailwind.config.js ./
COPY src ./src
COPY public ./public
ENV VITE_BASE_PATH=/
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node server/app.mjs server/production.mjs ./server/
USER node
EXPOSE 3000
CMD ["node", "server/production.mjs"]
