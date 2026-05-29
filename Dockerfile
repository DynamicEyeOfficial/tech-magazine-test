FROM node:24-slim

LABEL org.opencontainers.image.title="Tech Magazine"
LABEL org.opencontainers.image.description="Professional IT magazine website, CMS, newsroom, and API platform"

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000

RUN useradd --system --create-home --home-dir /home/techmag --shell /usr/sbin/nologin techmag

COPY package.json ./
RUN npm install --omit=dev
COPY *.js ./
COPY public ./public
COPY scripts ./scripts
COPY database ./database
COPY infra ./infra
COPY DEPLOYMENT.md LAUNCH_CHECKLIST.md ./
COPY MOBILE_APP_NOTES.md ./

RUN mkdir -p data backups public/uploads && chown -R techmag:techmag /app /home/techmag

USER techmag

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 8000) + '/api/health').then(r => { if (!r.ok) process.exit(1); }).catch(() => process.exit(1));"

CMD ["node", "server.js"]
