import { PapiClient, InstalledAddon, FindOptions, Page, DataView, Relation } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { v4 as uuid } from 'uuid';
import { resolve } from 'dns';

const TABLE_NAME_DRAFTS = 'AppHeadersDrafts';
const TABLE_NAME = 'AppHeaders';

export interface IHeaderData {
    Key?: string;
    name: string;
    description: string;
    headerConfig: {};
    Hidden?: boolean;
    draft: boolean;
    published: boolean;
    menu: any; // TODO - SET THE TYPE
    buttons: any; // TODO - SET THE TYPE
}

export class HeaderService {

    options : FindOptions | undefined;
    papiClient: PapiClient;
    addonUUID: string;

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });

        this.addonUUID = client.AddonUUID;
    }

    async getHeaders(options: FindOptions | undefined = undefined) {
        return await this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME_DRAFTS).find(options) as IHeaderData[];
    }

    async upsertHeader(body) {
        const headersList = await this.getHeaders({ where : 'Hidden=false'});
        const headerToUpsert = this.getBody(body);
        if(body.Hidden) {

            let draftDeleted = false;
            let draftExceptionMessage;
            
            let publishDeleted = false;
            let publishExceptionMessage;
            
            try { // delete from draft table
                await this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME_DRAFTS).upsert(headerToUpsert);
                draftDeleted = true;
            } catch (e) {
                draftExceptionMessage = e;
            }
    
            try {
                // delete from publish only when header allready published
                if(headerToUpsert.published == true){
                    await this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME).upsert(headerToUpsert);
                }
                publishDeleted = true;

            } catch (e) {
                publishExceptionMessage = e;
            }

            if (!draftDeleted) {
                throw new Error(`${draftExceptionMessage}`);
            }
            if (!publishDeleted) {
                throw new Error(`${publishExceptionMessage}`);
            }

            return {
                success: (draftDeleted && publishDeleted)
            }
        }
        else {

            if(headerToUpsert.name === ''){
                throw new Error(`Header Name field can't be empty.`);  
            }
            

            // Add new header 
            if(headerToUpsert.Key === null){

                // get list of headers & filter by name field
                let tmpList = headersList.filter((header) => {
                    return header.name == headerToUpsert.name;
                });

            // check if header is allready exits , 0 means not so create new one
                if(tmpList.length === 0){
                        // Limit the num of headers to 50 
                        if( headersList.length >= 50){
                            return {
                                success: false,
                                message: 'The number of header limit has been reached'
                            }
                        }
                        // add Key if need ( for create new )
                        headerToUpsert.Key = uuid();
                        
                        let upsertExceptionMessage;
                        let draftHeader;
                        let publishHeader;

                        try { // upsert to draft table
                            draftHeader = await this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME_DRAFTS).upsert(headerToUpsert);
                            // upsert to publish table if need to
                            if(headerToUpsert.published){
                            publishHeader =  await this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME).upsert(headerToUpsert);
                            }
                        } catch (e) {
                            upsertExceptionMessage = e;
                        }

                        // create new header
                        return {
                            success: upsertExceptionMessage == null || undefined,
                            body: { draft: draftHeader, publish: publishHeader }
                        }
                }
                else{
                    return {
                            success: false,
                            message: `Header ${headerToUpsert.name} already exists`
                    }
                }
            }
            else {
                // Update header
                return {
                    success: true,
                    body: await this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME_DRAFTS).upsert(headerToUpsert)
                }
            } 
        }
    }

    async duplicateHeader(body){
        
        const header = (await this.getHeaders({ where : `Key="${body.headerUUID}"`}))[0] || null;

        if(header){
            header.name = `${header.name} copy`;
            header.published = false; // duplicate will create only draft header
            delete header.Key; // delete the key and upsert like new header
            return await this.upsertHeader(header);
        }
    }

    async deleteHeader(body){
        
        const header = (await this.getHeaders({ where : `Key="${body.headerUUID}"`}))[0] || null;

        if(header){
            header.Hidden = true;
            return await this.upsertHeader(header);
        }
    }

    getHeadersList(query: string = '') {
        let addonURL = `/addons/data/${this.addonUUID}/Headers` + query;
                
        return this.papiClient.get(encodeURI(addonURL)); 
    }

    async exportHeader(body){
        const res = await this.getDIMXResult(body, false);
        return res;
    }

    async importHeader(body){
        const res = await this.getDIMXResult(body, true);
        return res;
    }

    private async getDIMXResult(body: any, isImport: boolean): Promise<any> {
        // Validate the pages.
        if (body.DIMXObjects?.length > 0) {
           
            for (let index = 0; index < body.DIMXObjects.length; index++) {
                const dimxObject = body.DIMXObjects[index];
                try {
                    if(!isImport){
                        dimxObject['Key'] = null;
                        delete dimxObject['Key'];
                    }    
                } catch (err) {
                    // Set the error on the page.
                    dimxObject['Status'] = 'Error';
                    dimxObject['Details'] = err;
                }
            }
        }
        
        return body;
    }
    private getBody(header): IHeaderData {
        return {
            Key: header.Key || null,
            name: header.name || '',
            description: header.description || '',
            headerConfig: header || {},
            Hidden: header.Hidden || false, 
            draft: header.draft || true,
            published: header.published || false,
            menu: header.menu || [],
            buttons: header.buttons || []
        };
    }


    private getHeadersDataViews(): Promise<DataView[]> {
        const res = this.papiClient.metaData.dataViews.find({
            where: `Context.Name='Headers'`
        });

        return res;
    }
    
    async getHeadersDataViewsData() {
        const dataPromises: Promise<any>[] = [];

        // Get the headers dataviews
        // const dataViews = await this.papiClient.metaData.dataViews.find({
        //     where: `Context.Name='Headers'`
        // });
        dataPromises.push(this.getHeadersDataViews());

        // Get the profiles
        // const profiles = await this.papiClient.profiles.find();
        dataPromises.push(this.papiClient.profiles.find());

        // Get the pages
        // const pages: Page[] = await this.papiClient.pages.find();
        dataPromises.push(this.papiClient.pages.find());
        
        // wait for results and return them as object.
        const arr = await Promise.all(dataPromises).then(res => res);
        
        return {
            dataViews: arr[0],
            profiles: arr[1].map(profile => { return { id: profile.InternalID.toString(), name: profile.Name } }),
            pages: arr[2].map(page => { return { key: page.Key, name: page.Name } }), // Return projection of key & name
        }
    }

    async getMappedSlugs() {
        const mappedSlugs: any[] = [];
        const dataViews = await this.getHeadersDataViews();

        if (dataViews?.length === 1) {
            const dataView = dataViews[0];

            if (dataView && dataView.Fields) {
                for (let index = 0; index < dataView.Fields.length; index++) {
                    const field = dataView.Fields[index];
                    mappedSlugs.push({
                        slug: field.FieldID,
                        pageKey: field.Title
                    });
                }
            }
        }

        return mappedSlugs;
    }
}

export default HeaderService;