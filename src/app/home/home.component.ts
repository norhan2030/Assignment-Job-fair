import { Component , OnInit } from '@angular/core';
import { UserService } from '../user.service';
declare var google:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  customers:any[]=[];
  transactions:any[]=[]
  searchInput: number | string = '';
  filteredCustomerNames: string[] = [];
  filteredTransactionAmount:string []=[]
  result:any []=[];
  FinalResult:any []=[] ;
  newTransactions:any []=[]
  dates:any []=[]
  amounts:any []=[]
  Data:any []=[]
  constructor(private _UserService:UserService){}
  ngOnInit():void{
    google.charts.load('current', {packages: ['corechart']});
    this._UserService.getUsers().subscribe({
      next:(res)=>this.customers = res,
    });
    this._UserService.getTransactions().subscribe({
      next:(res)=>this.transactions = res,

    });
  }
 
  TransactionsById(userId: any): any[] {
    return this.transactions.filter(transaction => transaction.customer_id == userId);
  }
  filterTransactionsByNameOrAmount(): void {
    this.filteredCustomerNames=[]
    this.result=[]
    if( +this.searchInput){
      const searchTerm = +this.searchInput
      this.filteredTransactionAmount = this.transactions
        .filter(transaction => transaction.amount == searchTerm)
        .map(transaction => transaction.customer_id);
      this.filteredTransactionAmount.map(transition =>{
      this.result=this.customers.filter(customer => customer.id == transition).map(transaction => transaction);})
    }else {
      const searchTerm = this.searchInput?.toString().toLowerCase();
      this.filteredCustomerNames = this.customers
        .filter(customer => customer.name?.toLowerCase().includes(searchTerm))
        .map(customer => customer);
    } 
  }
  DisplayData(): any[] {
    console.log(this.filteredCustomerNames)
    if (this.filteredCustomerNames.length!=0) {
      return this.filteredCustomerNames;
    }else if(this.result.length!=0){
      return this.result;
    }
    else if(this.result.length==0 &&this.filteredCustomerNames.length==0 && this.searchInput){
      return [{id: undefined,
        name: "not found"}];
    }
    else{
      return this.customers;
      
    }
  }
  chartById(id:number){
  this.FinalResult=this.customers.filter(customer => customer.id == id).map(transaction => transaction.id)
  this.FinalResult.map(transition =>{
    this.newTransactions=this.transactions
    .filter(customer => customer.customer_id == transition)
    .map(transaction => transaction);})
  this.dates=this.newTransactions.map(transaction=>transaction.date)
  this.amounts=this.newTransactions.map(transaction=>transaction.amount)
  this.Data=this.newTransactions
  google.charts.setOnLoadCallback(this.drawChart(this.newTransactions));
}

drawChart(Data:any []){
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Amount');
  Data.forEach(element => {
    data.addRows([[element.date, element.amount]]);
  });
  
  var options={
    title:"Chart transaction amount per day"
  };
  var chart = new google.visualization.LineChart(document.getElementById('divpiechart'));
  chart.draw(data, options);
}

}
