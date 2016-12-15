"use strict";
var core_1 = require('@angular/core');
var editor_1 = require('./editor');
var TrumbowygEditorModule = (function () {
    function TrumbowygEditorModule() {
    }
    TrumbowygEditorModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        editor_1.TrumbowygEditor
                    ],
                    exports: [
                        editor_1.TrumbowygEditor
                    ]
                },] },
    ];
    /** @nocollapse */
    TrumbowygEditorModule.ctorParameters = function () { return []; };
    return TrumbowygEditorModule;
}());
exports.TrumbowygEditorModule = TrumbowygEditorModule;
