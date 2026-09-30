# Submission Notes

## What I Would Test Next

If I had additional time, I would expand the test suite in the following areas:

1. **Pagination edge cases**
   - Page number of 0
   - Negative page numbers
   - Invalid page values
   - Limit of 0
   - Negative limits
   - Limits larger than the number of available tasks

2. **Validation**
   - Invalid status values
   - Invalid priority values
   - Invalid due dates
   - Non-string values for title and assignee
   - Missing request bodies

3. **Task lifecycle**
   - Completing an already completed task
   - Updating a completed task
   - Assigning and reassigning tasks
   - Removing a task and verifying it cannot be retrieved afterward

4. **Statistics**
   - Overdue tasks
   - Future due dates
   - Completed overdue tasks
   - Empty task collections

5. **Error handling**
   - Unexpected service errors
   - Malformed JSON requests
   - Internal server errors

6. **Production-level testing**
   - Concurrent requests
   - Performance under a larger number of tasks
   - Authentication and authorization
   - Persistence and database failures

---

## What Surprised Me

The main surprise was finding an off-by-one pagination bug in an otherwise simple implementation.

The API accepted page numbers starting from 1, but the service calculated the offset using:

```js
const offset = page * limit;