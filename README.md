  # See More

  <div align="center">

  [![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
  

  Full-stack e-commerce application built with Angular and NestJS, imitating the 1800 Contacts ordering
  system.

  </div>

  ---

  ## 🚀 Tech Stack

  **Frontend:** Angular 21, TypeScript, RxJS, TailwindCSS v4

  **Backend:** NestJS, TypeORM, PostgreSQL, JWT

  **DevOps:** Docker, Nginx

  ---

  ## 📁 Project Structure

  - **see-more-angular/** - Angular frontend
    - **src/app/core/** - Core services (API, Auth, Cart)
    - **src/app/features/** - Feature modules (About, Products, Cart, Login, Register, Profile)
    - **src/app/layout/** - Layout components (Header, Footer, Sidebar)
    - **nginx.conf** - Nginx configuration
  - **see-more-nest/** - NestJS backend
    - **src/auth/** - Authentication module (JWT)
    - **src/users/** - Users module
    - **src/products/** - Products module
    - **src/orders/** - Orders module
    - **schemas/** - Sql Schemas

  ---

  ## 🚦 Getting Started

  ### Prerequisites
  - Docker & Docker Compose

  # Docker Setup (Recommended)

  **Clone and navigate**
  ```bash
  git clone https://github.com/zsimmons25/see-more.git
  cd see-more
  ```

  Build
  ```
  docker-compose -f docker-compose.dev.yml build
  ```

  Run
  ```
  docker-compose -f docker-compose.dev.yml up
  ```

  Access
  
  - Frontend 

      `http://localhost:4200`

  - Backend 

      `http://localhost:3000`

  # Local Env

  ### Prerequisites
  - Node.js v20+
  - Postgresql v15+

  ## Install dependencies
  ### Frontend
  ```
  cd see-more-angular && pnpm install
  ```

  ### Backend
  ```
  cd see-more-nest && pnpm install
  ```

  ## Run PostgreSQL and load schemas
  ```
  psql -U postgres -d see_more_db < see-more-nest/schemas/01-users.sql
  psql -U postgres -d see_more_db < see-more-nest/schemas/02-products.sql
  psql -U postgres -d see_more_db < see-more-nest/schemas/03-orders.sql
  ```

  ## Start services
  ### Frontend
  ```
  pnpm start
  ```

  ### Backend
  ```
  pnpm start
  ```

  ## Access
  
  - Frontend 

      `http://localhost:4200`

  - Backend 

      `http://localhost:3000`

  # Production Deployment
  ```
  docker-compose build
  docker-compose up -d
  ```