export interface ICropperModel {
    viewMode?: number;
    dragMode?: 'crop' | 'move' | 'none';
    aspectRatio?: number;
    data?: any;
    preview?: string;
    responsive?: boolean;
    restore?: boolean;
    checkCrossOrigin?: boolean;
    checkOrientation?: boolean;
    modal?: boolean;
    guides?: boolean;
    center?: boolean;
    highlight?: boolean;
    background?: boolean;
    autoCrop?: boolean;
    autoCropArea?: number;
    movable?: boolean;
    rotatable?: boolean;
    scalable?: boolean;
    zoomable?: boolean;
    zoomOnTouch?: boolean;
    zoomOnWheel?: boolean;
    wheelZoomRatio?: number;
    cropBoxMovable?: boolean;
    cropBoxResizable?: boolean;
    toggleDragModeOnDblclick?: boolean;
    minContainerWidth?: number;
    minContainerHeight?: number;
    minCanvasWidth?: number;
    minCanvasHeight?: number;
    minCropBoxWidth?: number;
    minCropBoxHeight?: number;
    ready?: any;
    cropstart?: any;
    cropmove?: any;
    cropend?: any;
    crop?: any;
    zoom?: any;
}
