import { PapiClient, FindOptions, DataView } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { v4 as uuid } from 'uuid';
import { DRAFTS_HEADERS_TABLE_NAME, PUBLISHED_HEADERS_TABLE_NAME } from '../../shared';

export interface IHeaderData {
    Key?: string;
    name: string;
    description: string;
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


    /***********************************************************************************************/
    /*                                  Private functions
    /***********************************************************************************************/


    private getHeadersDataViews(): Promise<DataView[]> {
        const res = this.papiClient.metaData.dataViews.find({
            where: `Context.Name='Headers'`
            //where: `Context.Name='Slugs'`
        });
        return res;
    }

    private getSlugsDataViews(): Promise<DataView[]> {
        const res = this.papiClient.metaData.dataViews.find({
            where: `Context.Name='Slugs'`
        });

        return res;
    }

    private async upsertSlugDataView(dataView): Promise<DataView> {
        return await this.papiClient.metaData.dataViews.upsert(dataView);
    }

    private async getDIMXResult(body: any, isImport: boolean): Promise<any> {
        if (body.DIMXObjects?.length > 0) {
                    if(isImport){
                        const dimxObject = body.DIMXObjects[0];
                        if(dimxObject){
                            // check if need to update or to insert new header to the table
                            const headerKey = dimxObject.Object['Key'] || null; 
                            dimxObject.Object['Key'] = headerKey || uuid();
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
            Hidden: header.Hidden || false, 
            draft: header.draft || true,
            published: header.published || false,
            menu: header.menu || [],
            buttons: header.buttons || []
        };
    }

    /***********************************************************************************************/
    /*                                  Public functions
    /***********************************************************************************************/

    async getHeaders(options: FindOptions | undefined = undefined) {
        return await this.papiClient.addons.data.uuid(this.addonUUID).table(DRAFTS_HEADERS_TABLE_NAME).find(options) as IHeaderData[];
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
                await this.papiClient.addons.data.uuid(this.addonUUID).table(DRAFTS_HEADERS_TABLE_NAME).upsert(headerToUpsert);
                draftDeleted = true;
            } catch (e) {
                draftExceptionMessage = e;
            }
    
            try {
                // delete from publish only when header allready published
                if(headerToUpsert.published == true){
                    await this.papiClient.addons.data.uuid(this.addonUUID).table(PUBLISHED_HEADERS_TABLE_NAME).upsert(headerToUpsert);
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
            
            let upsertExceptionMessage;
            let draftHeader;
            let publishHeader;

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

                        try { // upsert to draft table
                            draftHeader = await this.papiClient.addons.data.uuid(this.addonUUID).table(DRAFTS_HEADERS_TABLE_NAME).upsert(headerToUpsert);
                            // upsert to publish table if need to
                            if(headerToUpsert.published){
                            publishHeader =  await this.papiClient.addons.data.uuid(this.addonUUID).table(PUBLISHED_HEADERS_TABLE_NAME).upsert(headerToUpsert);
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
                try { // upsert to draft table
                        draftHeader = await this.papiClient.addons.data.uuid(this.addonUUID).table(DRAFTS_HEADERS_TABLE_NAME).upsert(headerToUpsert);
                        // upsert to publish table if need to
                        if(headerToUpsert.published){
                            publishHeader =  await this.papiClient.addons.data.uuid(this.addonUUID).table(PUBLISHED_HEADERS_TABLE_NAME).upsert(headerToUpsert);
                        }
                } 
                catch (e) {
                            upsertExceptionMessage = e;
                }
                return{
                            success: upsertExceptionMessage == null || undefined,
                            body: { draft: draftHeader, publish: publishHeader }
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

   /**********   MAPPING TAB *******************/

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

        // wait for results and return them as object.
        const arr = await Promise.all(dataPromises).then(res => res);
        
        return {
            dataViews: arr[0],
            profiles: arr[1].map(profile => { return { id: profile.InternalID.toString(), name: profile.Name } })
        }
    }

    async getMappedHeaders() {
        const mappedHeaders: any[] = [];
        const dataViews = await this.getHeadersDataViews();

        if (dataViews?.length === 1) {
            const dataView = dataViews[0];
  
            if (dataView && dataView.Fields) {
                for (let index = 0; index < dataView.Fields.length; index++) {
                    const field = dataView.Fields[index];
                    mappedHeaders.push({
                        header: field.FieldID,
                        key: field.Title
                    });
                }
            }
        }

        return mappedHeaders;
    }

    async deleteHeaderFromSlugMappings(body: any): Promise<void> {
        const obj = body?.Message?.ModifiedObjects[0];
        console.log(`obj - ${obj}`);
        
        if (obj) {
            // If the field id is hidden AND the value is true (this slug is deleted)
            if (obj.ModifiedFields?.filter(field => field.FieldID === 'Hidden' && field.NewValue === true)) {
                console.log(`obj.ObjectKey - ${obj.ObjectKey}`);

                const header = await this.papiClient.addons.data.uuid(this.addonUUID).table(PUBLISHED_HEADERS_TABLE_NAME).key(obj.ObjectKey).get() as IHeaderData;
                
                console.log(`header - ${JSON.stringify(header)}`);

                if (header) {
                    // Get all mapped slugs (from all the roles) and remove the deleted slug from the list.
                    const slugsDataViews = await this.getSlugsDataViews();
                    
                    for (let index = 0; index < slugsDataViews.length; index++) {
                        const dataView = slugsDataViews[index];
                        
                        // Delete the mapped slug from list.
                        let shouldUpdate = false;
                        if (dataView && dataView.Fields) {
                            console.log(`dataView before - ${JSON.stringify(dataView)}`);

                            for (let fieldIndex = 0; fieldIndex < dataView.Fields.length; fieldIndex++) {
                                const field = dataView.Fields[fieldIndex];

                                // If the key is the same as the deleted header, remove it from the list.
                                if (field.Title === header.Key) {
                                    dataView.Fields.splice(fieldIndex, 1);
                                    shouldUpdate = true;
                                    break;
                                }
                            }

                            console.log(`dataView after - ${JSON.stringify(dataView)}`);
                        }

                        // Update the list of mapped slugs.
                        if (shouldUpdate) {
                            this.upsertSlugDataView(dataView);
                        }
                    }
                }
            }
        }
    }
}

export default HeaderService;