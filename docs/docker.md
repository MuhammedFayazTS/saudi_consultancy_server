# Docker Commands

## Build
docker build --no-cache -t saudi-consultancy:1.0 .

## Run
docker run -d -p 3500:3500 --env-file .env --name saudi-consultancy-container saudi-consultancy:1.0

## Stop
docker stop saudi-consultancy-container

## Remove
docker rm saudi-consultancy-container

## View Logs
docker logs -f saudi-consultancy-container
