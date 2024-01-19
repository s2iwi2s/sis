/* eslint-disable no-console */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'jhi-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @Input() files: File[] = [];
  @Input() maxFiles = 1;
  @Output() fileDeleted = new EventEmitter<any>();
  @Output() fileChanged = new EventEmitter<any>();

  constructor() {
    this.files = [];
  }

  uploadFile(files: FileList): void {
    // if (files.length > 0) {
    //   this.files.push(files[0]);
    // }
    console.log('uploadFile = ', files);
    console.log('files.length = ', files.length);
    console.log('maxFiles = ', this.maxFiles);
    for (let i = 0; i < files.length && i < this.maxFiles; i++) {
      console.log('i = ', i);
      this.files.push(files[i]);
    }
    this.fileChanged.emit(files);
  }

  fileChangeEvent(event: any): void {
    const fileAry = event.target.files;
    this.uploadFile(fileAry);
  }

  deleteAttachment(index: any): void {
    this.files.splice(index, 1);
    this.fileDeleted.emit(index);
  }
}
