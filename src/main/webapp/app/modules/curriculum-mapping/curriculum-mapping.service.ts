import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IReport, NewReport } from './report.model';

type RestOf<T extends IReport | NewReport> = Omit<T, ''> & {};
@Injectable({ providedIn: 'root' })
export class CurriculumMappingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/report');
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}
  find(courseId: number): Observable<IReport> {
    return this.http.get<IReport>(`${this.resourceUrl}/currMap/${courseId}`, { observe: 'response' }).pipe(map(res => res.body!));
  }
}
