import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';

@Injectable()
/**
 * Service that manage the database actions to get, create, update or delete a task
 */
export class TasksService {
  // It's private for manage all the actions in this service
  private tasks: Task[] = [];

  /**
   *  Method to get all the tasks from the database
   **  Output: Tasks[], an array of tasks
   */
  getAllTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Method to create a task in database
   * @input {
   **    id : string,
   **    title: string,
   **    description: string,
   **    status: OPEN or IN_PROGRESS or DONE
}
   * @returns The same Task created
   */
  createTask(task: Task): Task {
    this.tasks.push(task);
    return task;
  }

  /**
   * Method to initialize the task variable based on the information of the post http request
   * @returns Task in the correct format
   */
  getTaskParametersFromRequest(): Task {
    const task: Task = {
      id: uuid(),
      title: '',
      description: '',
      status: TaskStatus.DONE,
    };
    return task;
  }
}
