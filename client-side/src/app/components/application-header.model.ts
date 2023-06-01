import { PepColorService, PepSizeType, PepStyleType } from "@pepperi-addons/ngx-lib";
import { max } from "moment";
import { PepShadowSettings} from "@pepperi-addons/ngx-composite-lib/shadow-settings";
import { PepColorSettings } from "@pepperi-addons/ngx-composite-lib/color-settings";

export type MenuItemType = 'Button' | 'Group' | 'Seperator';
export const PUBLISHED_HEADERS_TABLE_NAME = 'appHeaders';
export const DRAFTS_HEADERS_TABLE_NAME = 'appHeadersDrafts';

export interface ButtonIcon {
    Type: string;
    Name: string;
}

export interface ButtonBadge {
    Visible: boolean;
    Title: string;
}

export interface HeaderTemplateRowProjection {
    Key?: string;
    Name?: string;
    Description?: string;
    Draft: boolean;
    Published: boolean;
    Hidden: boolean;
    ModificationDate?: string;
}

export class GeneralData {
    name: string;
    description: string;

    constructor(name: string = '', description: string = ''){
        this.name = name;
        this.description = description;
    }
}


export class MenuItem {
    HierarchyLevel: number;
    Key?: string;
    Type?: MenuItemType;
    Title?: string;
    Visible: boolean;
    Enabled: boolean;
    Items?: Array<MenuItem>;

    constructor(title = '',hirachylevel = 0 , key = null, type: MenuItemType = 'Button', visible = true, enabled = true, items = []){
        this.Title = title;
        this.HierarchyLevel = hirachylevel;
        this.Key = key;
        this.Visible = visible;
        this.Enabled = enabled;
        this.Type = type;
        this.Items = items;

    }
}

export class Button {
    Title: string;
    FieldID: string;
    Key: string = ''; // When the button is pressed use this key in the OnClientAppHeaderButtonClicked
    Type: string;
    Icon?: ButtonIcon; // The Button icon
    Badge?: ButtonBadge; // The Button badge
    Visible: boolean = true; // Whether to show the button

    constructor(title = '', fieldID = '', visible = true, icon = null, key = '', type = '' ){
        this.Title = title;
        this.FieldID = fieldID;
        this.Visible = visible;
        this.Icon = icon;
        this.Key = key;
        this.Type = type;
    }
}

export class HeaderData {
    Key?: string;
    Name: string = '';
    Description?: string = '';
    Hidden: boolean;
    Draft: boolean;
    Published: boolean;
    ModificationDate: string;
    Menu?: Array<MenuItem> = [];
    Buttons?: Array<Button> = [];
}

export class themeColor{
    color : string;
    style: PepStyleType;

    constructor(color = 'system_invert', style: PepStyleType = 'weak'){
        this.color = color;
        this.style = style;
    }
}

// export class themeDimensions{
//     useFullWidth: boolean;
//     maxWidth: number;
//     padding: PepSizeType;
//     height: PepSizeType;

//     constructor(useFullWidth = true, maxWidth = 0, padding: PepSizeType  = 'sm' , height: PepSizeType = 'sm' ){
//         this.useFullWidth = useFullWidth;
//         this.maxWidth = maxWidth;
//         this.padding = padding;
//         this.height = height;
//     }
// }

export class appHeaderTheme {
    color: themeColor = new themeColor();  
    // dimensions: themeDimensions = new themeDimensions();
    shadow: PepShadowSettings = new PepShadowSettings(false,'md','hard');
    bottomBorder: PepColorSettings = new PepColorSettings(false,'system',1);
}
