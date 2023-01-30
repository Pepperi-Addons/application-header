import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralComponent } from '../components/general/general.component';
import { DesignComponent } from '../components/design/design.component';
import { HeaderData } from '../components/application-header.model';

@Component({
    selector: 'page-block',
    templateUrl: './application-header.component.html',
    styleUrls: ['./application-header.component.scss'],
    providers: [GeneralComponent, DesignComponent]
})
export class ApplicationHeaderComponent implements OnInit {
    
    headerData : HeaderData = new HeaderData();

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.headerData = new HeaderData();
    }

    onDesignChanged(event: any){
       this.headerData.design = event;
    }

    ngOnChanges(e: any): void {

    }

    tabClick(event: any){

    }
}
