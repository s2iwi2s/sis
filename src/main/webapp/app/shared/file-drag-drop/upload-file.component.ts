/* eslint-disable no-console */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DragDropDirective } from '../drag-drop/drag-drop.directive';

@Component({
  selector: 'jhi-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  imports: [DragDropDirective],
})
export class UploadFileComponent {
  @Input() files: File[] = [];
  @Input() maxFiles = 1;
  @Output() fileDeleted = new EventEmitter<any>();
  @Output() fileChanged = new EventEmitter<any>();

  constructor() {
    this.files = [];
  }

  uploadFile(files: any): void {
    console.log('UploadFileComponent.uploadFile() called with event:', files);
    // this.files = files;
    let newfiles: FileList = files;

    for (let i = 0; i < files.length && i < this.maxFiles; i++) {
      this.files.push(files[i]);
    }

    console.log('UploadFileComponent.uploadFile() called with files:', this.files);
  }

  fileChangeEvent(event: any): void {
    console.log('UploadFileComponent.fileChangeEvent() called with event:', event);
    const fileAry = event.target.files;
    console.log('UploadFileComponent.fileChangeEvent() called with fileAry:', fileAry);
    this.uploadFile(fileAry);
  }

  deleteAttachment(index: any): void {
    this.files.splice(index, 1);
    this.fileDeleted.emit(index);
  }
}
