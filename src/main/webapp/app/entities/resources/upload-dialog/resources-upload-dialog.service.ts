import {Injectable} from "@angular/core";
import {EntityResponseType, ResourcesService} from "../service/resources.service";
import {IResources} from "../resources.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {forkJoin, Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ResourcesUploadDialogService {

  constructor(protected resourcesService: ResourcesService) { }

  createResources(resourceAry: IResources[]): Observable<EntityResponseType[]> {
    return forkJoin(resourceAry.map(
      resource => this.resourcesService.create({...resource, id: null}))
    );
  }

  convertEntityResponseTypeToIResources(entityResponseType: EntityResponseType): Pick<IResources, 'id' | 'fileName' | 'documentContentType'> {
    const resource = entityResponseType.body;
    return {
      id: resource?.id || 0,
      fileName: null,
      documentContentType: null,
      ...resource
    }
  }

  updateEntity(currentModal: NgbActiveModal, entityResponseTypeAry: EntityResponseType[],
               callback: (resourcesAry: Pick<IResources, "id" | "fileName" | "documentContentType">[], activeModal: NgbActiveModal) => void){
    const resourcesAry = entityResponseTypeAry.map(this.convertEntityResponseTypeToIResources);
    callback(resourcesAry, currentModal);
  }
}
