# Q&A Forum

This project is a continuation from the [domain part of the forum project](https://github.com/arakakimath/forum-domain-clean-arch). This project started with the base structure from [NestJS](https://docs.nestjs.com/). 

In this project, the main initial objective was to implement all infrastructure layers, from Gateways, Controllers and Presenters (Interface Adapters), to communicate with DBs, Devices, Front-End, UI and External Interfaces (Frameworks & Drivers). Then, the domain part was added and integration was done to have all the project working as one from the most external layers to the most internal ones.

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

At first, an initial template from NestJS was used to start developing the forum. As NestJS uses modules, several modules were created to make them more uniques giving organization to the app.

### Validation

Zod package was used to validate schemas of the request body (through Nest pipes) and to validate environmental variables.

### Normalization

ESLint package was used to create a pattern for maintaining the code clean and well-written.

### Authentication

Once controllers were starting to rise up in the application, it became necessary to think about related strategies. The chosen one was using algorithm RS256, in which the system has one private key and at least one public key. The private key is only acessible in the main domain for security reasons and the public key is generated from that. That one's objectives are to create a token to authenticate users and to create public keys, while public key's objective is just validate tokens. 

A controller was used to authenticate users and return a token. By default, all controller routes needs authentication.

### Controllers

The controllers are responsible to intermediate requests and responses between external applications, as DBs or Web, with more internal applications in the domain part, as use cases. 

At first, controllers were built with an internal algorithm that simulated what an internal layer on the domain part would do, once the beginning of the project was focused on the infrastructure part (external layers on the Clean Architecture). Then, it was integrated with domain part to actually communicate external and internal layers of the project.

### Repositories

At the domain part, it was established interfaces (that later became abstract classes, once Nest converts TypeScript to JavaScript for deployment) that contained the methods (and responses) each repository had to have. Still in domain, it was implemented in-memory repositories to execute use cases' unit tests. At infra, repositories were implemented with prisma to intermediate communication between database and use cases.

### Mappers

As entities and tables on database do not necessarily walk together, problems start to arise when trying to integrate these parts. It is not as easy as it seems to be to save a domain entity in database, as their properties do not directly match, and vice-versa. Then, it is necessary to have mappers, which their main function is to convert one kind of data to another. 

### Gateways

Besides repositories, there were established three interfaces of gateways at domain: one to generate token from the private key and a payload, one to hash user's password and other to compare the user's password with the hashed one at database. In domain, these gateways were fake implemented just to simulate their real functions and to execute unit tests. At infra, BCryptJS was used to the methods of hash and compare, and JwtService, from Nest, was used to generate tokens.

### Presenters

One of the challenges of providing data as a response to HTTP requests is dealing with overfetching and underfetching, which refer to sending more or less data than necessary, respectively. When an HTTP request is made and the requester expects valid data, this data is not necessarily stored in a single table or entity, nor does it always include all the data stored in an entity, for example.

To handle this, presenters were implemented in the infrastructure layer to determine which data is truly necessary for the requester. Presenters optimize the application's performance by ensuring that the requester receives only the required data with a minimal number of HTTP requests while reducing unnecessary data transfer. 




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
