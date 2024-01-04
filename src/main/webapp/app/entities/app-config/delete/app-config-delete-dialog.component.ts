import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAppConfig } from '../app-config.model';
import { AppConfigService } from '../service/app-config.service';

@Component({
  standalone: true,
  templateUrl: './app-config-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AppConfigDeleteDialogComponent {
  appConfig?: IAppConfig;

  constructor(
    protected appConfigService: AppConfigService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appConfigService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
