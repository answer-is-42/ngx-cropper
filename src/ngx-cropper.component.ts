import { defaults } from './ngx-cropper.defaults';
import { ICropperModel } from './ngx-cropper.interface';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import 'cropperjs/dist/cropper.min.css';
import './ngx-cropper.component.css';
import * as Cropper from 'cropperjs';

import { NgxCropperService } from './ngx-cropper.service';
import { Config } from './ngx-cropper.config.model';

@Component({
  selector: 'ngx-cropper',
  template: `
    <section class="inline-block">
      <a class="btn btn-primary" href="javascript: void(0)"
      [ngClass]="viewConfig.uploadBtnClass"
      onclick="document.getElementById('inputImage').click()">{{viewConfig.uploadBtnName}}</a>
      <input id="inputImage" type="file" class="hide" hidden [accept]="viewConfig.acceptFiles">
    </section>
    <div class="crop-background" *ngIf="isShow"></div>
    <section class="crop-container" *ngIf="isShow">
      <div class="crop-box">
        <div class="crop-box-header">
          <h3>{{viewConfig.title}}</h3>
          <button [ngClass]="viewConfig.closeBtnClass" type="button" class="crop-box-close" (click)="onCancel()">
            <span></span>
          </button>
        </div>
        <div class="crop-box-body">
          <figure style="height: 300px;">
            <img id="cropper-image" class="full-width">
          </figure>
        </div>
        <div class="crop-box-footer">
          <a class="btn btn-default" href="javascript: void(0)"
          [ngClass]="viewConfig.cancelBtnClass"  (click)="onCancel()">{{viewConfig.cancelBtnName}}</a>
          <a class="btn btn-primary" href="javascript: void(0)"
          [ngClass]="viewConfig.applyBtnClass"  (click)="onApply()">{{viewConfig.applyBtnName}}</a>
        </div>
      </div>
    </section>
  `,
  providers: [NgxCropperService]
})
export class NgxCropperComponent implements OnInit {
  public isShow: boolean = false;
  public viewConfig: Config;
  @Input() private config: Config;
  @Input() private cropperConfig: ICropperModel;
  @Input() private onSave: any; // a callBack for posting data
  @Output() private onUploadSuccess: EventEmitter<string> = new EventEmitter<string>();
  @Output() private onUploadError: EventEmitter<string> = new EventEmitter<string>();
  @Output() private onSizeLimitExceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() private onCropperClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() private onCropperOpened: EventEmitter<void> = new EventEmitter<void>();

  private fileName: string;
  private fileType: string;
  private dom: HTMLInputElement;
  private cropper: Cropper;

  constructor(private ngxCropperService: NgxCropperService) { }

  public ngOnInit() {
    // init config
    this.viewConfig = {
      url: this.config.url || null,
      maxsize: this.config.maxsize || 512000,
      title: this.config.title || 'Apply your image size and position',
      uploadBtnName: this.config.uploadBtnName || 'Upload Image',
      uploadBtnClass: this.config.uploadBtnClass || null,
      cancelBtnName: this.config.cancelBtnName || 'Cancel',
      cancelBtnClass: this.config.cancelBtnClass || null,
      applyBtnName: this.config.applyBtnName || 'Apply',
      applyBtnClass: this.config.applyBtnClass || null,
      fdName: this.config.fdName || 'file',
      closeBtnClass: this.config.closeBtnClass || '',
      acceptFiles: this.config.acceptFiles || 'image/*'
    };

    this.cropperConfig = this.applyDefaults(this.cropperConfig);

    //  init upload btn
    const dom = (this.dom = document.getElementById('inputImage') as HTMLInputElement);
    this.dom.onchange = () => {
      const files = dom.files;

      if (files && files.length > 0) {
        this.isShow = true;
        this.onCropperOpened.emit();
        setTimeout(() => {
          this.initCropper();

          const file = files[0];
          const blobURL = URL.createObjectURL(file);
          this.fileName = file.name;
          this.fileType = file.type;

          this.cropper.replace(blobURL);
        });
      }
    };
  }

  /**
   * click apply event
   *
   * @returns
   * @memberof NgxCropperComponent
   */
  public onApply() {
    const blob = this.dataURItoBlob(this.cropper.getCroppedCanvas().toDataURL(this.fileType));

    if (blob.size > this.viewConfig.maxsize) {
      const currentSize = Math.ceil(blob.size / 1024);
      // sent message max then size.
      this.onSizeLimitExceed.emit(
        JSON.stringify({
          msg: `The size is max than ${this.viewConfig.maxsize}, now size is ${currentSize}k`
        })
      );
      return;
    }

    const fd = new FormData();
    const name = this.viewConfig.fdName;
    fd.append(name, blob, this.fileName);

    const url = this.viewConfig.url;
    const callBack = this.onSave;
    if (typeof callBack === 'function') {
      callBack(fd);
    } else {
      this.ngxCropperService.save(url, fd).subscribe(
        (data: any) => {
          // return success
          this.onUploadSuccess.emit(
            JSON.stringify(data)
          );
          // hidden modal
          this.onCancel();
        },
        (error: any) => {
          // return error
          this.onUploadError.emit(
            JSON.stringify(error)
          );
          this.onCancel();
        }
      );
    }
  }

  /**
   * Hidden edit modal
   *
   * @memberof NgxCropperComponent
   */
  public onCancel() {
    this.isShow = false;
    (document.getElementById('inputImage') as HTMLInputElement).value = null;
    this.onCropperClosed.emit();
  }

  /**
   * transfer uri to blob
   *
   * @private
   * @param {*} dataURI
   * @returns
   * @memberof NgxCropperComponent
   */
  private dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const bb = new Blob([ab], {
      type: mimeString
    });
    return bb;
  }

  /**
   * init cropper plugin
   *
   * @private
   * @memberof NgxCropperComponent
   */
  private initCropper(): void {
    const cropBox = document.getElementById('cropper-image') as HTMLImageElement;

    this.cropper = new Cropper(cropBox, this.cropperConfig);
  }

  private applyDefaults(config: ICropperModel) {
    for (const i in defaults) {
      if (typeof config[i] === 'undefined') {
        config[i] = defaults[i];
      }
    }
    return config;
  }

}
