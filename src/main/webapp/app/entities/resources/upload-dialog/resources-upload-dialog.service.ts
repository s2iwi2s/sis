import { Injectable } from '@angular/core';
import { ResourcesService } from '../service/resources.service';
import { IResources } from '../resources.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesUploadDialogService {
  constructor(protected resourcesService: ResourcesService) {}

  createResources(resourceAry: IResources[]): Observable<IResources[]> {
    return forkJoin(resourceAry.map(resource => this.resourcesService.create({ ...resource, id: null })));
  }

  convertEntityResponseTypeToIResources(resources: IResources): Pick<IResources, 'id' | 'fileName' | 'documentContentType'> {
    return {
      fileName: null,
      documentContentType: null,
      ...resources,
    };
  }

  updateEntity(
    currentModal: NgbActiveModal,
    resources: IResources[],
    callback: (resourcesAry: Pick<IResources, 'id' | 'fileName' | 'documentContentType'>[], activeModal: NgbActiveModal) => void,
  ): void {
    const resourcesAry = resources.map(this.convertEntityResponseTypeToIResources);
    callback(resourcesAry, currentModal);
  }
}
