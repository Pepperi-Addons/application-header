import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralComponent } from '../components/general/general.component';

@Component({
    selector: 'page-block',
    templateUrl: './application-header.component.html',
    styleUrls: ['./application-header.component.scss'],
    providers: [GeneralComponent]
})
export class ApplicationHeaderComponent implements OnInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(e: any): void {

    }

    tabClick(event: any){

    }
}
