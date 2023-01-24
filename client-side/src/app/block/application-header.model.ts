
export type ThemeColor = 'system-primary' | 'invert' | 'user-primary' | 'success' | 'caution' | 'system' ;

export class General {
    name: string = '';
    description: string = '';
}

export class Design {
    themeColor: ThemeColor = 'system';
    useCustomColor: boolean = false;
    customBackgroundColor: string = '';
    customFontColor: string = '';
}

export class HeaderData {
    general: General = new General();
    design: Design = new Design();
}