import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { MenuItem } from '../../application-header.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss']
})

@Injectable()
export class MenuItemComponent implements OnInit {
    
    @Input() menuItem: MenuItem;
    @Input() deleteable = true;

    @Output() onDeleteMenuItem: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
    @Output() onMenuItemChange: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
    
    public leftRightArrows : Array<PepButton> = [];
    public menuItemLabelMaxCharacters = 20;
    public isGrabbing = false;

    private dialogRef: MatDialogRef<any>;
    
    constructor(private viewContainerRef: ViewContainerRef,
                private addonBlockLoaderService: PepAddonBlockLoaderService,
                public translate: TranslateService) {
       
    }
    
    ngOnInit(): void {
        this.leftRightArrows =  [
            { key: 'left', iconName: 'arrow_left_alt', callback: (event: any) => this.onItemHierarchyLevelChange(event,this) },
            { key: 'right', iconName: 'arrow_right_alt', callback: (event: any) => this.onItemHierarchyLevelChange(event,this) }
        ];

        this.setArrowsState();
    }

    deleteMenuItem(event, menuItem: MenuItem){
        this.onDeleteMenuItem.emit(menuItem);
    }

    menuItemChange(event,menuItem: MenuItem){
       this.menuItem.Title = event;
       this.onMenuItemChange.emit(menuItem);

    }

    onItemHierarchyLevelChange(event,menuItem){
        if(this.menuItem.HierarchyLevel >= 0 && this.menuItem.HierarchyLevel <= 2){
            this.menuItem.HierarchyLevel = event.source.key === 'left' ? this.menuItem.HierarchyLevel - 1 : this.menuItem.HierarchyLevel + 1;
        }
        this.onMenuItemChange.emit(menuItem);
        this.setArrowsState();
    }

    setArrowsState(){
            this.leftRightArrows[0].disabled = this.menuItem.HierarchyLevel == 0 ? true : false;
            this.leftRightArrows[1].disabled = this.menuItem.HierarchyLevel == 2 && this.deleteable ? true : false; 
    }

    openFlowPickerDialog(){
        const flow = this.menuItem?.Flow || null;

        this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'FlowPicker',
            size: 'large',
            hostObject: {
                'runFlowData': flow
            },
            hostEventsCallback: (event) => {
                if (event.action === 'on-done') {
                        this.menuItem.Flow = event.data;
                        this.onMenuItemChange.emit(this.menuItem); 
                        this.dialogRef.close();
                } else if (event.action === 'on-cancel') {
                        this.dialogRef.close();
                }
            }
        })
    }
}