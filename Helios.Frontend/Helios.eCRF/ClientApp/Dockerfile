FROM node:lts AS development

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci --legacy-peer-deps

COPY . /app

ENV CI=false
ENV PORT=3000

CMD [ "npm", "start" ]

FROM development AS build

RUN npm run build

FROM development as dev-envs
#RUN <<EOF
#apt-get update 
#apt-get install -y --no-install-recommends git
#EOF

RUN apt-get update -y
RUN apt-get install -y --no-install-recommends git

#RUN <<EOF
#useradd -s /bin/bash -m vscode
#groupadd docker
#usermod -aG docker vscode
#EOF

RUN useradd -s /bin/bash -m vscode
RUN groupadd docker
RUN usermod -aG docker vscode

COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]

FROM nginx:alpine

COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/build .

COPY index.html /usr/share/nginx/html/index.html

ENTRYPOINT ["nginx", "-g", "daemon off;"]