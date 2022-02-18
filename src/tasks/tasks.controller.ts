import { Controller, Get, Post } from '@nestjs/common';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  /**
   * Method to call all tasks from the database using the service.
   ** Output: Task[], an array of Tasks
   */
  @Get()
  getAllTasks(): Task[] {
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(): Task {
    const task: Task = this.taskService.getTaskParametersFromRequest();
    return this.taskService.createTask(task);
  }
}
