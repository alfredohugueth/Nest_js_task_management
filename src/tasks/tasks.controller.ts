import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  /**
   * Method to call tasks from the database based on search parameters or all tasks
   * @Input Filter parameters like status or search
   * @returns Task[], an array of Tasks
   */
  @Get()
  getTask(@Query() filterDTO: GetTasksFilterDTO): Task[] {
    // If we have any filter defined, call the method to get tasks with filters
    // Otherwise, just get all tasks

    if (Object.keys(filterDTO).length)
      return this.taskService.getTasksWithFilters(filterDTO);

    return this.taskService.getAllTasks();
  }

  /**
   * Controller for create a task in the database
   * @Input The title and the description of the task
   * @returns The task just created
   */
  @Post()
  createTask(@Body() body: CreateTaskDTO): Task {
    const task: Task = this.taskService.getTaskParametersFromRequest(body);
    return this.taskService.createTask(task);
  }

  /**
   * Controller for get an specific task based on this id
   * @param id  The identifier of the task
   * @returns  The task that you are looking for, if not found, returns an empty array
   */
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  /**
   * Delete a task based on his ID
   * @param id The task Identifier
   * @returns If the deletion was succesfull, or if there is not element with that ID
   */
  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): string {
    return this.taskService.deleteTaskById(id);
  }

  /**
   * Update the status of a task given his id
   * @param id Id of the task to be updated
   * @param status New Status of the task
   * @returns The updated task, or a message of not found
   */
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ) {
    const body: UpdateTaskDTO = new UpdateTaskDTO(id, status);
    return this.taskService.updateTaskStatus(body);
  }
}
