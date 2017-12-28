# ngx-cropper

An Angular2 &amp; Angular4 image plugin, includes upload, cropper, save to server.

 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Example

![Example](./example.png)

## Usage

### 1. Install

```bash
  npm i ngx-cropper-2
```

### 2. Config __example.module.ts__

```typescript
import { NgxCropperModule } from 'ngx-cropper-2';

@NgModule({
  imports: [
    NgxCropperModule
  ]
})
```

### 3. Config __example.component.html__

```html
  <ngx-cropper
  [config]="ngxCropperConfig"
  [cropperConfig]="cropperJsConfig"
  [onSave]="onSaveCallback"
  (onUploadSuccess)="onUpload($event)"
  (onUploadError)="onError($event)"
  (onSizeLimitExceed)="sizeLimitExceed($event)"
  (onCropperClosed)="cropperClosed()"
  (onCropperOpened)="cropperOpened()"
  ></ngx-cropper>
```

### 4. Config __example.component.ts__

```typescript
@component()
export class ExampleComponent {
  public ngxCropperConfig: object;

  // config 
  public cropperJsConfig: object;

  constructor() {
    this.ngxCropperConfig = {
      url: null, // image server url
      maxsize: 512000, // image max size, default 500k = 512000bit
      title: 'Apply your image size and position', // edit modal title, this is default
      uploadBtnName: 'Upload Image', // default Upload Image
      uploadBtnClass: null, // default bootstrap styles, btn btn-primary
      cancelBtnName: 'Cancel', // default Cancel
      cancelBtnClass: null, // default bootstrap styles, btn btn-default
      applyBtnName: 'Apply', // default Apply
      applyBtnClass: null, // default bootstrap styles, btn btn-primary
      fdName: 'file', // default 'file', this is  Content-Disposition: form-data; name="file"; filename="fire.jpg"
      closeBtnClass: "btn-close",
      acceptFiles: "image/*" // accept file types
    }
    
    // default settings
    this.cropperJsConfig = { // see the full list at https://www.npmjs.com/package/cropperjs
      autoCrop: true,
      viewMode: 1,
      dragMode: 'move',
      guides: true,
      movable: true,
      cropBoxMovable: false,
      cropBoxResizable: false
    };
  }

  // deal callback data
  public onUpload(data: any) {
    // do you want to do
    console.warn(JSON.parse(data));
    // data contains server response
  }

  public onError(error: any) {
    // do you want to do
    console.warn(JSON.parse(error));
    // data contains server response
  }

  public sizeLimitExceed(data: any) {
    // do you want to do
    console.warn(JSON.parse(data));
    {
      msg: `The size is max than ${this.viewConfig.maxsize}, now size is ${currentSize}k`
    }
  }

  public onCropperOpened() {
    // do you want to do
    console.warn('It`s opened');
  }

  public onCropperClosed() {
    // do you want to do
    console.warn('It`s closed');
  }
  
  onSaveCallback(file: any) { // if not set - the cropper will upload the file to specified url
    // you can upload your file manyally here
  }
}
```
