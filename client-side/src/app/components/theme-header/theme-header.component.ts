import { Component, OnInit, Injectable, Input, Output, EventEmitter, ViewContainerRef, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { TranslateService } from '@ngx-translate/core';
import { appHeaderTheme } from '../application-header.model';
import { firstValueFrom } from 'rxjs';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { AppHeadersService } from '../../services/headers.service'
import { PepCustomizationService } from '@pepperi-addons/ngx-lib';

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
    buttomBorderColor: Array<groupButtonArray> = [];
    headerStyle:  Array<groupButtonArray> = [];
    shadowIntensity:  Array<PepButton> = []; 

    constructor(private translate: TranslateService, 
                private addonBlockLoaderService: PepAddonBlockLoaderService, 
                private appHeadersService: AppHeadersService,
                private viewContainerRef: ViewContainerRef, 
                private customizationService: PepCustomizationService,
                private renderer: Renderer2) {
       
    }
    
    async ngOnInit(): Promise<void> {

        const system = await this.translate.get('THEME.COLOR.TYPE.SYSTEM').toPromise();
        this.headerColor = [  
            { key: 'legacy', value: this.translate.instant('THEME.COLOR.TYPE.HEADER') },
            { key: 'system-primary', value: this.translate.instant('THEME.COLOR.TYPE.SYSTEM') },
            { key: 'system-primary-invert', value: this.translate.instant('THEME.COLOR.TYPE.SYSTEM_INVERT') },
            { key: 'user-primary', value: this.translate.instant('THEME.COLOR.TYPE.PRIMARY') },
            { key: 'user-secondary', value: this.translate.instant('THEME.COLOR.TYPE.SECONDARY') }
        ];

        this.buttomBorderColor = [  
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

    async setColorValue(){
        if(this.hostObject.color?.color !== 'legacy'){
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
        else{
            //need to get legacy color
            const theme = await this.appHeadersService.getThemes();
            if(theme){
                this.hostObject.color.colorValue = theme['header']?.userLegacyColor;
                this.updateHostObject();  
            }
        }
    }
    onHeaderFieldChange(key, event){
 
       const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
       
      // this.renderer.removeClass(this.colorExample.nativeElement,this.hostObject.color.color);
       //this.renderer.removeClass(this.colorExample.nativeElement,this.hostObject.color.style);
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

         //set css varaiables for preview
        const themeVariables = {};

        if (this.hostObject.color.color == 'legacy') {
            themeVariables[PepCustomizationService.COLOR_TOP_HEADER_KEY + '-h'] = '';
            themeVariables[PepCustomizationService.COLOR_TOP_HEADER_KEY + '-s'] = '';
            themeVariables[PepCustomizationService.COLOR_TOP_HEADER_KEY + '-l'] = '';
        } else {
            this.setStyleButtonColor(themeVariables, PepCustomizationService.COLOR_TOP_HEADER_KEY,
                this.hostObject.color.color, true);
        }

        themeVariables[PepCustomizationService.STYLE_TOP_HEADER_KEY] = this.hostObject.color.style;

        this.customizationService.setThemeVariables(themeVariables);
    }

    setStyleButtonColor(themeVariables, colorKey, wantedColor, useSecondaryColor) {
        let referenceColorKey = PepCustomizationService.COLOR_SYSTEM_PRIMARY_KEY;

        if (wantedColor === 'system-primary') {
            referenceColorKey = PepCustomizationService.COLOR_SYSTEM_PRIMARY_KEY;
        } else if (wantedColor === 'system-primary-invert') {
            referenceColorKey = PepCustomizationService.COLOR_SYSTEM_PRIMARY_INVERT_KEY;
        } else if (wantedColor === 'user-primary') {
            referenceColorKey = PepCustomizationService.COLOR_USER_PRIMARY_KEY;
        } else if (wantedColor === 'user-secondary') {
            referenceColorKey = PepCustomizationService.COLOR_USER_SECONDARY_KEY;
        }

        themeVariables[colorKey + '-h'] = 'var(' + referenceColorKey + '-h)';
        themeVariables[colorKey + '-s'] = 'var(' + referenceColorKey + '-s)';
        themeVariables[colorKey + '-l'] = 'var(' + referenceColorKey + '-l)';
    }

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-theme',
            theme: this.hostObject
        });
    }

}