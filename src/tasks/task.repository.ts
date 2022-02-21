/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRespository extends Repository<Task> {
  /**
   * Method to initialize the task variable based on the information of the post http request
   * @Input Body request with the format of the task
   * @returns Task in the correct format
   */
  async createTask(body: CreateTaskDTO): Promise<Task> {
    // Get parameters from the body
    const { title, description } = body;

    // Create the instance of the object
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    //Save in database and return the object
    await this.save(task)
    return task;
  }
}
