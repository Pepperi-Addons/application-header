import { PapiClient, InstalledAddon, Relation, AddonDataScheme, Subscription } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { DRAFTS_HEADERS_TABLE_NAME, PUBLISHED_HEADERS_TABLE_NAME } from 'shared';

export class RelationsService {

    private papiClient: PapiClient;
    private bundleFileName = '';

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
        
        this.bundleFileName = `file_${this.client.AddonUUID}`;
    }
    
    // For page block template
    private async upsertRelation(relation): Promise<any> {
        return await this.papiClient.post('/addons/data/relations', relation);
    }
/*
 RelationName: "SettingsBlock",
            GroupName: 'BrandedApp',
            SlugName: 'themes',
            Name: "Themes",
            Description: 'Themes editor',
*/
    private getCommonRelationProperties(
        relationName: 'SettingsBlock' | 'PageBlock' | 'AddonBlock', 
        blockRelationName: string,
        blockRelationDescription: string,
        blockName: string
    ): Relation {
        return {
            RelationName: relationName,
            Name: blockRelationName,
            Description: blockRelationDescription,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `${blockName}Component`, // This is should be the block component name (from the client-side)
            ModuleName: `${blockName}Module`, // This is should be the block module name (from the client-side)
            ElementsModule: 'WebComponents',
            ElementName: `${blockName.toLocaleLowerCase()}-element-${this.client.AddonUUID}`,
        };
    }
    async createTablesSchemes(): Promise<AddonDataScheme[]> {
        const promises: AddonDataScheme[] = [];
        try {
            const DIMXSchema = {
                    Blocks: {
                        Type: "Array",
                        Items: {
                            Type: "Object",
                            Fields: {
                                Configuration: {
                                    Type: "Object"
                                }
                            }
                        }
                    },
            };

            // Create headers table
            const createHeadersTable = await this.papiClient.addons.data.schemes.post({
                Name: PUBLISHED_HEADERS_TABLE_NAME,
                Type: 'data',
                SyncData: {
                    Sync: true
                }
            });

            // Create headers draft table
            const createHeadersDraftTable = await this.papiClient.addons.data.schemes.post({
                Name: DRAFTS_HEADERS_TABLE_NAME,
                Type: 'data',
                SyncData: {
                    Sync: true
                },
                Fields: DIMXSchema as any // Declare the schema for the import & export.
            });
        
            promises.push(createHeadersTable);
            promises.push(createHeadersDraftTable);
            //promises.push(createPagesVariablesTable);
            return Promise.all(promises);
                
        } catch (err) {
            throw new Error(`Failed to create Headers ADAL Tables. error - ${err}`);
        }
    }

    async upsertRelations() {
        await this.upsertImportRelation();
        await this.upsertExportRelation();
        await this.upsertAddonBlockRelation();
        await this.upsertSettingsRelation();
        await this.upsertThemeTabsRelation();
    }

    private async upsertThemeTabsRelation() {
        const blockName = 'Themeheader';

        const blockRelation: Relation = {
            RelationName: 'ThemeTabs',
            Name: 'ApplicationHeader',
            Description: 'Application Header',
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `${blockName}Component`, // This is should be the block component name (from the client-side)
            ModuleName: `${blockName}Module`, // This is should be the block module name (from the client-side)
            ElementsModule: 'WebComponents',
            ElementName: `theme-header-element-${this.client.AddonUUID}`,
            OnPublishEndpoint: 'api/on_publish',
        };

        return await this.upsertRelation(blockRelation);
    }

    private upsertAddonBlockRelation() {
        const name = 'Application Header';
        const blockName = 'ApplicationHeader';

        const addonBlockRelation: Relation = {
            RelationName: "AddonBlock",
            Name: name,
            Description: `${name} addon`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `${blockName}Component`,
            ModuleName: `${blockName}Module`,
            ElementsModule: 'WebComponents',
            ElementName: `pages-element-${this.client.AddonUUID}`,
        }; 
        
        this.upsertRelation(addonBlockRelation);
    }

    private upsertSettingsRelation() {
        const settingsName = 'Settings';
        const name = 'Application Header';

        const settingsBlockRelation: Relation = {
            RelationName: "ApplicationHeader",
            GroupName: 'Pages',
            SlugName: 'application_header',
            Name: name,
            Description: 'Header customization',
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `${settingsName}Component`,
            ModuleName: `${settingsName}Module`,
            ElementsModule: 'WebComponents',
            ElementName: `settings-element-${this.client.AddonUUID}`,
        }; 
        
        this.upsertRelation(settingsBlockRelation);
    }

    /***********************************************************************************************/
    //                              Import & Export functions
    /************************************************************************************************/
    
    private upsertImportRelation(): void {
        const importRelation: Relation = {
            RelationName: 'DataImportResource',
            Name: DRAFTS_HEADERS_TABLE_NAME,
            Description: 'Application header import',
            Type: 'AddonAPI',
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: '/api/header_import',
            MappingRelativeURL: ''// '/internal_api/draft_pages_import_mapping', // '/api/pages_import_mapping',
        };                

        this.upsertRelation(importRelation);
    }

    private upsertExportRelation(): void {
        const exportRelation: Relation = {
            RelationName: 'DataExportResource',
            Name: DRAFTS_HEADERS_TABLE_NAME,
            Description: 'Application header export',
            Type: 'AddonAPI',
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: '/api/header_export'
        };                

        this.upsertRelation(exportRelation);
    }


    /***********************************************************************************************/
    /*                                  PNS functions
    /***********************************************************************************************/

    async subscribeDeleteHeader(key: string, functionPath: string): Promise<Subscription> {
        return await this.papiClient.notification.subscriptions.upsert({
            Key: key,
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: functionPath,
            Type: 'data',
            Name: key,
            FilterPolicy: {
                Action: ['update'],
                ModifiedFields: ['Hidden'],
                Resource: [PUBLISHED_HEADERS_TABLE_NAME],
                AddonUUID: [this.client.AddonUUID]
            }
        });
    }
         
    async unsubscribeDeleteHeader(key: string, functionPath: string): Promise<Subscription> {
        return await this.papiClient.notification.subscriptions.upsert({
            Hidden: true,
            Key: key,
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: functionPath,
            Type: 'data',
            Name: key,
            FilterPolicy: {}
        });
    }
}