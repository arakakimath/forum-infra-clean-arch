# 📦 Q&A Forum API  

> A RESTful API for forum managing, allowing users to create, update, delete and comment on questions or theirs answers.

## 📌 Table of Contents  
- [📖 About](#about)  
- [🚀 Technologies](#technologies)  
- [⚙️ Requirements](#requirements)  
- [📦 Installation](#installation)  
- [⚙️ Configuration](#configuration)  
- [▶️ Running the Project](#running-the-project)  
- [📌 API Routes](#api-routes)  
- [✅ Tests](#tests)  
- [🤝 Contribution](#contribution)  
- [📝 License](#license)  
- [📩 Contact](#contact)  

---  

## 📖 About <a id="about"></a>  
**Q&A Forum API** is a backend service that powers a **question-and-answer platform**, allowing users to post questions, provide answers, and engage through comments. The API ensures **structured discussions** with support for file attachments and authentication.  

Built with a **scalable and modular architecture**, it follows **SOLID principles, Clean Architecture, and Domain-Driven Design (DDD)** to maintain separation of concerns and extensibility.  

Key Features:  
- **User Authentication:** Secure sign-up, login, and session management using JWT (RS256 algorithm).  
- **Question Management:** Users can create, edit, and delete questions.  
- **Answer & Comment System:** Structured responses with discussion threading.  
- **File Attachments:** Support for image and document uploads.  
- **Scalable Architecture:** Repository pattern, use cases, and separation of domain and infrastructure layers.  

---

## 🚀 Technologies <a id="technologies"></a>  
The **Q&A Forum API** is built with a **scalable and maintainable stack**, following **Clean Architecture and Domain-Driven Design (DDD)** principles:  

- **🟢 NestJS (Express)** – Modular and structured Node.js framework.  
- **📌 TypeScript** – Statically typed JavaScript for better maintainability.  
- **🐘 PostgreSQL + Prisma ORM** – SQL database with a type-safe ORM for data persistence.  
- **🗄️ Redis** – In-memory database for caching and performance optimization.  
- **🐳 Docker** – Containerized infrastructure for consistent deployment.  
- **📦 Clean Architecture** – Separation of concerns for a scalable and modular codebase.  
- **🔐 JWT Authentication (RS256)** – Secure user authentication with private/public key encryption.  
- **🛡️ Zod** – Schema-based validation for environment variables, request body, query, and params.  
- **🧪 Vitest + Supertest** – Unit and integration testing for API reliability.  
- **📁 Cloudflare R2 (or S3)** – Cloud-based storage for file attachments.  
- **📝 ESLint** – Code formatting and linting for maintaining code consistency.
- **🔑 bcryptjs** – Password hashing and comparison for authentication. 

---  

## ⚙️ Requirements <a id="requirements"></a>  
To run this project, you need:  
- 🐳 **[Docker](https://www.docker.com/)** – Runs the entire application (PostgreSQL, Redis, and the built image).  
- 🪣 **Cloudflare R2 or Amazon S3** – Object storage for handling file uploads.

---  

## 📦 Installation <a id="installation"></a>  
Clone the repository:  

```bash
git clone https://github.com/arakakimath/forum-infra-clean-arch
```

Then, create a bucket with **Amazon Web Services (AWS) S3** or **Cloudflare R2**. **Skipping this step will break attachment-related controllers, but other app functions should work properly.**

Additionally, you need to generate private and public keys following the RS256 algorithm for JWT authentication. These keys should then be added to the `.env` file:

```bash
JWT_PRIVATE_KEY="your_private_key"
JWT_PUBLIC_KEY="your_public_key"
```

---  

## ⚙️ Configuration <a id="configuration"></a>  
Create a `.env` file based on the example:  

```bash
cp .env.example .env
```  

Edit `.env` with the correct database credentials:  

```
- PostgreSQL:
DATABASE_URL="postgresql://postgres:docker@localhost:5432/nest-clean?schema=public" 
# If running with docker: Set in docker-compose

- RS256 algorithm:
JWT_PRIVATE_KEY="your_private_key"
JWT_PUBLIC_KEY="your_public_key"

- Cloudflare R2 or AWS S3:
CLOUDFLARE_ACCOUNT_ID="cf_acc_id"
AWS_BUCKET_NAME="bucket_name"
AWS_ACCESS_KEY_ID="aws_access_key_id"
AWS_SECRET_ACCESS_KEY="aws_secret_access_key"

- Redis:
REDIS_HOST="127.0.0.1" # Optional. If running with docker: Set in docker-compose according to service name
REDIS_PORT="6379" # Optional
REDIS_DB="0" # Optional
```  

---  

## ▶️ Running the Project <a id="running-the-project"></a>  
Run the project with Docker Compose:  

```bash
docker-compose up -d
```  

Then, after Docker Compose finishes setting up containers, application will listen to http://localhost:3333

---  

## 📌 API Routes <a id="api-routes"></a>  

### 🔐 Authentication  
#### `POST /sessions`  
- **Description:** Authenticate a user and return an access token.  
- **Body:**  
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```  
- **Response:**  
  ```json
  {
    "access_token": "someToken"
  }
  ```  

### 👤 User Management  
#### `POST /accounts`  
- **Description:** Create a new user account.  
- **Body:**  
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```  
- **Response:**  
  - **201:** Account created successfully.  
  - **400:** Bad request - Invalid input data.  
  - **409:** Conflict - User already exists.  

### ❓ Questions  
#### `POST /questions`  
- **Description:** Create a new question.  
- **Response:**  
  - **201:** Question created successfully.  
  - **400:** Bad request - Invalid input data.  

#### `GET /questions`  
- **Description:** Fetch recent questions with pagination.  
- **Parameters:**  
  - `page` (optional): Page number for pagination.  
- **Response:**  
  - **200:** Successfully fetched questions.
  - **400:** Bad request - Invalid input data.  

#### `GET /questions/{slug}`  
- **Description:** Get a question by its slug.  
- **Parameters:**  
  - `slug` (required): The slug of the question.  
- **Response:** 
  - **200:** Successfully get question details.
  - **400:** Bad request - Invalid slug or data.  

#### `PUT /questions/{id}`  
- **Description:** Edit an existing question.  
- **Parameters:**  
  - `id` (required): The ID of the question to edit.  
- **Body:**  
  ```json
  {
    "title": "Updated title",
    "content": "Updated content",
    "attachments": []
  }
  ```  
- **Response:**  
  - **204:** Question edited successfully.  
  - **400:** Bad request - Invalid input data.  

#### `DELETE /questions/{id}`  
- **Description:** Delete a question by its ID.  
- **Parameters:**  
  - `id` (required): The ID of the question to delete.  
- **Response:**  
  - **204:** Question deleted successfully.  
  - **400:** Bad request - Invalid input data or operation.  

### 💬 Answers  
#### `POST /questions/{questionId}/answers`  
- **Description:** Answer a specific question.  
- **Parameters:**  
  - `questionId` (required): The ID of the question to answer.  
- **Body:**  
  ```json
  {
    "content": "This is how you use the API.",
    "attachments": []
  }
  ```  
- **Response:**  
  - **201:** Answer successfully created.  
  - **400:** Bad request - Invalid data or inputs.  

#### `GET /questions/{questionId}/answers`  
- **Description:** Fetch answers for a specific question with pagination.  
- **Parameters:**  
  - `questionId` (required): The ID of the question.  
  - `page` (optional): Page number for pagination.  
- **Response:**  
  - **200:** Successfully fetched the answers.
  - **400:** Bad request - Invalid input data.  

#### `PUT /answers/{id}`  
- **Description:** Edit an existing answer.  
- **Parameters:**  
  - `id` (required): The ID of the answer to edit.  
- **Body:**  
  ```json
  {
    "content": "Updated answer content.",
    "attachments": []
  }
  ```  
- **Response:**  
  - **204:** Answer edited successfully.  
  - **400:** Bad request - Invalid input data.  

#### `DELETE /answers/{id}`  
- **Description:** Delete an answer by its ID.  
- **Parameters:**  
  - `id` (required): The ID of the answer to delete.  
- **Response:**  
  - **204:** Answer deleted successfully.  
  - **400:** Bad request - Invalid input or the answer does not exist.  

#### `PATCH /answers/{answerId}/choose-as-best`  
- **Description:** Choose a best answer for a question.  
- **Parameters:**  
  - `answerId` (required): The ID of the answer to mark as best.  
- **Response:**  
  - **204:** The answer has been successfully chosen as the best answer.  
  - **400:** Bad request - The action could not be performed.  

### 💬 Comments  
#### `POST /questions/{questionId}/comments`  
- **Description:** Post a comment on a question.  
- **Parameters:**  
  - `questionId` (required): The ID of the question to comment on.  
- **Response:**  
  - **201:** The comment has been successfully created.  
  - **400:** Bad request - The action could not be performed.  

#### `GET /questions/{questionId}/comments`  
- **Description:** Fetch comments for a specific question with pagination.  
- **Parameters:**  
  - `questionId` (required): The ID of the question.  
  - `page` (optional): Page number for pagination.  
- **Response:**  
  - **200:** Successfully fetched the question comments.  
  - **400:** Bad request - Invalid input data.  

#### `DELETE /questions/comments/{id}`  
- **Description:** Delete a comment on a question by its ID.  
- **Parameters:**  
  - `id` (required): The ID of the comment to delete.  
- **Response:**  
  - **204:** Comment deleted successfully.  
  - **400:** Bad request - Invalid input data or operation.  

#### `POST /answers/{answerId}/comments`  
- **Description:** Post a comment on an answer.  
- **Parameters:**  
  - `answerId` (required): The ID of the answer to comment on.  
- **Response:**  
  - **201:** The comment has been successfully created.  
  - **400:** Bad request - The action could not be performed.  

#### `GET /answers/{answerId}/comments`  
- **Description:** Fetch comments for a specific answer with pagination.  
- **Parameters:**  
  - `answerId` (required): The ID of the answer.  
  - `page` (optional): Page number for pagination.  
- **Response:**  
  - **200:** Successfully fetched the answer comments. 
  - **400:** Bad request - Invalid input data.  

#### `DELETE /answers/comments/{id}`  
- **Description:** Delete a comment on an answer by its ID.  
- **Parameters:**  
  - `id` (required): The ID of the comment to delete.  
- **Response:**  
  - **204:** Comment deleted successfully.  
  - **400:** Bad request - Invalid input or the comment does not exist.  

### 📎 Attachments  
#### `POST /attachments`  
- **Description:** Upload and create an attachment (image or PDF).  
- **Response:**  
  - **200:** Successfully got the attachment.
  - **400:** Bad request - Invalid file type or file size.  

### 🔔 Notifications  
#### `PATCH /notifications/{notificationId}/read`  
- **Description:** Mark a notification as read.  
- **Parameters:**  
  - `notificationId` (required): The ID of the notification to mark as read.  
- **Response:**  
  - **204:** Successfully marked the notification as read.  
  - **400:** Bad request - Invalid notification ID or data.

---  

## ✅ Tests <a id="tests"></a>  
Run unit tests with:  

```bash
npm run test
```  

Run end-to-end (e2e) tests with:  

```bash
npm run test:e2e
```  

---  

## 🤝 Contribution <a id="contribution"></a>  
Want to contribute? Follow these steps:  

1. Fork the repository.  
2. Create a new branch: `git checkout -b feature-branch`.  
3. Make your changes and commit: `git commit -m "Added new feature"`.  
4. Push to your fork: `git push origin feature-branch`.  
5. Open a Pull Request.  

---  

## 📝 License <a id="license"></a>  
This project is under the **MIT License** – see the [LICENSE](https://opensource.org/license/MIT) file for details.  

---  

## 📩 Contact <a id="contact"></a>  
For support or inquiries, contact:  

- **Email:** arakakimath@gmail.com  
- **LinkedIn:** [Matheus Arakaki](https://linkedin.com/in/arakakimath)  
- **GitHub:** [@arakakimath](https://github.com/arakakimath)  
