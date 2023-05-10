import { Component, OnInit, Injectable, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { TranslateService } from '@ngx-translate/core';

interface groupButtonArray {
    key: string; 
    value: string;
}

@Component({
    selector: 'theme-header-tab',
    templateUrl: './theme-header.component.html',
    styleUrls: ['./theme-header.component.scss']
})

@Injectable()
export class ThemeheaderComponent implements OnInit {
    

    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Input() configuration: any; // TODO - ADD TYPE WITH STRUCTURE
    @Input() imageURL: string = '';

    assetsHostObject = {
        selectionType: 'single',
        allowedAssetsTypes: 'images',
        inDialog: true
    }

    headerColor: Array<groupButtonArray> = [];
    headerStyle:  Array<groupButtonArray> = [];

    constructor(private translate: TranslateService, private addonBlockLoaderService: PepAddonBlockLoaderService, private viewContainerRef: ViewContainerRef) {
       
    }
    
    ngOnInit(): void {
        this.headerColor = [  
            { key: 'system', value: this.translate.instant('THEME.COLOR.TYPES.SYSTEM') },
            { key: 'dimmed', value: this.translate.instant('THEME.COLOR.TYPES.SYSTEM_INVERT') },
            { key: 'primary', value: this.translate.instant('THEME.COLOR.TYPES.PRIMARY') },
            { key: 'secondary', value: this.translate.instant('THEME.COLOR.TYPES.SECONDARY') }
        ];


        this.headerStyle = [
            { key: 'strong', value:this.translate.instant('THEME.COLOR.STYLE.STRONG')},
            { key: 'regular', value: this.translate.instant('STHEME.COLOR.STYLE.REGULAR')},
            { key: 'weak', value: this.translate.instant('THEME.COLOR.STYLE.WEAK')}
        ]; 
    }

    onOpenAssetsDialog(){
        const dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'AssetPicker',
            hostObject: this.assetsHostObject,
            hostEventsCallback: (event) => { this.onHostEventChange(event, dialogRef); }
        });
    }

    onHostEventChange(event: any, dialogRef) {
        this.hostEvents.emit(event);

        if (dialogRef) {
            dialogRef.close(null);
        }
    }
}