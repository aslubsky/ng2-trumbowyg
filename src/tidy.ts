import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

export class TrumbowygTidyPlugin {
    public static editor: any;

    public static init(editor: any, lang: string, http: HttpClient) {
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
                                http.post(TrumbowygTidyPlugin.editor.tidyUrl, t.$ed.html()).toPromise()
                                    .then((res: any) => {
                                        // console.log('tidy res', res.text());
                                        t.$ta.val(res.text());
                                    });
                            }
                            t.$ta.removeAttr('tabindex');
                        }
                    }, 0);
                };
            }
        }
    }
}
