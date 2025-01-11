# Contributing to Book Store

Thank you for considering contributing to our project! Your contributions are essential for improving the Book Store application and helping the community. This guide outlines the process for contributing effectively.

---

## About the Project

The Book Store project is a **back-end application for an online bookstore**. It is built using modern technologies to ensure scalability, reliability, and ease of use.

### Key Technologies
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Documentation**: Swagger
- **Storage**: AWS S3

### Features
- Multilingual support.
- Comprehensive API documentation.
- Advanced search functionality.
- Scalable and well-structured codebase.

---

## How to Contribute

### Reporting Bugs

If you discover a bug, please help us improve by reporting it:

1. **Check for duplicates**: Before creating a new issue, search the [issues section](https://github.com/mamalli11/book-store/issues) to see if the bug has already been reported.
2. **Open an issue**: If the bug is new, create an issue with the following details:
   - A descriptive title.
   - Steps to reproduce the bug.
   - Expected and actual behavior.
   - Relevant logs, screenshots, or error messages.
   - Environment details (e.g., OS, Node.js version, dependencies).

### Suggesting Features or Enhancements

Have a great idea? We would love to hear it! To suggest a feature:

1. **Open a feature request**: Use the [issues section](https://github.com/mamalli11/book-store/issues) and select the appropriate template for feature suggestions.
2. **Provide details**:
   - What problem does this feature solve?
   - How will it improve the project?
   - Any potential implementation suggestions.

### Contributing Code

We welcome contributions to the codebase via pull requests. Please follow these steps:

1. **Fork the repository**:
   - Click the "Fork" button at the top-right corner of the repository page.
2. **Clone your fork**:
   ```sh
   git clone https://github.com/mamalli11/book-store.git
   ```
3. **Set up your environment**:
   - Install dependencies with `npm install`.
4. **Create a new branch**:
   ```sh
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes**:
   - Ensure your changes follow the [Code Style](#code-style) guidelines.
   - Write tests for new functionality.
6. **Commit your changes**:
   ```sh
   git commit -m "Add a descriptive commit message"
   ```
7. **Push to your fork**:
   ```sh
   git push origin feature/your-feature-name
   ```
8. **Open a pull request (PR)**:
   - Go to the original repository.
   - Click "New pull request" and select your branch.
   - Provide a clear and concise description of your changes, linking to relevant issues if applicable.

---

## Code Style

To maintain a consistent codebase, follow these guidelines:

- Use [Prettier](https://prettier.io/) for formatting.
- Follow the [JavaScript Standard Style](https://standardjs.com/) (or TypeScript equivalent, if applicable).
- Write clear, concise, and self-documenting code.
- Include comments for complex logic.
- Avoid introducing unnecessary dependencies.

### Running Lint and Tests

Before submitting a pull request, ensure your code passes all linting and testing checks:

- Run the linter:
  ```sh
  npm run lint
  ```
- Run the tests:
  ```sh
  npm test
  ```

---

## Commit Guidelines

Use meaningful and conventional commit messages:

- **Feature addition**: `feat: add user authentication`
- **Bug fix**: `fix: resolve checkout page crash`
- **Documentation**: `docs: update README with installation instructions`
- **Refactor**: `refactor: optimize search functionality`

For detailed guidelines, refer to the [Conventional Commits](https://www.conventionalcommits.org/) specification.

---

## Community Guidelines

To ensure a welcoming and productive environment:

- Be respectful and constructive in discussions.
- Avoid personal attacks or derogatory language.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) (if available).

---

## Contact

For any questions or concerns, feel free to open an issue or contact the maintainers via email at [iman7260@gmail.com](mailto:iman7260@gmail.com).

We look forward to your contributions! Thank you for making Book Store better.
