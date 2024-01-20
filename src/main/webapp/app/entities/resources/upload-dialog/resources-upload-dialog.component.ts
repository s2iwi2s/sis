import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {forkJoin} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import SharedModule from 'app/shared/shared.module';

import {ResourcesService} from "../service/resources.service";
import {DataUtils} from "../../../core/util/data-util.service";
import {IResources} from "../resources.model";
import {IAssessment} from "../../assessment/assessment.model";
import {ITEM_SAVED_EVENT, ITEM_UPLOADED_EVENT} from "../../../config/navigation.constants";
import {AssessmentService} from "../../assessment/service/assessment.service";
import {IStrategies} from "../../strategies/strategies.model";
import {StrategiesService} from "../../strategies/service/strategies.service";
import {ResourcesUploadDialogService} from "./resources-upload-dialog.service";

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

  files: File[] = [];

  constructor(
    protected resourcesUploadDialogService: ResourcesUploadDialogService,
    protected resourcesService: ResourcesService,
    protected activeModal: NgbActiveModal,
    protected dataUtils: DataUtils,) {
  }

  submitForm() {
    this.activeModal.close(ITEM_UPLOADED_EVENT);
  }

  save(callback: (resourcesAry: Pick<IResources, "id" | "fileName" | "documentContentType">[], activeModal: NgbActiveModal) => void) {
    forkJoin(this.files
      .map(file => this.dataUtils.fileToResource(file)))
      .subscribe(resourcesAry => {
        this.resourcesUploadDialogService.createResources(resourcesAry)
          .subscribe(entityResponseTypeAry => this.resourcesUploadDialogService.updateEntity(this.activeModal, entityResponseTypeAry, callback));
      });
  }

  // updateAssessment(resourcesAry: Pick<IResources, "id" | "fileName" | "documentContentType">[], activeModal: NgbActiveModal) {
  //   this.assessment.resources = [...(this.assessment.resources ? this.assessment.resources : []), ...resourcesAry];
  //   this.assessmentService.update(this.assessment).subscribe(ret => {
  //     activeModal.close(ITEM_SAVED_EVENT);
  //   });
  // }
  //
  // updateStrategies(resourcesAry: Pick<IResources, "id" | "fileName" | "documentContentType">[], activeModal: NgbActiveModal) {
  //   this.strategies.resources = [...(this.strategies.resources ? this.strategies.resources : []), ...resourcesAry];
  //   this.strategiesService.update(this.strategies).subscribe(ret => {
  //     activeModal.close(ITEM_SAVED_EVENT);
  //   });
  // }

  cancel() {
    this.activeModal.dismiss();
  }
}
