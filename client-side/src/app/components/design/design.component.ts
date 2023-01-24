import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { Design } from '../../block/application-header.model';

@Component({
    selector: 'design-tab',
    templateUrl: './design.component.html',
    styleUrls: ['./design.component.scss']
})

@Injectable()
export class DesignComponent implements OnInit {
    
    public themeColorsOptions = [];
    public textColorsOptions = [];
    
    @Input() design: Design;
    @Output() designTabChanges: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
       
    }
    
    ngOnInit(): void {
        debugger;
    }

    onHeaderKeyChange(event: any, key: string): void {
        this.design[key] = event;
        
        this.designTabChanges.emit(this.design);
    }
}