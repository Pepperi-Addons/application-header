import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject, ViewContainerRef } from '@angular/core';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialogRef } from '@angular/material/dialog';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { MenuItemComponent } from './menuItem/menu-item.component';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { MenuItem } from '../application-header.model';
@Component({
    selector: 'menu-tab',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})

@Injectable()
export class MenuComponent implements OnInit {
    
    @Input() menuItems: Array<MenuItem> =  []

    @Output() onAddNewMenuItem: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
    @Output() onAddNewSubMenuItem: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
    @Output() onDeleteMenuItem: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
    @Output() onMenuItemChange: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
    @Output() onMenuItemPositionChange: EventEmitter<MenuItem[]> = new EventEmitter<MenuItem[]>();
    public leftRightArrows : Array<PepButton> = [];
    
    dialogRef: MatDialogRef<any>;
    
    public isGrabbing = false;
   
    
    constructor(private viewContainerRef: ViewContainerRef,
                private addonBlockLoaderService: PepAddonBlockLoaderService) {
       
    }
    
    ngOnInit(): void {
    }

    addMenuItem(menuItem: MenuItem = null){
        this.onAddNewMenuItem.emit(menuItem);
    }
    addSubMenuItem(menuItem: MenuItem){
        this.onAddNewSubMenuItem.emit(menuItem);
    }

    deleteMenuItem(menuItem: MenuItem){
        this.onDeleteMenuItem.emit(menuItem);
    }

    menuItemChange(menuItem: MenuItem){
        this.onMenuItemChange.emit(menuItem);
    }

    /***************** DRAG AND DROP MENU ITEMS ************************/
    onDragStart(event: CdkDragStart) {
        //this.dataViewBuilderService.onDragStart(event);
        document.body.classList.add('inheritCursors');
        document.body.style.cursor = 'grabbing';
        //this._isGrabbingSubject.next(true);
    }

    onDragEnd(event: CdkDragEnd) {
        //this.dataViewBuilderService.onDragEnd(event);
        document.body.classList.remove('inheritCursors');
        document.body.style.cursor = 'unset';
        //this._isGrabbingSubject.next(false);
    }

    onDropField(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            this.onMenuItemPositionChange.emit(event.container.data);
            //this.notifyFieldsChange();
        } else if (event.container.id === 'emptyDropArea') {
            //this.addNewField(event.previousContainer.data[event.previousIndex], this.fields.length);
        } else {
            //this.addNewField(event.previousContainer.data[event.previousIndex], event.currentIndex);
        }
    }
}