import { Component, OnInit, TemplateRef } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Page } from '../../../models/page';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-main-page-contracts-list',
  templateUrl: './main-page-contracts-list.component.html',
  styleUrls: ['./main-page-contracts-list.component.css']
})
export class MainPageContractsListComponent implements OnInit {
  contract: Contract;
  contracts: Contract[];
  contractModal: Contract;
  modalRef: BsModalRef;
  page = new Page();
  rows = new Array<Contract>();

  constructor(public contractsService: ContractsService, private modalService: BsModalService, private translate: TranslateService) {
    translate.setDefaultLang('sq');
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.contractModal = new Contract();
    this.contract = new Contract();
  }

  messages = {
    emptyMessage: `
    <div>
        <i class="fa fa-spinner fa-spin"></i>
        <p>Duke shfaqur kontratat</p>
    </div>
  `
  };

  ngOnInit() {
    this.setPage({ offset: 0 });
    $(document).ready(function () {
      $('.datatable-header').css({ 'color': 'white', 'background-color': '#32a6bd' });
      $('.ngx-datatable.bootstrap .datatable-header .datatable-header-cell').css('padding-left', '26px');
      setTimeout(function () {
        $('.datatable-body-row').css({ 'color': '#5f5e5e', 'border': 'none' });
        $('.datatable-body-cell').css('margin-right', '27px');
        $('.ngx-datatable.bootstrap .datatable-body .datatable-body-row').css('width', '1815px');
        $('.ngx-datatable.bootstrap').css('border-radius', '10px');
        $('.ngx-datatable.bootstrap .datatable-body .datatable-body-row .datatable-body-cell').css('padding-left', '14px');
      }, 100);
    });
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.contractsService.serverPaginationLatestContracts(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }

}