import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';

@Component({
    selector: 'menu-tab',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})

@Injectable()
export class MenuComponent implements OnInit {
    
    @Input() menu;

    
    constructor() {
       
    }
    
    ngOnInit(): void {
 
    }

    onHeaderKeyChange(event: any, key: string): void {

    }
}