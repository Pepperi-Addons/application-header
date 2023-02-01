import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';

@Component({
    selector: 'buttons-tab',
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.scss']
})

@Injectable()
export class ButtonsComponent implements OnInit {
    
    @Input() buttons;
    public availableFields: any;
    public dataView: any;
    
    constructor() {
       
    }
    
    ngOnInit(): void {
        this.dataView = {
            "InternalID": 5731318,
            "Type": "Menu",
            "Title": "",
            "Hidden": false,
            "CreationDateTime": "2022-04-10T14:19:03Z",
            "ModificationDateTime": "2022-04-28T09:29:01Z",
            "Context": {
                "Name": "Slugs",
                "ScreenSize": "Tablet",
                "Profile": {
                    "InternalID": 72197,
                    "Name": "Admin"
                }
            },
            "Fields": [
                
            ]
        }

        this.availableFields = [
            { title: 'Notification', data: { key: 'notification' } },
            { title: 'Button 2', data: { key: 'btn2' } }
        ]
    }

    onDataViewChange(event){

    }

    onHeaderKeyChange(event: any, key: string): void {

    }
}