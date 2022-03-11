import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { ApiService } from 'src/app/core/service/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  transactionForm!: FormGroup;

  amount: FormControl = new FormControl('', [Validators.required]);
  account_id: FormControl = new FormControl('', [Validators.required]);
  transactions_data = [];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private allService: ApiService
  ) {}

  ngOnInit(): void {
    this.form();
    this.overAllTransactions();
  }

  form() {
    this.transactionForm = this.formBuilder.group({
      amount: this.amount,
      account_id: this.account_id,
    });
  }

  overAllTransactions() {
    this.allService.getTransactions().subscribe(
      (res: any) => {
        if (res.success == false) {
          this.alertService.warning('Something went wrong');
        } else {
          this.transactions_data = res;
        }
      },
      (error) => {
        this.alertService.danger(error);
      }
    );
  }

  onSubmit() {
    this.allService.addTransactions(this.transactionForm.value).subscribe(
      (res: any) => {
        if (res.success == false) {
          this.alertService.warning('Something went wrong');
        } else {
          this.alertService.success('Transaction completed successfully.');

          this.transactionForm.reset();
        }
      },
      (error) => {
        this.alertService.danger(error);
      }
    );
  }

  clearForm() {}
}
