## Heading Artywiz Image Loader

### Base information
- Service ini untuk cluster menggunakan pm2 bukan dari require('cluster');
- Koneksinya via redis pubsub
- Database minio sebagai image cache dan redis sebagai data cache 

### Docker compose config
Create folder image_loader_app for this project and outside this project folder create docker-compose.yaml like a below
```
version: "3.8"
services:
  image_loader:
    image : artywiz_image_loader
    build: ./image_loader_app/image_node
    working_dir : '/opt/app/image_loader_app'
    command: >
      bash -c "
        cp docker_config/dev/nginx/artywiz_local.conf /etc/nginx/sites-enabled/artywiz_local.conf &&
        cp docker_config/dev/nginx/generator_local.conf /etc/nginx/sites-enabled/generator_local.conf &&
        nginx -t &&
        service nginx start &&
        tail -f > /dev/null"
    #command : >
    #  bash -c "
    #    cp generator_headless_image/artywiz.conf /etc/nginx/sites-enabled/artywiz.conf &&
    #    ./wait-for-it.sh host.docker.internal:3306 &&
    #    npm install &&
    #    pm2 start index.js &&
    #    pm2 start cluster.js &&
    #    service nginx start &&
    #    pm2 log all"
    #hostname: myappserver
    #shm_size: 256mb
    deploy:
      resources:
        limits:
          cpus: 1
          memory: 1G
    #expose: [3001]
    ports:
      - "3000:3001"
    volumes:
      - "./image_loader_app:/opt/app/image_loader_app"
      #- "./node_modules:/opt/app/node_modules"
    #depends_on:
      #- redis
      #- mysql
    #links :
    #  - door_app
      #- mysql
networks:
  default:
    external:
      name: main_network
```
