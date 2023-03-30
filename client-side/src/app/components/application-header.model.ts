export type ButtonType = 'Button' | 'Group';

export const TABLE_NAME = 'AppHeaders';
export const TABLE_NAME_DRAFTS = TABLE_NAME + 'Drafts';

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
    HeaderConfig?: {};
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

    constructor(id = undefined,title = '',hirachylevel = 0 ,script = undefined, key = null, type = 'Button', visible = true, enabled = true){
        this.ID = id;
        this.Title = title;
        this.HierarchyLevel = hirachylevel;
        this.Script = script;
        this.Visible = visible;
        this.Enabled = enabled;

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

    constructor(title = '', fieldID = '', visible = true){
        this.Title = title;
        this.FieldID = fieldID;
        this.Visible = visible;
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
