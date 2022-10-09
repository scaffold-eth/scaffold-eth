#build
FROM node:lts as build

ARG REACT_APP_PROVIDER
ENV REACT_APP_PROVIDER=$REACT_APP_PROVIDER
ARG REACT_APP_NETWORK
ENV REACT_APP_NETWORK=$REACT_APP_NETWORK
ARG REACT_APP_FAIROSHOST
ENV REACT_APP_FAIROSHOST=$REACT_APP_FAIROSHOST

WORKDIR /base
COPY . .
RUN npm install
SHELL ["/bin/bash", "-eo", "pipefail", "-c"]
RUN bash -e -o pipefail -c 'env |grep REACT >> .env'

RUN npm run build

#webserver
FROM nginx:1.22-alpine
COPY --from=build /base/packages/react-app/build /usr/share/nginx/html
RUN echo "real_ip_header X-Forwarded-For;" \
    "real_ip_recursive on;" \
    "set_real_ip_from 0.0.0.0/0;" > /etc/nginx/conf.d/ip.conf
RUN sed -i '/index  index.html index.htm/c\        try_files $uri /index.html;' /etc/nginx/conf.d/default.conf
RUN chown -R nginx /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
