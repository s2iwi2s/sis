import { inject, Injectable } from '@angular/core';
import { IReport } from '../curriculum-mapping/report.model';
import { DataUtils } from '../../core/util/data-util.service';
import { map, Observable, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { parseJson } from '@angular/cli/src/utilities/json-file';
import { AlertService } from '../../core/util/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  dataUtils = inject(DataUtils);
  protected alertService = inject(AlertService);

  private sanitizer: DomSanitizer;
  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  openFile(report: IReport) {
    console.log('ReportsService.openFile report.base64Data', JSON.stringify(report));
    //   if(!report.base64Data){
    //     this.alertService.addAlert({
    //       type: 'danger',
    //       message: 'error: no response body'
    //     });
    //   } else {
    //     this.dataUtils.openFile(report?.base64Data || '', 'application/pdf');
    //   }
    //
    this.dataUtils.openFile(report?.base64Data || '', 'application/pdf');
    return report;
  }

  downloadPdf(report: Observable<IReport>) {
    return report.pipe(map(report => this.dataUtils.openFile(report?.base64Data || '', 'application/pdf')));
  }
}
