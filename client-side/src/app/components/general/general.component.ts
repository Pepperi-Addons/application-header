import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { GeneralData } from '../application-header.model';

@Component({
    selector: 'general-tab',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss']
})

@Injectable()
export class GeneralComponent implements OnInit {
    
    @Input() general: GeneralData = new GeneralData();
    @Output() generalDataChanged : EventEmitter<GeneralData> = new EventEmitter();
    
    constructor() {
       
    }
    
    ngOnInit(): void {
 
    }

    onHeaderKeyChange(key: string, event: any): void {
        this.general[key] = event;
        this.generalDataChanged.emit(this.general);
    }
}