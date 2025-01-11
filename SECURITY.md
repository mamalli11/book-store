# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please follow these steps:

1. **Do not** open an issue on GitHub.
2. Send an email to [iman7260@gmail.com](mailto:iman7260@gmail.com) with the details of the vulnerability.
3. Include the following information:
   - A description of the vulnerability.
   - Steps to reproduce the vulnerability.
   - Any potential impact or exploit scenarios.
   - Your contact information.

We will respond to your report within 72 hours with an acknowledgment and will work with you to understand and resolve the issue as quickly as possible.

## Security Best Practices

To ensure the security of your deployment, please follow these best practices:

- **Environment Variables**: Keep your `.env` file secure and do not expose it in your version control system.
- **Dependencies**: Regularly update your dependencies to the latest versions to ensure you have the latest security patches.
- **HTTPS**: Always use HTTPS to encrypt data in transit.
- **Authentication**: Use strong authentication mechanisms and regularly rotate credentials.
- **Authorization**: Implement proper authorization checks to ensure users can only access resources they are permitted to.
- **Validation**: Validate all user inputs to prevent common vulnerabilities such as SQL injection and XSS.
- **Monitoring**: Monitor your application for suspicious activity and set up alerts for potential security incidents.

## Contact

For any security-related inquiries, please contact [iman7260@gmail.com](mailto:iman7260@gmail.com).

Thank you for helping to keep this project secure.
