import { ElementRef, OnInit, OnDestroy } from 'angular2/core';
export declare class TrumbowygEditor implements OnInit, OnDestroy {
    private el;
    static modes: any;
    static langs: any;
    static inited: boolean;
    static localImageRegexp: RegExp;
    mode: string;
    lang: string;
    ngModel: string;
    ngModelChange: any;
    onInit: any;
    private element;
    private dirty;
    constructor(el: ElementRef);
    private static init(lang);
    ngOnChanges(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
