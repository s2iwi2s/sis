import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import SharedModule from 'app/shared/shared.module';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {ResourcesFormGroup, ResourcesFormService} from "../update/resources-form.service";
import {ITEM_DELETED_EVENT, ITEM_UPLOAD_EVENT} from "../../../config/navigation.constants";
import {ResourcesService} from "../service/resources.service";
import {DataUtils, FileLoadError} from "../../../core/util/data-util.service";
import {EventManager, EventWithContent} from "../../../core/util/event-manager.service";
import {AlertError} from "../../../shared/alert/alert-error.model";

@Component({
  selector: 'jhi-resources-upload-dialog',
  standalone: true,
  imports: [
    SharedModule, FormsModule
  ],
  templateUrl: './resources-upload-dialog.component.html',
  styleUrl: './resources-upload-dialog.component.scss'
})
export class ResourcesUploadDialogComponent {
  assessmentId: number = -1;
  files: File[] = [];

  uploadForm: ResourcesFormGroup = this.resourcesFormService.createResourcesFormGroup();

  constructor(
    protected resourcesService: ResourcesService,
    protected resourcesFormService: ResourcesFormService,
    protected activeModal: NgbActiveModal,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,) {
  }

  submitForm() {
    // this.resourcesService.create().subscribe(() => {
    //   this.activeModal.close(ITEM_UPLOAD_EVENT);
    // });
  }
  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.uploadForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('schInfoSysApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }
  cancel() {
    this.activeModal.dismiss();
  }
}
