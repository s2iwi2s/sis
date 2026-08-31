import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IGradeLevelPayables } from '../grade-level-payables.model';
import { GradeLevelPayablesService } from '../service/grade-level-payables.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grade-level-payables-delete-dialog.html',
  imports: [TranslateDirective, TranslateModule, FormsModule, FontAwesomeModule, AlertError],
})
export class GradeLevelPayablesDeleteDialog {
  gradeLevelPayables?: IGradeLevelPayables;

  protected readonly gradeLevelPayablesService = inject(GradeLevelPayablesService);
  protected readonly activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gradeLevelPayablesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
