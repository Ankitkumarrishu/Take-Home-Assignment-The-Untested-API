const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('POST /tasks', () => {
    test('should create a task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Write tests',
          description: 'Test the API',
          priority: 'high',
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'Write tests',
        description: 'Test the API',
        status: 'todo',
        priority: 'high',
      });

      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    test('should reject a task without a title', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          priority: 'high',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'title is required and must be a non-empty string'
      );
    });

    test('should reject an invalid priority', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Test task',
          priority: 'urgent',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    test('should return all tasks', async () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });

      const response = await request(app)
        .get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test('should filter tasks by status', async () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const response = await request(app)
        .get('/tasks')
        .query({ status: 'todo' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('todo');
    });
  });

  describe('GET /tasks pagination', () => {
    test('page 1 should return the first page of tasks', async () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      taskService.create({ title: 'Task 3' });

      const response = await request(app)
        .get('/tasks')
        .query({
          page: 1,
          limit: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Task 1');
      expect(response.body[1].title).toBe('Task 2');
    });
  });

  describe('PUT /tasks/:id', () => {
    test('should update an existing task', async () => {
      const task = taskService.create({
        title: 'Old title',
      });

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          title: 'New title',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('New title');
      expect(response.body.id).toBe(task.id);
    });

    test('should return 404 for a nonexistent task', async () => {
      const response = await request(app)
        .put('/tasks/does-not-exist')
        .send({
          title: 'New title',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('should delete an existing task', async () => {
      const task = taskService.create({
        title: 'Delete me',
      });

      const response = await request(app)
        .delete(`/tasks/${task.id}`);

      expect(response.status).toBe(204);
      expect(taskService.findById(task.id)).toBeUndefined();
    });

    test('should return 404 for a nonexistent task', async () => {
      const response = await request(app)
        .delete('/tasks/does-not-exist');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    test('should complete an existing task', async () => {
      const task = taskService.create({
        title: 'Complete me',
        priority: 'high',
      });

      const response = await request(app)
        .patch(`/tasks/${task.id}/complete`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('done');
      expect(response.body.completedAt).toBeDefined();
      expect(response.body.priority).toBe('medium');
    });

    test('should return 404 for a nonexistent task', async () => {
      const response = await request(app)
        .patch('/tasks/does-not-exist/complete');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/assign', () => {
    test('should assign a task to a user', async () => {
      const task = taskService.create({
        title: 'Assign me',
      });

      const response = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({
          assignee: 'Ankit',
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(task.id);
      expect(response.body.assignee).toBe('Ankit');
    });

    test('should return 404 when assigning a nonexistent task', async () => {
      const response = await request(app)
        .patch('/tasks/does-not-exist/assign')
        .send({
          assignee: 'Ankit',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('should reject an empty assignee', async () => {
      const task = taskService.create({
        title: 'Assign me',
      });

      const response = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({
          assignee: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'assignee is required and must be a non-empty string'
      );
    });

    test('should reject a whitespace-only assignee', async () => {
      const task = taskService.create({
        title: 'Assign me',
      });

      const response = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({
          assignee: '   ',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'assignee is required and must be a non-empty string'
      );
    });

    test('should allow reassignment of an already assigned task', async () => {
      const task = taskService.create({
        title: 'Reassign me',
      });

      await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({
          assignee: 'Ravi',
        });

      const response = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({
          assignee: 'Ankit',
        });

      expect(response.status).toBe(200);
      expect(response.body.assignee).toBe('Ankit');
    });
  });

  describe('GET /tasks/stats', () => {
    test('should return task statistics', async () => {
      taskService.create({
        title: 'Todo',
        status: 'todo',
      });

      taskService.create({
        title: 'In progress',
        status: 'in_progress',
      });

      taskService.create({
        title: 'Done',
        status: 'done',
      });

      const response = await request(app)
        .get('/tasks/stats');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        todo: 1,
        in_progress: 1,
        done: 1,
        overdue: 0,
      });
    });
  });
});