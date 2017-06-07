"use strict";
var TrumbowygSelectStylesPlugin = (function () {
    function TrumbowygSelectStylesPlugin() {
    }
    TrumbowygSelectStylesPlugin.init = function (editor, lang) {
        TrumbowygSelectStylesPlugin.editor = editor;
        TrumbowygSelectStylesPlugin.lang = lang;
        editor.plugins.selectStyles = {
            init: function (trumbowyg) {
                trumbowyg.o.plugins.selectStyles = trumbowyg.o.plugins.selectStyles || {};
                trumbowyg.addBtnDef('selectStyles', {
                    fn: function (params) {
                        TrumbowygSelectStylesPlugin.selectStylesCb(params, trumbowyg);
                    }
                });
            },
            tag: 'img'
        };
    };
    TrumbowygSelectStylesPlugin.selectStylesCb = function (params, t) {
        var pfx = t.o.prefix;
        var html = [];
        html.push('<div class="modal-container styles-select">');
        html.push('   <ul class="styles-list template-gallery list-unstyled">');
        TrumbowygSelectStylesPlugin.allStyles.forEach(function (style) {
            html.push('   <li title="' + style.description + '" class="item style"><label>' +
                '<img src="' + style.icon + '" class="select-template-icon"><input type="radio" value="' + style.id + '" name="template">' +
                '<span class="title"> ' + style.title + '</span>' +
                '</label></li>');
        });
        html.push('   </ul>');
        html.push('</div>');
        var selectedImageIndex = null;
        var $modal = t.openModal(TrumbowygSelectStylesPlugin.editor.langs[TrumbowygSelectStylesPlugin.lang].attachedImages, html.join(''))
            .on('tbwconfirm', function () {
            var selected = jQuery('input:checked', $modal);
            if (selected.size() > 0) {
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
        jQuery('.styles-list li label', $modal).off('click').on('click', function (e) {
            jQuery('.styles-list li', $modal).removeClass('active');
            jQuery(this).parent().addClass('active');
        });
    };
    ;
    TrumbowygSelectStylesPlugin.setStyles = function (allStyles) {
        TrumbowygSelectStylesPlugin.allStyles = allStyles;
    };
    TrumbowygSelectStylesPlugin.editorImages = [];
    TrumbowygSelectStylesPlugin.allStyles = {};
    return TrumbowygSelectStylesPlugin;
}());
exports.TrumbowygSelectStylesPlugin = TrumbowygSelectStylesPlugin;
