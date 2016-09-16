declare var jQuery: any;

import * as CodeMirror from 'codemirror';

export class TrumbowygCodemirrorPlugin {
    public static editor: any;

    public static init(editor: any, lang: string) {
        TrumbowygCodemirrorPlugin.editor = editor;

        jQuery.extend(true, jQuery.trumbowyg, {
            plugins: {
                codemirror: {
                    init: (t) => {
                        // console.log('TrumbowygCodemirrorPlugin');

                        t.toggle = function () {
                            var prefix = t.o.prefix;
                            t.semanticCode(false, true);
                            setTimeout(function () {
                                t.doc.activeElement.blur();
                                t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                                t.$btnPane.toggleClass(prefix + 'disable');
                                jQuery('.' + prefix + 'viewHTML-button', t.$btnPane).toggleClass(prefix + 'active');
                                if (t.$box.hasClass(prefix + 'editor-visible')) {
                                    if (t.$codeMirror) {
                                        t.$codeMirrorEl.hide();
                                    }
                                    t.$ta.attr('tabindex', -1);
                                } else {
                                    if (t.$codeMirror) {
                                        t.$codeMirrorEl.show();
                                        t.$codeMirror.doc.setValue(t.$ed.html());
                                    }
                                    t.$ta.removeAttr('tabindex');
                                }
                            }, 0);
                        };

                        t.$c.on('tbwopenfullscreen', function () {
                            // console.log('tbwopenfullscreen');
                            t.$codeMirrorEl.addClass('fullscreen');
                            t.$ed.addClass('bordered');
                        });
                        t.$c.on('tbwclosefullscreen', function () {
                            // console.log('tbwclosefullscreen');
                            t.$codeMirrorEl.removeClass('fullscreen');
                            t.$ed.removeClass('bordered');
                        });
                        t.$c.on('tbwinit', function () {
                            t.$ed.addClass('page-container');
                            if (t.$box.width() >= 1200) {
                                t.$ed.addClass('bordered');
                            }

                            t.$codeMirror = null;
                            if (t.o.btns.indexOf('viewHTML') !== -1) {
                                t.$codeMirror = CodeMirror.fromTextArea(t.$ta[0], {
                                    lineNumbers: true,
                                    theme: 'default',
                                    mode: 'htmlmixed',
                                    styleActiveLine: true,
                                    matchBrackets: true
                                });
                                t.$codeMirrorEl = jQuery('.CodeMirror', t.$box);
                                t.$codeMirrorEl.hide();
                                t.$codeMirror.on('change', function (inst) {
                                    // console.log('myCodeMirror change', inst.doc.getValue());
                                    t.$ta.val(inst.doc.getValue());
                                    t.$c.trigger('tbwchange');
                                });
                            }
                        });
                    }
                }
            }
        });
    }
}
