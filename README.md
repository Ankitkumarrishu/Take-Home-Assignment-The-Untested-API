# Take-Home Assignment — The Untested API

A Node.js/Express task management API with automated unit and integration tests using Jest and Supertest.

## Overview

This project focuses on testing and improving an existing Task API.

As part of the assignment, I:

* Added unit tests for the task service.
* Added integration tests for the API routes.
* Implemented the `PATCH /tasks/:id/assign` endpoint.
* Added input validation for task assignment.
* Identified and fixed a pagination bug.
* Added regression tests for the pagination issue.
* Added a bug report and submission notes.
* Achieved more than 80% test coverage.

## Tech Stack

* Node.js
* Express.js
* Jest
* Supertest
* UUID

## Project Structure

```text
task-api/
├── src/
│   ├── app.js
│   ├── routes/
│   │   └── tasks.js
│   ├── services/
│   │   └── taskService.js
│   └── utils/
│       └── validators.js
├── tests/
│   ├── taskService.test.js
│   └── tasks.test.js
├── BUG_REPORT.md
├── SUBMISSION_NOTES.md
├── jest.config.js
├── package.json
└── package-lock.json
```

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/Ankitkumarrishu/Take-Home-Assignment-The-Untested-API.git
cd Take-Home-Assignment-The-Untested-API
```

Install dependencies:

```bash
npm install
```

## Running the API

Start the server:

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Running Tests

Run the complete test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run coverage
```

### Test Results

The final test suite contains:

* **34 tests**
* **34 passing**
* **92.25% statement coverage**
* **93.33% function coverage**
* **91.54% line coverage**

## API Endpoints

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/tasks`                 | Get all tasks           |
| GET    | `/tasks?status=todo`     | Filter tasks by status  |
| GET    | `/tasks?page=1&limit=10` | Get paginated tasks     |
| GET    | `/tasks/stats`           | Get task statistics     |
| POST   | `/tasks`                 | Create a task           |
| PUT    | `/tasks/:id`             | Update a task           |
| DELETE | `/tasks/:id`             | Delete a task           |
| PATCH  | `/tasks/:id/complete`    | Complete a task         |
| PATCH  | `/tasks/:id/assign`      | Assign a task to a user |

## Task Assignment

The assignment endpoint accepts:

```http
PATCH /tasks/:id/assign
```

Request body:

```json
{
  "assignee": "Ankit"
}
```

The endpoint:

* Returns the updated task.
* Returns `404` if the task does not exist.
* Returns `400` if the assignee is empty or whitespace-only.
* Allows reassignment of an already assigned task.

## Bug Found and Fixed

### Pagination Off-by-One Bug

The original pagination implementation calculated the offset using:

```js
const offset = page * limit;
```

This caused:

```text
GET /tasks?page=1&limit=2
```

to skip the first two tasks and return the third task.

The implementation was corrected to:

```js
const offset = (page - 1) * limit;
```

Regression tests were added to verify both the first and second pages.

More details are available in [`BUG_REPORT.md`](./BUG_REPORT.md).

## Additional Notes

`SUBMISSION_NOTES.md` contains:

* Additional tests I would write with more time.
* Observations from reviewing the existing implementation.
* Questions I would clarify before deploying the API to production.

## Test Coverage

The project exceeds the assignment's 80% coverage requirement.

```text
Statements : 92.25%
Functions  : 93.33%
Lines      : 91.54%
Branches   : 77.90%
```

## Author

**Ankit Kumar**

GitHub: https://github.com/Ankitkumarrishu
