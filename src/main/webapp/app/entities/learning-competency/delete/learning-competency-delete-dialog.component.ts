import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILearningCompetency } from '../learning-competency.model';
import { LearningCompetencyService } from '../service/learning-competency.service';

@Component({
  standalone: true,
  templateUrl: './learning-competency-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LearningCompetencyDeleteDialogComponent {
  learningCompetency?: ILearningCompetency;

  constructor(
    protected learningCompetencyService: LearningCompetencyService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.learningCompetencyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
