import { AddonData } from "@pepperi-addons/papi-sdk";

export const SURVEYS_TABLE_NAME = 'MySurveys';
export const SURVEYS_BASE_TABLE_NAME = 'surveys'; // 'baseSurveys'
export const SURVEY_TEMPLATES_TABLE_NAME = 'MySurveyTemplates';
export const SURVEY_TEMPLATES_BASE_TABLE_NAME = 'survey_templates'; // 'baseSurveyTemplates'
export const DRAFT_SURVEY_TEMPLATES_TABLE_NAME = 'SurveyTemplatesDrafts';

export const RESOURCE_NAME_PROPERTY = 'ResourceName';

// **********************************************************************************************
//                          Client & User events const
// **********************************************************************************************
export const CLIENT_ACTION_ON_CLIENT_HEADER_LOAD = 'OnClientHeaderLoad';
export const USER_ACTION_ON_HEADER_DATA_LOAD = 'OnHeaderDataLoad';
export const USER_ACTION_ON_HEADER_VIEW_LOAD = 'OnHeaderViewLoad';

// **********************************************************************************************


export interface HeaderTemplate extends AddonData {
    Name: string;
    Description?: string;
    Hidden: boolean;
    Menu?: any// TODO - CHANGE TO MENU OBJECT ARRAY
    Buttons?: any // TODO - CHANGE TO BUTTONS OBJECT ARRAY
}

export interface HeaderTemplateRowProjection {
    Key?: string,
    Name?: string,
    Description?: string,
    Hidden: boolean,
    Draft: boolean
    Published: boolean,
    ModificationDate?: string
}
