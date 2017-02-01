export class TrumbowygTidyPlugin {
    public static editor: any;

    public static init(editor: any, lang: string) {
        TrumbowygTidyPlugin.editor = editor;

        editor.plugins.tidy = {
            init: (t: any) => {
                // console.log('TrumbowygCodemirrorPlugin');

                t.toggle = () => {
                    var prefix = t.o.prefix;
                    t.semanticCode(false, true);
                    setTimeout(function () {
                        t.doc.activeElement.blur();
                        t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                        t.$btnPane.toggleClass(prefix + 'disable');
                        t.$btnPane.find('.' + prefix + 'viewHTML-button').toggleClass(prefix + 'active');
                        if (t.$box.hasClass(prefix + 'editor-visible')) {
                            t.$ta.attr('tabindex', -1);
                        } else {
                            if (TrumbowygTidyPlugin.editor.tidyUrl) {
                                // console.log(t.$ed.html());
                                TrumbowygTidyPlugin.sendToTidy(t, t.$ed.html());
                            }
                            t.$ta.removeAttr('tabindex');
                        }
                    }, 0);
                };
            }
        }
    }

    private static sendToTidy(t: any, html: string) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                // console.log(xhr.responseText);
                t.$ta.val(xhr.responseText);
            }
        }
        xhr.open('POST', TrumbowygTidyPlugin.editor.tidyUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('html=' + encodeURIComponent(html));
    }
}
