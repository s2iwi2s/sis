import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOrg } from '../org.model';
import { OrgService } from '../service/org.service';

@Component({
  standalone: true,
  templateUrl: './org-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OrgDeleteDialogComponent {
  org?: IOrg;

  constructor(
    protected orgService: OrgService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orgService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
