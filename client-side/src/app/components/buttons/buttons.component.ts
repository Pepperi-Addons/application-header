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
            "Type": "Menu",
            "Title": "",
            "Hidden": false,
            "Context": {
                "Name": "Menu Buttons",
                "Profile": {
                    "InternalID": 72197,
                    "Name": "Admin"
                }
            },
            "Fields": [
                 {
                     "FieldID": "OCInnerActionAnnouncent",
                     "Title": "Announcent"
                 }
                // {
                //     "FieldID": "OCInnerActionHelp",
                //     "Title": "Help"
                // },{
                //     "FieldID": "OCInnerActionUser",
                //     "Title": "User"
                // },{
                //     "FieldID": "OCInnerActionSettings",
                //     "Title": "Settings"
                // }
            ]
        }

        this.availableFields = [
            { title: 'Notification', data: { key: 'notification' } }
        ]
    }

    onDataViewChange(event){
        debugger;
    }

    onHeaderKeyChange(event: any, key: string): void {
        debugger;
    }
}