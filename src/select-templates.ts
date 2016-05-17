import {EventEmitter}         from '@angular/core';

declare var jQuery:any;

const DEFAULT_ICON = 'themes/default/assets/img/t-icon.png';

export class TrumbowygSelectTemplatesPlugin {
    public static templates:any[] = [];
    public static allTemplates:any = {};

    public static editor:any;
    public static lang:string;

    public static init(editor:any, lang:string) {
        TrumbowygSelectTemplatesPlugin.editor = editor;
        TrumbowygSelectTemplatesPlugin.lang = lang;

        //console.log('init', editor, editor.langs, lang, editor.langs[lang].selectTemplatesNoData);

        //TrumbowygSelectResourcesPlugin.onSearch = new EventEmitter();

        jQuery.extend(true, editor, {
            selectTemplates: {},
            opts: {
                btnsDef: {
                    selectTemplates: {
                        func: function (params, t) {
                            //console.log(editorResources);
                            TrumbowygSelectTemplatesPlugin.selectTemplatesCb(params, t);
                        },
                        ico: 'selectTemplates'
                    }
                }
            }
        });


        TrumbowygSelectTemplatesPlugin.templates.push({
            id: 'tab-no-data',
            label: editor.langs[lang].selectTemplatesNoData,
            elements: []
        });
        TrumbowygSelectTemplatesPlugin.allTemplates['template-no-data'] =
            '<div>' + editor.langs[lang].selectTemplatesNoData + '</div>';
    }

    private static selectTemplatesCb(params, t) {
        var pfx = t.o.prefix;
        //console.log('editorResources', editorResources);

        var html = [];

        html.push('<div class="modal-container templates-select">');
        html.push('<ul class="nav nav-tabs" role="tablist">');
        TrumbowygSelectTemplatesPlugin.templates.forEach((templateSet, i) => {
            html.push('<li role="' + templateSet.id + '" class="' + (i == 0 ? 'active' : '') + '">');
            html.push('   <a href="#" data-tab="' + templateSet.id + '"  role="tab" data-toggle="tab">' + templateSet.label + '</a>');
            html.push('</li>');
        });

        html.push('</ul>');
        html.push('<div class="tab-content">');


        TrumbowygSelectTemplatesPlugin.templates.forEach((templateSet, i) => {
            html.push('   <div role="tabpanel" id="' + templateSet.id + '" class="tab-pane ' + (i == 0 ? 'active' : '') + '">');
            html.push('   <ul class="templates-list template-gallery list-unstyled">');
            templateSet.elements.forEach((template:any, j) => {
                template.icon = template.icon || DEFAULT_ICON;
                html.push('   <li title="' + template.description + '" class="item"><label>' +
                    '<img src="' + template.icon + '" class="select-template-icon"><input type="radio" value="' + template.id + '" name="template">' +
                    '<span class="title"> ' + template.title + '</span>' +
                    '<span class="description"> ' + template.description + '</span>' +
                    '</label></li>');
            });
            html.push('   </ul>');
            html.push('   </div>');
        });

        html.push('</div>');
        html.push('</div>');


        //console.log('html', html);
        var $modal = t.openModal(TrumbowygSelectTemplatesPlugin.editor.langs[TrumbowygSelectTemplatesPlugin.lang].selectTemplatesHeader, html.join(''))
            .on(pfx + 'confirm', function () {
                var selected = jQuery('input:checked', $modal);
                var val = selected.val();
                //console.log(val, TrumbowygSelectTemplatesPlugin.allTemplates[val]);

                t.restoreSelection();
                t.syncCode();
                jQuery(this).off(pfx + 'confirm');

                if (val) {
                    TrumbowygSelectTemplatesPlugin.editor.insertHtml(t, TrumbowygSelectTemplatesPlugin.allTemplates[val]);

                    setTimeout(function () {
                        t.closeModal();
                    }, 250);
                }
            })
            .one(pfx + 'cancel', function () {
                jQuery(this).off(pfx + 'confirm');
                t.closeModal();
                t.restoreSelection();
            });
        $modal.addClass('big');

        jQuery('.nav.nav-tabs a', $modal).off('click').on('click', function (e) {
            e.preventDefault();
            //    console.log('O_O', $(this).attr('data-tab'));
            jQuery('.tab-content .tab-pane', $modal).removeClass('active');
            jQuery('#' + jQuery(this).attr('data-tab')).addClass('active');
            jQuery(this).tab('show');
        });
        jQuery('.template-gallery li label', $modal).off('click').on('click', function (e) {
            //console.log('O_O', e, $(this));
            jQuery('.template-gallery li', $modal).removeClass('active');
            jQuery(this).parent().addClass('active');
        });
    }

    public static setTemplates(templates:any[], allTemplates:any) {
        TrumbowygSelectTemplatesPlugin.templates = templates;
        TrumbowygSelectTemplatesPlugin.allTemplates = allTemplates;
    }
}
