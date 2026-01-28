FROM node:18.16-bookworm-slim
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y libc6  && \
    apt-get clean

WORKDIR /app
COPY .yarn ./.yarn
COPY package.json .yarnrc.yml yarn.lock ./

WORKDIR /app/client
COPY ./client/package.json ./
RUN yarn install

ARG NEXT_PUBLIC_MATOMO_URL
ARG NEXT_PUBLIC_MATOMO_SITE_ID
ARG NEXT_PUBLIC_ENVIRONMENT

ENV NEXT_PUBLIC_MATOMO_URL=$NEXT_PUBLIC_MATOMO_URL
ENV NEXT_PUBLIC_MATOMO_SITE_ID=$NEXT_PUBLIC_MATOMO_SITE_ID
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NODE_ENV=production


ENV NEXT_TELEMETRY_DISABLED 1

COPY ./client .
RUN chown -R node:node /app/client
USER node

RUN yarn build

EXPOSE 3000
ENV PORT 3000
ENTRYPOINT ["/app/client/entrypoint.sh"]