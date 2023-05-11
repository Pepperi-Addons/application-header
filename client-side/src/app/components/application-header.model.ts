import { PepColorService, PepSizeType, PepStyleType } from "@pepperi-addons/ngx-lib";
import { max } from "moment";
import { PepShadowSettings} from "@pepperi-addons/ngx-composite-lib/shadow-settings";
import { PepColorSettings } from "@pepperi-addons/ngx-composite-lib/color-settings";

export type ButtonType = 'Button' | 'Group';

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
    ID?: number;
    HierarchyLevel: number;
    Script?: any;
    Key?: string;
    Type?: ButtonType;
    Title?: string;
    Visible: boolean;
    Enabled: boolean;
    Items?: Array<MenuItem>;

    constructor(id = undefined,title = '',hirachylevel = 0 ,script = undefined, key = null, type: ButtonType = 'Button', visible = true, enabled = true, items = []){
        this.ID = id;
        this.Title = title;
        this.HierarchyLevel = hirachylevel;
        this.Script = script;
        this.Visible = visible;
        this.Enabled = enabled;
        this.Type = type;
        this.Items = items;

    }
}

export class Button {
    ID?: number;
    Title: string;
    FieldID: string;
    ButtonKey?: string = ''; // When the button is pressed use this key in the OnClientAppHeaderButtonClicked
    Icon?: ButtonIcon; // The Button icon
    Badge?: ButtonBadge; // The Button badge
    Visible: boolean = true; // Whether to show the button

    constructor(title = '', fieldID = '', visible = true, icon = null, buttonKey = '' ){
        this.Title = title;
        this.FieldID = fieldID;
        this.Visible = visible;
        this.Icon = icon;
        this.ButtonKey = buttonKey;
    }
}

export class HeaderData {
    Key?: string;
    name: string = '';
    description?: string = '';
    Hidden: boolean;
    draft: boolean;
    published: boolean;
    modificationDate: string;
    menu?: Array<MenuItem> = [];
    buttons?: Array<Button> = [];
}

export class themeColor{
    color : string;
    style: PepStyleType;

    constructor(color = 'system_invert', style: PepStyleType = 'weak'){
        this.color = color;
        this.style = style;
    }
}

export class themeDimensions{
    useFullWidth: boolean;
    maxWidth: number;
    padding: PepSizeType;
    height: PepSizeType;

    constructor(useFullWidth = true, maxWidth = 0, padding: PepSizeType  = 'sm' , height: PepSizeType = 'sm' ){
        this.useFullWidth = useFullWidth;
        this.maxWidth = maxWidth;
        this.padding = padding;
        this.height = height;
    }
}

export class appHeaderTheme {
    logoSrc: string = '';
    color: themeColor = new themeColor();  
    dimensions: themeDimensions = new themeDimensions();
    shadow: PepShadowSettings = new PepShadowSettings(false,'md','soft');
    bottomBorder: PepColorSettings = new PepColorSettings(false,'system',50);
}
