import { ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class TrumbowygEditor implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    private el;
    private render;
    private http;
    static modes: any;
    static langs: any;
    static inited: boolean;
    static localImageRegexp: RegExp;
    hasAutoSave: boolean;
    autoSaveKey: string;
    lastUpdate: number;
    addBtns: any;
    mode: string;
    lang: string;
    base64Image: any;
    private _name;
    private _value;
    private _required;
    base64ImageInserted: any;
    onInit: any;
    private element;
    private _autoSaveTimer;
    private _autoSaved;
    constructor(el: ElementRef, render: Renderer2, http: HttpClient);
    validate(c: FormControl): {
        required: boolean;
    };
    propagateChange: (_: any) => void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    onChange(value: any): void;
    private _autoSave;
    private _saveToServer;
    private _checkAutoSave;
    private _buildAutoSaveToolbar;
    clearAutoSaved(): void;
    restoreAutoSave(): void;
    writeValue(value: any): void;
    private init;
    ngOnChanges(changes: SimpleChanges): void;
    private detectBase64Insert;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TrumbowygEditor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TrumbowygEditor, "[trumbowyg-editor]", never, { "hasAutoSave": "has-auto-save"; "autoSaveKey": "auto-save-key"; "lastUpdate": "last-update"; "addBtns": "addBtns"; "mode": "mode"; "lang": "lang"; "base64Image": "base64Image"; }, { "base64ImageInserted": "base64ImageInserted"; }, never>;
}
