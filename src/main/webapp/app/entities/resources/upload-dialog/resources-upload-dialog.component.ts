import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../service/resources.service';
import { DataUtils } from '../../../core/util/data-util.service';
import { IResources } from '../resources.model';
import { ITEM_UPLOADED_EVENT } from '../../../config/navigation.constants';
import { ResourcesUploadDialogService } from './resources-upload-dialog.service';
import { AlertError } from '../../../shared/alert/alert-error';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UploadFileComponent } from '../../../shared/file-drag-drop/upload-file.component';

@Component({
  selector: 'jhi-resources-upload-dialog',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, AlertError, UploadFileComponent],
  templateUrl: './resources-upload-dialog.component.html',
  styleUrl: './resources-upload-dialog.component.scss',
})
export class ResourcesUploadDialogComponent {
  files: File[] = [];

  constructor(
    protected resourcesUploadDialogService: ResourcesUploadDialogService,
    protected resourcesService: ResourcesService,
    protected activeModal: NgbActiveModal,
    protected dataUtils: DataUtils,
  ) {}

  submitForm(): void {
    console.log('ResourcesUploadDialogComponent.submitForm() called with files:', this.files);
    this.activeModal.close(ITEM_UPLOADED_EVENT);
  }

  save(callback: (resourcesAry: Pick<IResources, 'id' | 'fileName' | 'documentContentType'>[], activeModal: NgbActiveModal) => void): void {
    forkJoin(this.files.map(file => this.dataUtils.fileToResource(file))).subscribe(resourcesAry => {
      console.log('ResourcesUploadDialogComponent.submitForm() called with resourcesAry:', resourcesAry);
      this.resourcesUploadDialogService
        .createResources(resourcesAry)
        .subscribe(resources => this.resourcesUploadDialogService.updateEntity(this.activeModal, resources, callback));
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
