# CRM-Frontend

## Overview

CRM-Frontend is the front-end application for the APA-CRM platform, built with Angular and TypeScript. The project provides a user interface for interacting with APA-CRM services, following a modern component-based architecture.

## Technology Stack

- **TypeScript**
- **Angular**
- **HTML/CSS**
- **Docker** (development workflow)
- **Node.js / npm**
- 
## Prerequisites

- Node.js (v18+ recommended)
- npm
- Angular CLI (`npm install -g @angular/cli`)
- Docker (optional for containerization)
- Git

## Build & Run Instructions

### 1. Clone the repository

```sh
git clone https://github.com/APA-CRM/CRM-Frontend.git
cd CRM-Frontend
```

### 2. Install dependencies

```sh
npm install
```

### 3. Start the development server

```sh
ng serve
```

Open your browser at [http://localhost:4200](http://localhost:4200) to view the application. The server reloads automatically on source changes.

### 4. Build for production

```sh
ng build --prod
```

Build artifacts are output to the `dist/` directory.

### 5. Docker (development)

```sh
docker build -f Dockerfile.dev -t crm-frontend-dev .
docker run -p 4200:4200 crm-frontend-dev
```

## Testing

### Unit Tests

```sh
ng test
```

Executes unit tests using Karma.

### End-to-End Tests

```sh
ng e2e
```

Runs e2e tests (set up required).

## Contribution Guidelines

We welcome contributions! Please follow these steps:

- Fork the repository and create a feature branch
- Follow Angular and TypeScript coding standards
- Write clear and concise commit messages
- Submit a Pull Request to the `develop` branch with a description

For bug reports and feature requests, please use [GitHub Issues](https://github.com/APA-CRM/CRM-Frontend/issues).

## License

See [LICENSE](LICENSE) for details.

## Contact

For questions or support, open an issue in this repository.

---
_See project source for further documentation and environment configuration._
