import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IResources } from '../resources.model';
import { ResourcesService } from '../service/resources.service';

@Component({
  standalone: true,
  templateUrl: './resources-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ResourcesDeleteDialogComponent {
  resources?: IResources;

  constructor(
    protected resourcesService: ResourcesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resourcesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
