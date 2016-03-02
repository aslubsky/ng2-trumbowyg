export declare class TrumbowygSelectImagesPlugin {
    static editorImages: any[];
    static editor: any;
    static lang: string;
    static imagesExtensions: string[];
    static init(editor: any, lang: string): void;
    private static selectImageCb(params, t, editorImages);
    static updateImages(files: any[]): void;
}
