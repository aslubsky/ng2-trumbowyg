import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {TrumbowygEditor} from './editor';

@NgModule({
    imports: [
        HttpClientModule
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
