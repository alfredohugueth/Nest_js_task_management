import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status';
import { v4 as uuid } from 'uuid'; // Its going to be removed yarn remove uuid
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRespository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
/**
 * Service that manage the database actions to get, create, update or delete a task
 */
export class TasksService {
  constructor(
    @InjectRepository(TaskRespository) private tasksRepository: TaskRespository,
  ) {}
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
  createTask(body: CreateTaskDTO): Promise<Task> {
    return this.tasksRepository.createTask(body);
  }

  /**
   * Find the task from database with the id specified
   * @param id Identifier of the task
   * @returns The task that you are looking for, or an empty array
   */
  async getTaskById(id: string): Promise<Task> {
    // Try to get a task
    const found = await this.tasksRepository.findOne(id);

    // If not found, throw an error (404 not found)
    if (!found) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }

    // Otherwise, return the found task
    return found;
  }

  /**
   * Compares a temporal array of task with the original one to
   * determine if there was an deletion in the tasks
   * @param id The id of the task that wants to be deleted
   * @returns If there was an deletion of a task, or if not task with
   * that id was found
   */
  async deleteTaskById(id: string): Promise<string> {
    // Verify that the Task exist, If not, throw an error
    const found = await this.getTaskById(id);

    // Otherwise, delete the task and return a msg of confirmation
    this.tasks = this.tasks.filter((task) => task.id == found.id);

    return 'Deleted correcly';
  }

  /**
   * Method to updated the status of a task,
   * First find the task and then updated it.
   * @param body Has the id of the task and the new status
   * @returns A task updated, or not found if there are any task with that id
   */
  async updateTaskStatus(body: UpdateTaskDTO): Promise<Task> {
    const { id, status } = body;
    const taskToUpdate = await this.getTaskById(id);
    taskToUpdate.status = status;
    return taskToUpdate;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO) {
    const { status, search } = filterDTO;

    // Define a temporal array with all the tasks
    let tasks = this.getAllTasks();

    // Find if there is any task with the status parameter
    if (status) {
      tasks = tasks.filter((task) => task.status == status);
    }

    // Find if there are any task with the search parameters
    // In the title or description
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
      });
    }

    return tasks;
  }
}
