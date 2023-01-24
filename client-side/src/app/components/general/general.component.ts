import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';

@Component({
    selector: 'general-tab',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss']
})

@Injectable()
export class GeneralComponent implements OnInit {
    
    @Input() general;

    
    constructor() {
       
    }
    
    ngOnInit(): void {
 
    }

    onHeaderKeyChange(event: any, key: string): void {

    }
}