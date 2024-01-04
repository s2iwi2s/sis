import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICurriculumMap } from '../curriculum-map.model';
import { CurriculumMapService } from '../service/curriculum-map.service';

@Component({
  standalone: true,
  templateUrl: './curriculum-map-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CurriculumMapDeleteDialogComponent {
  curriculumMap?: ICurriculumMap;

  constructor(
    protected curriculumMapService: CurriculumMapService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.curriculumMapService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
