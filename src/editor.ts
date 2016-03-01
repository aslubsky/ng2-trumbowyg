import {Directive, ElementRef, OnInit}         from 'angular2/core';

@Directive({
    selector: '[trumbowyg-editor]'
})
export class TrumbowygEditor implements OnInit {
    constructor(private el:ElementRef) {
    }

    ngOnInit() {
        console.log('TrumbowygEditor ngOnInit');
    }
}
