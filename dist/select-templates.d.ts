export declare class TrumbowygSelectTemplatesPlugin {
    static templates: any[];
    static allTemplates: any;
    static editor: any;
    static lang: string;
    static init(editor: any, lang: string): void;
    private static selectTemplatesCb(params, t);
    static setTemplates(templates: any[], allTemplates: any): void;
}
