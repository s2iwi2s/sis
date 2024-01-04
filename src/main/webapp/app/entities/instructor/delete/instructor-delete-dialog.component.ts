import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInstructor } from '../instructor.model';
import { InstructorService } from '../service/instructor.service';

@Component({
  standalone: true,
  templateUrl: './instructor-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InstructorDeleteDialogComponent {
  instructor?: IInstructor;

  constructor(
    protected instructorService: InstructorService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.instructorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
