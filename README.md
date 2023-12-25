# i-acs

[![gateway-ci-test](https://github.com/vural-hakan/i-acs/actions/workflows/gateway-api-test-coverage.yml/badge.svg)](https://github.com/vural-hakan/i-acs/actions/workflows/gateway-api-test-coverage.yml) [![accounting-ci-test](https://github.com/vural-hakan/i-acs/actions/workflows/accounting-service-test-coverage.yml/badge.svg)](https://github.com/vural-hakan/i-acs/actions/workflows/accounting-service-test-coverage.yml) [![authorization-ci-test](https://github.com/vural-hakan/i-acs/actions/workflows/authorization-service-test-coverage.yml/badge.svg)](https://github.com/vural-hakan/i-acs/actions/workflows/authorization-service-test-coverage.yml)

## API

* This project use ***PG*** for storing accounting data and ***REDIS*** for caching and storing authorization data.
* This project use ***RabbitMQ*** for inter-apps communication 
* BEFORE start please ***CREATE DATABASE*** on ***PG*** and update ***.env*** files.
* For integration with CI/CD pipelines, including Kubernetes secrets and GitHub secrets, the project opts not to use the Nest Config Service. Instead, the ***dotenv*** library is preferred for handling configuration settings.

### BEFORE USE

* Check ***docs > Architecture Diagram.pdf***
* Prepare **PG**
```bash
cd setups/postgresql
docker compose up -d 
cd .. && cd ..
```

* Prepare **RabbitMQ**
```bash
cd setups/rabbitmq
docker compose up -d 
cd .. && cd ..
```

* Prepare **Redis**
```bash
cd setups/redis
docker compose up -d 
cd .. && cd ..
```

* Update ***apps > accounting-service > .env***
```bash
vi apps/accounting-service/.env
```

* Update ***apps > authorization-service > .env***
```bash
vi apps/authorization-service/.env
```

* Update ***apps > gateway-api > .env***
```bash
vi apps/gateway-api/.env
```

* Install dependencies for all apps
```bash
yarn install
```

* Migrate Postgres database
```bash
yarn typeorm:run
```

### Usage

#### Start services
* Open new terminal
* Set working directory i-acs

```bash
yarn start:accounting
```

* Open new terminal
* Set working directory i-acs
```bash
yarn start:authorization
```

#### Start gateway
* Open new terminal
* Set working directory i-acs

```bash
yarn start:gateway
```

#### Alternative usage with concurrently
* Open new terminal
* Set working directory i-acs
```bash
yarn start:all
```

## Testing

### Swagger Documentation
* To accessing Swagger UI

```bash
http://localhost:8080/docs
```
* To update Swagger path(actual /docs) go to gateway-api > main.ts file and update 

```typescript
    SwaggerModule.setup('/docs', app, swaggerDocument, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        displayRequestDuration: true,
        displayOperationId: true,
        requestSnippetsEnabled: true,
        syntaxHighlight: {
          activate: true,
          theme: 'tomorrow-night',
        },
      },
    } as SwaggerCustomOptions);
```

### Gateway Tests

* Gateway has
    * Unit tests with **jest**

Running unit tests
```bash
yarn test:gateway
```

For generating coverage report

```bash
yarn test:cov:gateway
```

**NOTES:** 
* To find coverage report in ***apps > gateway-api > coverage*** directory
* Open **index.html** file with browser or **coverage-summary.json** file with JSON editor


### Service Tests
* Service has
    * Unit tests with **jest**

Running accounting service tests
```bash
yarn test:accounting
```

Running authorization service tests
```bash
yarn test:authorization
```

Generation accounting service coverage report
```bash
yarn test:cov:accounting
```

Generation authorization service coverage report
```bash
yarn test:cov:authorization
```

**NOTES:** 
* To find coverage report in apps > xxx-service > coverage directory
* Open **index.html** file with browser or **coverage-summary.json** file with JSON editor


### Extra Scripts

* For linting all workspaces

```bash
yarn lint
```

* Removing node_modules, build folders, test coverage reports, lock  files

```bash
yarn clear:all
```

### Docker Support
* You can find Dockerfile file both workspace.
* It will be trigger over Github Actions or any CI Tools
* It will running tests before build. With Jest teardown feature, it will share with ***SLACK*** or any other third party platforms

