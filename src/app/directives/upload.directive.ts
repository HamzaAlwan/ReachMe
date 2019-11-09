import {
  Directive,
  HostListener,
  HostBinding,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Directive({
  selector: '[appUpload]'
})
export class UploadDirective {
  @Input() private allowedExtensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @Output() private filesInvalidEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @Output() private originalContent: EventEmitter<any> = new EventEmitter();
  @HostBinding('style.background') private background = '#eee';

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    const files = evt.dataTransfer.files;
    const validFiles: Array<File> = [];
    const invalidFiles: Array<File> = [];
    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const ext = files[index].name.split('.')[
          files[index].name.split('.').length - 1
        ];
        if (this.allowedExtensions.lastIndexOf(ext) != -1) {
          validFiles.push(files[index]);
        } else {
          invalidFiles.push(files[index]);
        }
      }
      this.originalContent.emit(evt);
      this.filesChangeEmiter.emit(validFiles);
      this.filesInvalidEmiter.emit(invalidFiles);
    }
  }
}
