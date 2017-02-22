import { ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class TrumbowygEditor implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    private el;
    static modes: any;
    static langs: any;
    static inited: boolean;
    static localImageRegexp: RegExp;
    mode: string;
    lang: string;
    base64Image: any;
    private _value;
    base64ImageInserted: any;
    onInit: any;
    private element;
    private dirty;
    constructor(el: ElementRef);
    propagateChange: (_: any) => void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    writeValue(value: any): void;
    private static init(lang);
    ngOnChanges(changes: SimpleChanges): void;
    private detectBase64Insert(html);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
