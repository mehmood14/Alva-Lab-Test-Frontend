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

  withdraw: boolean = false;
  deposit: boolean = false;

  transaction_amount: number = 0;
  total_balance!: number;

  transaction_account_id: string = 'abc';
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
          this.transactions_data = res.data;
        }
      },
      (error) => {
        this.alertService.danger(error);
      }
    );
  }

  getBalance(id: string) {
    this.allService.getAccountById(id).subscribe(
      (res: any) => {
        if (res.success == false) {
          this.alertService.warning('Something went wrong');
        } else {
          this.total_balance = res.data.balance;
        }
      },
      (error) => {
        this.alertService.danger(error);
      }
    );
  }

  onSubmit() {
    this.overAllTransactions();
    this.transaction_amount = this.transactionForm.value.amount;
    this.transaction_account_id = this.transactionForm.value.account_id;

    this.allService.addTransactions(this.transactionForm.value).subscribe(
      (res: any) => {
        if (res.success == false) {
          this.alertService.warning('Something went wrong');
        } else {
          this.alertService.success('Transaction completed successfully.');
          if (this.transaction_amount > 0) {
            this.deposit = true;
            this.withdraw = false;
          } else {
            this.deposit = false;
            this.withdraw = true;
          }
          this.getBalance(this.transaction_account_id);
          this.transactionForm.reset();
        }
      },
      (error) => {
        this.alertService.danger(error.error.message);
      }
    );
  }

  clearForm() {
    this.transactionForm.reset();
  }
}
