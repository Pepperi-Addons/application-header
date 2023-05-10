import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'theme-header-tab',
    templateUrl: './theme-header.component.html',
    styleUrls: ['./theme-header.component.scss']
})

@Injectable()
export class ThemeheaderComponent implements OnInit {
    
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
       
    }
    
    ngOnInit(): void {
 
    }
}