/* eslint-disable prettier/prettier */
import { TaskStatus } from '../tasks.model';

export class GetTasksFilterDTO {
  status?: TaskStatus;
  search?: string;
}
