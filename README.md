# Q&A Forum

This is a project of a question and answers forum, in which is possible to ask or answer a question and comment questions or answers. Also, it is possible to have attachments on questions and answers.

This project is a continuation from the [domain part of the forum project](https://github.com/arakakimath/forum-domain-clean-arch). This project started with the base structure from [NestJS](https://docs.nestjs.com/). 

In this project, the main initial objective was to implement all infrastructure layers, from Gateways, Controllers and Presenters (Interface Adapters), to communicate with DBs, Devices, Front-End, UI and External Interfaces (Frameworks & Drivers). Then, the domain part was added and integration was done to have all the project working as one from the most external layers to the most internal ones.

To built this project, it was used concepts like DDD, SOLID, Clean Architecture, Design patterns (Factory and Repository), etc. Vitest was used for dealing with tests.

---

## Table of contents

1. [Project details](#project-details)
2. [Project setup](#project-setup)
3. [Compile and run the project](#compile-and-run-the-project)
4. [Run tests](#run-tests)
5. [Deployment](#deployment)
6. [Resources](#resources)
7. [Support](#support)
8. [Stay in touch](#stay-in-touch)
9. [License](#license)

---

## Project details

The project was initialized using a NestJS template. Since NestJS follows a modular structure, multiple modules were created to improve organization and maintainability.

### Validation

The Zod package was used for schema validation, ensuring request bodies (via NestJS pipes) and environment variables are correctly formatted.

### Normalization

ESLint package was used to create a pattern for maintaining the code clean and well-written.

### Authentication

Once dealing with controllers, it became necessary to think about authentication strategies. TThe chosen approach was RS256, a public-private key algorithm where the system maintains one private key and at least one public key. The private key is only acessible in the main domain for security reasons and the public key is generated from that. That one's objectives are to create a token to authenticate users and to create public keys, while public key's objective is just validate tokens. 

A controller was used to authenticate users and return a token. By default, all controller routes needs authentication.

### Controllers

Controllers act as intermediaries between external applications (e.g., databases, web services) and internal business logic (e.g., use cases). 

At first, controllers were built with an internal algorithm that simulated what an internal layer on the domain part would do, once the beginning of the project was focused on the infrastructure part (external layers on the Clean Architecture). Then, it was integrated with domain part to actually communicate external and internal layers of the project.

### Repositories

In the domain layer, interfaces were defined to enforce repository structure. These later became abstract classes since NestJS compiles TypeScript to JavaScript.

### Mappers

As entities and tables on database do not necessarily walk together, problems start to arise when trying to integrate these parts. Saving a domain entity to the database isn’t straightforward, as entity properties often don’t directly match table structures. Then, it is necessary to have mappers, which their main function is to convert one kind of data to another. 

### Gateways

Besides repositories, there were established three interfaces of gateways at domain: one to generate token from the private key and a payload, one to hash user's password and other to compare the user's password with the hashed one at database. In domain, these gateways were fake implemented just to simulate their real functions and to execute unit tests. At infra, BCryptJS was used to the methods of hash and compare, and JwtService, from Nest, was used to generate tokens.

### Presenters

One of the challenges of providing data as a response to HTTP requests is balancing overfetching and underfetching—sending too much or too little data, respectively. When an HTTP request is made and the requester expects valid data, this data is not necessarily stored in a single table or entity, nor does it always include all the data stored in an entity, for example.

To optimize performance, presenters were implemented in the infrastructure layer. They ensure that requesters receive only the necessary data while minimizing HTTP requests and reducing unnecessary data transfer.

### Database

The database layer was designed to ensure scalability, reliability, and performance. PostgreSQL was chosen as the primary database due to its robustness, support for complex queries, and compatibility with relational data structures. Docker was used to containerize both the PostgreSQL database and Redis cache, ensuring consistency across development, testing, and production environments.

#### PostgreSQL with Docker

- Containerization: PostgreSQL was set up using Docker to simplify deployment and maintain consistency across environments. A docker-compose file was created to define the database service, including environment variables for configuration (e.g., username, password, database name).

- Migrations: Database schema changes were managed using Prisma migration tools to ensure version control and seamless updates across environments.

- Integration with NestJS: The application connected to the PostgreSQL database using Prisma, allowing seamless interaction between the application and the database.

#### Redis for caching with Docker

To optimize performance and reduce database load, Redis was implemented as a caching layer using Docker. Redis was chosen for its speed, simplicity, and support for advanced caching strategies.

- Containerization: Redis was containerized using Docker, ensuring a consistent and isolated environment for caching.

- Cache Repository: Redis was used to store frequently accessed data, such as user sessions or API responses, reducing the need for repeated database queries.

- Cache Invalidation: A cache invalidation strategy was implemented to ensure data consistency, removing outdated or irrelevant data from the cache when necessary.

#### Cloudflare R2 for attachment storage

For storing attachments, Cloudflare R2 was integrated into the application. R2 was chosen for its cost-effectiveness, scalability, and compatibility with modern cloud storage needs.

- File Storage: Cloudflare R2 was used to store and retrieve attachments, providing a reliable and scalable solution for handling large files.

- Integration: The application communicated with R2 via its API, enabling seamless upload, download, and management of attachments.

- Security: Access controls and encryption were implemented to ensure the security and privacy of stored files.

### Tests

Vitest was used for handling with unit tests for use cases and e2e tests for controllers.

---

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# start docker
$ npm run start:docker

# execute migrations on db
$ npx prisma migrate deploy
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
