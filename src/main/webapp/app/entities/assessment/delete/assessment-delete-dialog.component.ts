import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAssessment } from '../assessment.model';
import { AssessmentService } from '../service/assessment.service';

@Component({
  standalone: true,
  templateUrl: './assessment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AssessmentDeleteDialogComponent {
  assessment?: IAssessment;

  constructor(
    protected assessmentService: AssessmentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.assessmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
