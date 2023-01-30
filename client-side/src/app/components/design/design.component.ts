import { Component, OnInit, Injectable, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { THEME_COLORS, Design, FONTS_COLORS } from '../application-header.model';

@Component({
    selector: 'design-tab',
    templateUrl: './design.component.html',
    styleUrls: ['./design.component.scss']
})

@Injectable()
export class DesignComponent implements OnInit {
    readonly TRANSLATION_PREFIX_KEY = 'DESIGN';

    public themeColorsOptions = [];
    public textColorsOptions = [];
    
    @Input() design: Design;
    @Output() designTabChanges: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,) {
       
    }
    
    ngOnInit(): void {
        this.translate.get('HEADER_TITLE').toPromise().finally(
            () => {
                this.initOptions();
            });
    }

    initOptions() {
        this.themeColorsOptions = Object.keys(THEME_COLORS).map((key) => {
            return {
                key: THEME_COLORS[key],
                value: this.translate.instant(this.TRANSLATION_PREFIX_KEY + '.' + THEME_COLORS[key])};
        });

        this.textColorsOptions = Object.keys(FONTS_COLORS).map((key) => {
            return {
                key: FONTS_COLORS[key],
                value: this.translate.instant(this.TRANSLATION_PREFIX_KEY + '.' + FONTS_COLORS[key])};
        });
    }

    onHeaderKeyChange(event: any, key: string): void {
        const keyArr = key.split('.');
        this.design[keyArr[0]][keyArr[1]] = event;
        
        this.designTabChanges.emit(this.design);
    }
}