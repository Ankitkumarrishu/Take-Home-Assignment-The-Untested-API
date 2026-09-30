const taskService = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('create', () => {
    test('should create a task with default values', () => {
      const task = taskService.create({
        title: 'Write tests',
      });

      expect(task).toMatchObject({
        title: 'Write tests',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
        completedAt: null,
      });

      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
    });

    test('should create a task with provided values', () => {
      const task = taskService.create({
        title: 'Learn Jest',
        description: 'Write unit tests',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2030-01-01T00:00:00.000Z',
      });

      expect(task.title).toBe('Learn Jest');
      expect(task.description).toBe('Write unit tests');
      expect(task.status).toBe('in_progress');
      expect(task.priority).toBe('high');
      expect(task.dueDate).toBe('2030-01-01T00:00:00.000Z');
    });
  });

  describe('getAll', () => {
    test('should return all tasks', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });

      const tasks = taskService.getAll();

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
    });

    test('should return an empty array when there are no tasks', () => {
      expect(taskService.getAll()).toEqual([]);
    });
  });

  describe('findById', () => {
    test('should find a task by ID', () => {
      const created = taskService.create({
        title: 'Find me',
      });

      const found = taskService.findById(created.id);

      expect(found).toEqual(created);
    });

    test('should return undefined for an unknown ID', () => {
      expect(taskService.findById('does-not-exist')).toBeUndefined();
    });
  });

  describe('getByStatus', () => {
    test('should return tasks matching the requested status', () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const result = taskService.getByStatus('todo');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Todo task');
    });
  });

  describe('getPaginated', () => {
    test('should return the first page when page is 1', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      taskService.create({ title: 'Task 3' });

      const result = taskService.getPaginated(1, 2);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Task 1');
      expect(result[1].title).toBe('Task 2');
    });

    test('should return the second page when page is 2', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      taskService.create({ title: 'Task 3' });

      const result = taskService.getPaginated(2, 2);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task 3');
    });
  });

  describe('update', () => {
    test('should update an existing task', () => {
      const created = taskService.create({
        title: 'Old title',
      });

      const updated = taskService.update(created.id, {
        title: 'New title',
      });

      expect(updated.title).toBe('New title');
      expect(updated.id).toBe(created.id);
    });

    test('should return null for an unknown ID', () => {
      const result = taskService.update('does-not-exist', {
        title: 'New title',
      });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    test('should remove an existing task', () => {
      const created = taskService.create({
        title: 'Delete me',
      });

      expect(taskService.remove(created.id)).toBe(true);
      expect(taskService.findById(created.id)).toBeUndefined();
    });

    test('should return false for an unknown ID', () => {
      expect(taskService.remove('does-not-exist')).toBe(false);
    });
  });

  describe('completeTask', () => {
    test('should mark a task as completed', () => {
      const created = taskService.create({
        title: 'Complete me',
        priority: 'high',
      });

      const completed = taskService.completeTask(created.id);

      expect(completed.status).toBe('done');
      expect(completed.completedAt).toBeDefined();
      expect(completed.priority).toBe('medium');
    });

    test('should return null for an unknown ID', () => {
      expect(taskService.completeTask('does-not-exist')).toBeNull();
    });
  });

  describe('getStats', () => {
    test('should count tasks by status', () => {
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

      const stats = taskService.getStats();

      expect(stats.todo).toBe(1);
      expect(stats.in_progress).toBe(1);
      expect(stats.done).toBe(1);
      expect(stats.overdue).toBe(0);
    });
  });
});