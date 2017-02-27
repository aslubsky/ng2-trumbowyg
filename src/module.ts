import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {TrumbowygEditor} from './editor';

@NgModule({
    imports: [
        HttpModule
    ],
    declarations: [
        TrumbowygEditor
    ],
    exports: [
        TrumbowygEditor
    ]
})
export class TrumbowygEditorModule {
}
