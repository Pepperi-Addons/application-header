import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { MenuDataView } from '@pepperi-addons/papi-sdk';
import { Button } from '../application-header.model';


@Component({
    selector: 'buttons-tab',
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.scss']
})

@Injectable()
export class ButtonsComponent implements OnInit {
    
    @Input() buttons : Array<IPepDraggableItem>;

    @Output() onButtonsChange: EventEmitter<any> = new EventEmitter<any>();

    public availableFields: Array<IPepDraggableItem>;
    public dataView: MenuDataView;
    
    public systemButtons = [{key: 'Announcent', name: 'Announcent'},{key: 'Help', name: 'Help'},{key: 'User', name: 'User'},{key: 'Settings', name: 'Settings'}];
    
    constructor() {
       
    }
    
    ngOnInit(): void {

        this.dataView = {
            "Type": "Menu",
            "Title": "",
            "Hidden": false,
            "Context": {
                "ScreenSize": "Tablet",
                "Name": "Menu Buttons",
                "Profile": {
                    "InternalID": 72197,
                    "Name": "Admin"
                }
            },
            "Fields": [
                
            ]
        }

        

        this.availableFields = [
            { title: 'Notification', data: { key: 'notification' } }
        ]
    }

    ngOnChanges(e: any): void {
        if(e?.buttons?.currentValue?.length){
            this.dataView.Fields = e.buttons.currentValue.map(btn => {
                return { Title: btn.Title, FieldID: btn.FieldID }
            }).sort((btn1, btn2) => {
                if (btn1.Title < btn2.Title) { return -1; }
                if (btn1.Title > btn2.Title) { return 1; }
                return 0;
            });

            this.setAvailableFieldPermission();
        }

    }

    private setAvailableFieldPermission() {
        // Find the item in the available fields
        this.availableFields.forEach(field => {
            const item = this.dataView.Fields.filter(f => f.FieldID === field.data.key);
                // If exist disable or enable it.
                field.disabled = item ? true : false;
        })
  
    }

    onDataViewChange(event){
        if(event?.Fields?.length){
            let tmpButtons: Array<Button> = [];
            event.Fields.forEach(btn => {
                tmpButtons.push(new Button(btn.Title,btn.FieldID));
            });
            this.onButtonsChange.emit(tmpButtons);
        }
    }

}