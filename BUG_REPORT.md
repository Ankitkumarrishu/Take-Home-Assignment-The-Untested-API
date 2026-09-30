# Bug Report

## Bug 1 — Pagination skips the first page

### Location

- `src/routes/tasks.js`
- `src/services/taskService.js`

### Expected behavior

When a client requests:

`GET /tasks?page=1&limit=2`

the API should return the first two tasks.

For example:

- Task 1
- Task 2

### Actual behavior

The API returned only the third task:

- Task 3

### How the bug was discovered

I added an integration test using Supertest with three tasks and the request:

`GET /tasks?page=1&limit=2`

The test expected the first two tasks, but the API returned only the third task.

### Root cause

The API accepts page numbers starting from 1, but the pagination calculation originally used:

```js
const offset = page * limit;