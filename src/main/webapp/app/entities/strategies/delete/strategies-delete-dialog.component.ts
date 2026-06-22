import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStrategies } from '../strategies.model';
import { StrategiesService } from '../service/strategies.service';

@Component({
  standalone: true,
  templateUrl: './strategies-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StrategiesDeleteDialogComponent {
  strategies?: IStrategies;

  constructor(
    protected strategiesService: StrategiesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.strategiesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
