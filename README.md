<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://png.pngtree.com/template/20191125/ourmid/pngtree-book-store-logo-template-sale-learning-logo-designs-vector-image_335046.jpg" alt="Project logo"></a>
</p>

<h3 align="center">Online Book Store</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/mamalli11/book-store.svg)](https://github.com/mamalli11/book-store/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/mamalli11/book-store.svg)](https://github.com/mamalli11/book-store/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">An online book store application built with Nest.js, featuring CRUD operations for books, authors, publishers, translators, and categories. It also supports features like discount codes, shopping cart, and Zarinpal payment gateway.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This project is an online bookstore application built using Nest.js, and PostgreSQL for database management. It provides an API for managing books, authors, publishers, translators, and categories. Additionally, users can submit reviews for books, apply discount codes, and complete purchases via the Zarinpal payment gateway. The app is integrated with AWS for image management and uses Swagger for API documentation.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

You'll need the following software installed:

- Node.js
- PostgreSQL
- Zarinpal Payment Gateway credentials
- AWS credentials for image management

### Installing

Clone the repository:

```
git clone https://github.com/mamalli11/book-store.git
cd book-store
```

Install dependencies:

```
npm install
```

Rename the file from `.env.local` to `.env` and fill in the requested values.

Start the development server:

```
npm run start:dev
```


## 🎈 Usage <a name="usage"></a>

Once the server is running, you can access the API at `http://localhost:3000`. Use Swagger for API documentation by visiting `http://localhost:3000/swagger`.

## 🚀 Deployment <a name = "deployment"></a>

To deploy the application:

1. Set up a PostgreSQL instance on your server or cloud service.
2. Set environment variables for your production environment.
3. Use `pm2` or any process manager to keep the server running.
4. Run `npm run build` to create a production build.
5. Start the application with `npm run start:prod`.

## ⛏️ Built Using <a name = "built_using"></a>

- [NestJS](http://nestjs.com/) - Framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Swagger](https://swagger.io/) - API Documentation
- [AWS S3](https://aws.amazon.com/s3/) - Image Storage
- [Zarinpal](https://www.zarinpal.com) - Payment Gateway

## ✍️ Authors <a name = "authors"></a>

- [@mamalli11](https://github.com/mamalli11) - Developer

See the list of [contributors](https://github.com/mamalli11/book-store/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Thanks to the open-source community for the inspiration and resources.
