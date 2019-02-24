FROM node:11-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build && \
  chmod 755 /app/cron/script.sh /app/cron/entry.sh && \
  ln -sf /proc/1/fd/1 /var/log/cron.log && \
  /usr/bin/crontab /app/cron/crontab

CMD ["cron/entry.sh"]