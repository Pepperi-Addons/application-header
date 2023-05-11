import { Component, OnInit, Injectable, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { TranslateService } from '@ngx-translate/core';
import { appHeaderTheme } from '../application-header.model';

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
    

    @Input() hostObject: appHeaderTheme;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Input() imageURL: string = '';

    assetsHostObject = {
        selectionType: 'single',
        allowedAssetsTypes: 'images',
        inDialog: true
    }

    headerColor: Array<groupButtonArray> = [];
    headerStyle:  Array<groupButtonArray> = [];
    shadowIntensity:  Array<groupButtonArray> = [];

    constructor(private translate: TranslateService, private addonBlockLoaderService: PepAddonBlockLoaderService, private viewContainerRef: ViewContainerRef) {
       
    }
    
    ngOnInit(): void {

        this.hostObject = new appHeaderTheme();

        this.headerColor = [  
            { key: 'system', value: this.translate.instant('THEME.COLOR.TYPE.SYSTEM') },
            { key: 'system_invert', value: this.translate.instant('THEME.COLOR.TYPE.SYSTEM_INVERT') },
            { key: 'primary', value: this.translate.instant('THEME.COLOR.TYPE.PRIMARY') },
            { key: 'secondary', value: this.translate.instant('THEME.COLOR.TYPE.SECONDARY') }
        ];


        this.headerStyle = [
            { key: 'strong', value:this.translate.instant('THEME.COLOR.STYLE.STRONG')},
            { key: 'regular', value: this.translate.instant('THEME.COLOR.STYLE.REGULAR')},
            { key: 'weak', value: this.translate.instant('THEME.COLOR.STYLE.WEAK')}
        ];
        
        this.shadowIntensity = [
            { key: 'soft', value: this.translate.instant('THEME.SHADOW.INTENSITY.SOFT')},
            { key: 'regular', value: this.translate.instant('THEME.SHADOW.INTENSITY.REGULAR')},
            { key: 'hard', value: this.translate.instant('THEME.SHADOW.INTENSITY.HARD')}
        ];
    }

    onOpenAssetsDialog(){
        const dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'AssetPicker',
            hostObject: this.assetsHostObject,
            hostEventsCallback: (event) => { this.onAssetsHostEventChange(event, dialogRef); }
        });
    }

    onAssetsHostEventChange(event: any, dialogRef) {
        this.hostObject.logoSrc = event?.url || '';

        this.updateHostObject();

        if (dialogRef) {
            dialogRef.close(null);
        }
    }

    onHeaderFieldChange(key, event){
       const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;

        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.hostObject[keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.hostObject[key] = value;
        }

        this.updateHostObject();
    }

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-theme',
            theme: this.hostObject
        });
    }

}