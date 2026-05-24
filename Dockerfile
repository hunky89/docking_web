FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV BACKEND_URL=http://backend:8000

# Copy pre-built standalone output (built locally before docker build)
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
