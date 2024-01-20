import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {forkJoin, Observable} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import SharedModule from 'app/shared/shared.module';

import {EntityResponseType, ResourcesService} from "../service/resources.service";
import {DataUtils} from "../../../core/util/data-util.service";
import {IResources} from "../resources.model";
import {IAssessment} from "../../assessment/assessment.model";
import {ITEM_UPLOAD_EVENT} from "../../../config/navigation.constants";
import {AssessmentService} from "../../assessment/service/assessment.service";

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
  assessment: IAssessment = {id: 0};
  files: File[] = [];

  constructor(
    protected resourcesService: ResourcesService,
    protected assessmentService: AssessmentService,
    protected activeModal: NgbActiveModal,
    protected dataUtils: DataUtils,) {
  }

  submitForm() {
    console.log("assessment =>",this.assessment);
    const oResourcesAry = forkJoin(this.files
      .map(file => this.dataUtils.fileToResource(file)));

    oResourcesAry.subscribe(
      resourcesAry => {
        this.createResources(resourcesAry)
          .subscribe(entityResponseTypeAry => {
            const resourcesAry = entityResponseTypeAry.map(this.convertEntityResponseTypeToIResources2);
            this.assessment.resources = [...(this.assessment.resources?this.assessment.resources: []), ...resourcesAry];
            this.assessmentService.update(this.assessment).subscribe(ret => {
              this.activeModal.close(ITEM_UPLOAD_EVENT);
            });
          });
      }
    );
  }

  createResources(resourceAry: IResources[]): Observable<EntityResponseType[]> {
    return forkJoin(resourceAry.map(
      resource => this.resourcesService.create({...resource, id: null}))
    );
  }

  convertEntityResponseTypeToIResources(r: IResources| null): Pick<IResources, 'id' | 'fileName' | 'documentContentType'>{
    const temp: Pick<IResources, 'id' | 'fileName' | 'documentContentType'> = {
      id: r?.id || 0,
      fileName: null,
      documentContentType: null,
      ...r
    }
    return temp
  }


  convertEntityResponseTypeToIResources2(entityResponseType: EntityResponseType): Pick<IResources, 'id' | 'fileName' | 'documentContentType'>{
    const r = entityResponseType.body;
    const temp: Pick<IResources, 'id' | 'fileName' | 'documentContentType'> = {
      id: r?.id || 0,
      fileName: null,
      documentContentType: null,
      ...r
    }
    return temp
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
