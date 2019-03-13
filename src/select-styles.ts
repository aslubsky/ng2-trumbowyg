declare var jQuery: any;

export class TrumbowygSelectStylesPlugin {
    public static allStyles: any[] = [];

    public static editor: any;
    public static lang: string;

    public static init(editor: any, lang: string) {
        TrumbowygSelectStylesPlugin.editor = editor;
        TrumbowygSelectStylesPlugin.lang = lang;
        editor.plugins.selectStyles = {
            init: function (trumbowyg: any) {
                trumbowyg.o.plugins.selectStyles = trumbowyg.o.plugins.selectStyles || {};

                trumbowyg.addBtnDef('selectStyles', {
                    fn: function (params: any) {
                        TrumbowygSelectStylesPlugin.selectStylesCb(params, trumbowyg);
                    }
                });
            },
            tag: 'img'
        }
    }

    private static selectStylesCb(params: any, t: any) {

        var pfx = t.o.prefix;
        var html: string[] = [];

        html.push('<div class="modal-container styles-select">');
        html.push('   <ul class="styles-list template-gallery list-unstyled">');
        TrumbowygSelectStylesPlugin.allStyles.forEach((style : any) => {
            html.push('   <li title="' + style.description + '" class="item style"><label>' +
                '<img src="' + style.icon + '" class="select-template-icon"><input type="radio" value="' + style.id + '" name="template">' +
                '<span class="title"> ' + style.title + '</span>' +
                '</label></li>');
        });
        html.push('   </ul>');
        html.push('</div>');

        var selectedImageIndex: number = null;
        var $modal = t.openModal(TrumbowygSelectStylesPlugin.editor.langs[TrumbowygSelectStylesPlugin.lang].selectTemplatesStyle, html.join(''))
            .on('tbwconfirm', function () {
                var selected = jQuery('input:checked', $modal);

                if (selected.length > 0) {
                    var styleId = parseInt(selected.val(), 10);
                   // console.log('styleId', styleId);
                    var editor = $modal.parent().find('.trumbowyg-editor');
                    editor.find('.customStyle').remove();
                    editor.append('<style class="customStyle">@import url(https://ets.davintoo.com/uploads/css/' + styleId + '.css);</style>');
                    t.syncTextarea();
                    t.$c.trigger('tbwchange');
                }

                setTimeout(function () {
                    t.closeModal();
                }, 250);
            })
            .on('tbwcancel', function () {
                t.restoreRange();
                t.closeModal();
            });

        $modal.addClass('big');

        jQuery('.styles-list li label', $modal).off('click').on('click', function (e:any) {
            jQuery('.styles-list li', $modal).removeClass('active');
            jQuery(this).parent().addClass('active');
        });

    };

    public static setStyles(allStyles: any[]) {
        TrumbowygSelectStylesPlugin.allStyles = allStyles;
    }
}
