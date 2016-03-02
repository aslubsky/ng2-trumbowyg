export declare class TrumbowygSelectResourcesPlugin {
    static editorResources: any[];
    static onSearch: any;
    static editor: any;
    static $modal: any;
    static lang: string;
    static pfx: string;
    static init(editor: any, lang: string): void;
    private static translate(str);
    private static renderList(pfx, html, items);
    private static selectResourcesCb(params, t);
    static updateResources(editorResources: any[]): void;
}
