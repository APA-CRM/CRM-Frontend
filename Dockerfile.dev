FROM node:24.3.0-alpine3.22 AS build
WORKDIR /app

RUN npm install -g @angular/cli@19

COPY package*.json ./

RUN npm install

COPY . .

RUN ng build --configuration development

FROM nginx:alpine3.22

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/crm-frontend/browser /usr/share/nginx/html
EXPOSE 82

CMD ["nginx", "-g", "daemon off;"]
