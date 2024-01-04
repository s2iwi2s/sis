import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';

@Component({
  standalone: true,
  templateUrl: './student-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StudentDeleteDialogComponent {
  student?: IStudent;

  constructor(
    protected studentService: StudentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
