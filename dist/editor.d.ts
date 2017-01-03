import { ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
export declare class TrumbowygEditor implements OnInit, OnChanges, OnDestroy {
    private el;
    static modes: any;
    static langs: any;
    static tidyUrl: string;
    static inited: boolean;
    static localImageRegexp: RegExp;
    mode: string;
    lang: string;
    base64Image: any;
    ngModel: string;
    ngModelChange: any;
    base64ImageInserted: any;
    onInit: any;
    private element;
    private dirty;
    constructor(el: ElementRef);
    private static init(lang);
    ngOnChanges(changes: SimpleChanges): void;
    private detectBase64Insert(html);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
