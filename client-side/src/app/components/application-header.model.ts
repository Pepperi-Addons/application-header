import { Injectable, Optional } from "@angular/core";

export type ThemeColor = 'system-primary' | 'invert' | 'user-primary' | 'success' | 'caution' | 'system' ;

export interface HeaderTemplateRowProjection {
    Key?: string;
    Name?: string;
    Description?: string;
    Active: boolean;
    Draft: boolean;
    Published: boolean;
    ModificationDate?: string;
}

export class Dimensions {
    useFullWidth: boolean = true;
    maxWidth: string = '960';
    padding: string = 'md';
    height: string = 'sm'
}

export class General {
    name: string = '';
    description: string = '';
}

export class HeaderColor {
    themeColor: ThemeColor = 'system';
    useCustomColor: boolean = false;
    customBackgroundColor: string = 'hsl(204, 99%, 40%)';
    customFontColor: string = ''
}

export class Design {
    headerColor: HeaderColor = new HeaderColor();
    dimensions: Dimensions = new Dimensions();
    
}

export class HeaderData {
    general: General = new General();
    design: Design = new Design();
}

export enum THEME_COLORS {
    Primary = "THEME_COLOR.PRIMARY",
    Primary_Weak = 'THEME_COLOR.PRIMARY_WEAK',
    Secondary = 'THEME_COLOR.SECONDARY',
    Secondary_Weak = 'THEME_COLOR.SECONDARY_WEAK',
    System = "THEME_COLOR.SYSTEM",
    System_Weak = "THEME_COLOR.SYSTEM_WEAK",
    System_Invert = "THEME_COLOR.SYSTEM_INVERT"
}
export enum FONTS_COLORS {
    System = "FONTS_COLOR.SYSTEM",
    System_Invert = 'FONTS_COLOR.SYSTEM_INVERT'
}