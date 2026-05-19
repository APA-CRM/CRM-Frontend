import {Component, Input} from '@angular/core';
import {TagModule} from 'primeng/tag';
import {ColorService} from '../../../../../core/services/color.service';
import {TaskPriorityModel} from '../../../../../models/tasks/priorities/task-priority-model';
import {TaskStatusModel} from '../../../../../models/tasks/statuses/task-status-model';

@Component({
  selector: 'app-priority-status-tag',
  imports: [TagModule],
  templateUrl: './priority-status-tag.component.html',
  styleUrl: './priority-status-tag.component.css'
})
export class PriorityStatusTagComponent {

  @Input({required: true}) value!: TaskPriorityModel | TaskStatusModel;

  constructor(private readonly colorService: ColorService) {
  }

  getContrastColor(color: string): string {
    return this.colorService.getContrastTextColor(color);
  }

}
