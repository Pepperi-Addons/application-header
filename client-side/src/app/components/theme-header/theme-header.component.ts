import { Component, OnInit, Injectable, Input, Output, EventEmitter, ViewContainerRef, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { TranslateService } from '@ngx-translate/core';
import { appHeaderTheme } from '../application-header.model';
import { firstValueFrom } from 'rxjs';
import { PepButton } from '@pepperi-addons/ngx-lib/button';

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
    
    @ViewChild('colorExample') colorExample: ElementRef;
    private _hostObject: appHeaderTheme = new appHeaderTheme();
    @Input() 
    set hostObject(value: appHeaderTheme) {
        if (!value) {
            value = new appHeaderTheme();
        }

        this._hostObject = value;
    }
    get hostObject(): appHeaderTheme {
        return this._hostObject;
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    headerColor: Array<groupButtonArray> = [];
    headerStyle:  Array<groupButtonArray> = [];
    shadowIntensity:  Array<PepButton> = []; 

    constructor(private translate: TranslateService, 
                private addonBlockLoaderService: PepAddonBlockLoaderService, 
                private viewContainerRef: ViewContainerRef, 
                private renderer: Renderer2) {
       
    }
    
    async ngOnInit(): Promise<void> {

        const system = await this.translate.get('THEME.COLOR.TYPE.SYSTEM').toPromise();

        this.headerColor = [  
            { key: 'system-primary', value: this.translate.instant('THEME.COLOR.TYPE.SYSTEM') },
            { key: 'system-primary-invert', value: this.translate.instant('THEME.COLOR.TYPE.SYSTEM_INVERT') },
            { key: 'user-primary', value: this.translate.instant('THEME.COLOR.TYPE.PRIMARY') },
            { key: 'user-secondary', value: this.translate.instant('THEME.COLOR.TYPE.SECONDARY') }
        ];


        this.headerStyle = [
            { key: 'strong', value: this.translate.instant('THEME.COLOR.STYLE.STRONG')},
            { key: 'regular', value: this.translate.instant('THEME.COLOR.STYLE.REGULAR')},
            { key: 'weak', value: this.translate.instant('THEME.COLOR.STYLE.WEAK')}
        ];
        
        this.shadowIntensity = [
            { key: 'soft', value: this.translate.instant('THEME.SHADOW.INTENSITY.SOFT'), callback: (event: any) => this.onHeaderFieldChange('shadow.intensity',event)},
            { key: 'regular', value: this.translate.instant('THEME.SHADOW.INTENSITY.REGULAR'), callback: (event: any) => this.onHeaderFieldChange('shadow.intensity',event)},
            { key: 'hard', value: this.translate.instant('THEME.SHADOW.INTENSITY.HARD'), callback: (event: any) => this.onHeaderFieldChange('shadow.intensity',event)}
        ];
    }

    setColorValue(){
        this.renderer.addClass(this.colorExample.nativeElement,this.hostObject.color.color);
        this.renderer.addClass(this.colorExample.nativeElement,this.hostObject.color.style);

        setTimeout(() => {
            const elem = document.getElementById('colorExample'); // get element
            if(elem){
                this.hostObject.color.colorValue = getComputedStyle(this.colorExample.nativeElement).getPropertyValue('background-color');
                this.updateHostObject();  
            }
        }, 100);
    }
    onHeaderFieldChange(key, event){
 
       const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
       
       this.renderer.removeClass(this.colorExample.nativeElement,this.hostObject.color.color);
       this.renderer.removeClass(this.colorExample.nativeElement,this.hostObject.color.style);

        if(key.indexOf('.') > -1){``
            let keyObj = key.split('.');
            this.hostObject[keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.hostObject[key] = value;
        }

        if(key.indexOf('color') > -1){
            this.setColorValue();
        }
        else{
            this.updateHostObject();
        }
    }

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-theme',
            theme: this.hostObject
        });
    }

}