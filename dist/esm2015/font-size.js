export class TrumbowygFontSizePlugin {
    static init(editor, lang) {
        TrumbowygFontSizePlugin.editor = editor;
        TrumbowygFontSizePlugin.fontSizes = [];
        var i = 1;
        for (; i <= 7; i++) {
            //jQuery.trumbowyg.opts.fontSize.push($filter('translate')("Размер") + ' ' + i);
            TrumbowygFontSizePlugin.fontSizes.push(editor.langs[lang]['fontSize' + i]);
        }
        // Add all fonts in two dropdowns
        editor.plugins.fontSize = {
            init: (trumbowyg) => {
                // console.log('fontSize init');
                // trumbowyg.o.plugins.fontSize = trumbowyg.o.plugins.fontSize || {};
                trumbowyg.addBtnDef('fontSize', {
                    dropdown: TrumbowygFontSizePlugin.buildDropdown('fontSize', trumbowyg)
                });
            }
        };
    }
    static buildDropdown(func, trumbowyg) {
        var dropdown = [];
        TrumbowygFontSizePlugin.fontSizes.forEach((size, i) => {
            var btn = func + '_' + i;
            trumbowyg.addBtnDef(btn, {
                fn: (param, t) => {
                    //console.info(param, t);
                    document.execCommand('fontSize', false, param);
                    t.syncCode();
                },
                text: size,
                param: i + 1
            });
            dropdown.push(btn);
        });
        return dropdown;
    }
}
TrumbowygFontSizePlugin.fontSizes = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udC1zaXplLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2FzbHVic2t5L3dvcmsvY29sbGFib3JhdG9yL25nMi10cnVtYm93eWcvc3JjLyIsInNvdXJjZXMiOlsiZm9udC1zaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyx1QkFBdUI7SUFJekIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFXLEVBQUUsSUFBWTtRQUN4Qyx1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXhDLHVCQUF1QixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hCLGdGQUFnRjtZQUNoRix1QkFBdUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDOUU7UUFFRCxpQ0FBaUM7UUFDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUc7WUFDdEIsSUFBSSxFQUFFLENBQUMsU0FBYyxFQUFFLEVBQUU7Z0JBQ3JCLGdDQUFnQztnQkFDaEMscUVBQXFFO2dCQUNyRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtvQkFDNUIsUUFBUSxFQUFFLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO2lCQUN6RSxDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQTtJQUNMLENBQUM7SUFFTyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVMsRUFBRSxTQUFjO1FBQ2xELElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUU1Qix1QkFBdUIsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBWSxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQ2xFLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNyQixFQUFFLEVBQUUsQ0FBQyxLQUFVLEVBQUUsQ0FBTSxFQUFFLEVBQUU7b0JBQ3ZCLHlCQUF5QjtvQkFDekIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMvQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQ0QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO2FBQ2YsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztRQUdILE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7O0FBNUNhLGlDQUFTLEdBQWEsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBUcnVtYm93eWdGb250U2l6ZVBsdWdpbiB7XG4gICAgcHVibGljIHN0YXRpYyBlZGl0b3I6IGFueTtcbiAgICBwdWJsaWMgc3RhdGljIGZvbnRTaXplczogc3RyaW5nW10gPSBbXTtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdChlZGl0b3I6IGFueSwgbGFuZzogc3RyaW5nKSB7XG4gICAgICAgIFRydW1ib3d5Z0ZvbnRTaXplUGx1Z2luLmVkaXRvciA9IGVkaXRvcjtcblxuICAgICAgICBUcnVtYm93eWdGb250U2l6ZVBsdWdpbi5mb250U2l6ZXMgPSBbXTtcblxuICAgICAgICB2YXIgaSA9IDE7XG4gICAgICAgIGZvciAoOyBpIDw9IDc7IGkrKykge1xuICAgICAgICAgICAgLy9qUXVlcnkudHJ1bWJvd3lnLm9wdHMuZm9udFNpemUucHVzaCgkZmlsdGVyKCd0cmFuc2xhdGUnKShcItCg0LDQt9C80LXRgFwiKSArICcgJyArIGkpO1xuICAgICAgICAgICAgVHJ1bWJvd3lnRm9udFNpemVQbHVnaW4uZm9udFNpemVzLnB1c2goZWRpdG9yLmxhbmdzW2xhbmddWydmb250U2l6ZScgKyBpXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgYWxsIGZvbnRzIGluIHR3byBkcm9wZG93bnNcbiAgICAgICAgZWRpdG9yLnBsdWdpbnMuZm9udFNpemUgPSB7XG4gICAgICAgICAgICBpbml0OiAodHJ1bWJvd3lnOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udFNpemUgaW5pdCcpO1xuICAgICAgICAgICAgICAgIC8vIHRydW1ib3d5Zy5vLnBsdWdpbnMuZm9udFNpemUgPSB0cnVtYm93eWcuby5wbHVnaW5zLmZvbnRTaXplIHx8IHt9O1xuICAgICAgICAgICAgICAgIHRydW1ib3d5Zy5hZGRCdG5EZWYoJ2ZvbnRTaXplJywge1xuICAgICAgICAgICAgICAgICAgICBkcm9wZG93bjogVHJ1bWJvd3lnRm9udFNpemVQbHVnaW4uYnVpbGREcm9wZG93bignZm9udFNpemUnLCB0cnVtYm93eWcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBidWlsZERyb3Bkb3duKGZ1bmM6IGFueSwgdHJ1bWJvd3lnOiBhbnkpIHtcbiAgICAgICAgdmFyIGRyb3Bkb3duOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIFRydW1ib3d5Z0ZvbnRTaXplUGx1Z2luLmZvbnRTaXplcy5mb3JFYWNoKChzaXplOiBzdHJpbmcsIGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgdmFyIGJ0biA9IGZ1bmMgKyAnXycgKyBpO1xuICAgICAgICAgICAgdHJ1bWJvd3lnLmFkZEJ0bkRlZihidG4sIHtcbiAgICAgICAgICAgICAgICBmbjogKHBhcmFtOiBhbnksIHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUuaW5mbyhwYXJhbSwgdCk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb250U2l6ZScsIGZhbHNlLCBwYXJhbSk7XG4gICAgICAgICAgICAgICAgICAgIHQuc3luY0NvZGUoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRleHQ6IHNpemUsXG4gICAgICAgICAgICAgICAgcGFyYW06IGkgKyAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRyb3Bkb3duLnB1c2goYnRuKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gZHJvcGRvd247XG4gICAgfVxufVxuIl19