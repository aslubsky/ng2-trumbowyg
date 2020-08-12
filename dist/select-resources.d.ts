import { EventEmitter } from '@angular/core';
export declare class TrumbowygSelectResourcesPlugin {
    static editorResources: any[];
    static onSearch: EventEmitter<any>;
    static editor: any;
    static $modal: any;
    static lang: string;
    static pfx: string;
    static init(editor: any, lang: string): void;
    private static translate;
    private static renderList;
    private static selectResourcesCb;
    static updateResources(editorResources: any[]): void;
}
