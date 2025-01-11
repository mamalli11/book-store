---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

# Bug Report

## **Description**
Provide a concise and clear description of the bug.  
**Example**: "Search results are not displayed correctly when using Persian keywords."

---

## **Steps to Reproduce**
Steps to reproduce the issue:  
1. Send a request to the `/api/search` endpoint.  
2. Set the `keyword` parameter to a Persian word (e.g., "کتاب").  
3. Check the response.

---

## **Expected Behavior**
Describe what you expected to happen.  
**Example**: "Relevant results for the Persian keyword should be displayed."

---

## **Actual Behavior**
Describe what actually happened instead.  
**Example**: "The response is empty, or a 500 Internal Server Error occurs."

---

## **Environment Details**
Provide details about the environment where the bug occurred:  
- **Operating System**: (e.g., Ubuntu 20.04)  
- **Node.js Version**: (e.g., 16.14.0)  
- **PostgreSQL Version**: (e.g., 13.3)  
- **Project Version**: (latest commit hash or release tag)

---

## **Relevant Logs or Screenshots**
Include any relevant logs or screenshots.  
```json
{
  "error": "Internal Server Error",
  "message": "Cannot process the search query"
}
