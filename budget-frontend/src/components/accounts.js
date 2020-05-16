class Accounts {
    constructor() {
        this.accounts = ["hello"];
        this.adapter = new BudgetAdapter();
        this.transactions = this.adapter.getTransactions().then(transactions => {
            return transactions;
        });
        this.fetchAndLoadAccounts();
    }

    fetchAndLoadAccounts() {
        this.adapter.getAccounts().then(accounts => {
            const list = document.getElementById("accounts-list");
            for(let account of accounts) {
                console.log(account);
                const div = document.createElement("div");
                div.classList.add("w-full", "hover:bg-indigo-500", "py-3", "text-white", "account");
                div.dataset.id = account.id;
                const p = document.createElement("p");
                p.innerText = account.name;
                p.dataset.id = account.id;
                p.classList.add("account-name", "w-full", "font-bold", "pl-4");
                div.appendChild(p);
                list.appendChild(div);
            }
            this.bindEventListeners();
        });
    }

    bindEventListeners() {
        const list = document.getElementById("accounts-list");
        const accounts = list.querySelectorAll("div");
        for (let account of accounts) {
            account.addEventListener("click", viewAccount);
        }
        // All Accounts 
        document.getElementById("all-accounts").addEventListener("click", viewAccount);
        // Your Budget
        document.getElementById("budget-info").addEventListener("click", refreshCategories);
    }
}

const main = document.getElementById("main");

function refreshCategories() {
    new Categories();
}

function viewAccount() {
    main.innerHTML = "";
    if (event.target.classList.contains("all-accounts")) {
        addAccountTitle("All Accounts");
        fetchAndLoadTransactions();
        return;
    }
    if (event.target.classList.contains("account")) {
        addAccountTitle(event.target.querySelectorAll("p")[0].innerText);
    } else {
        addAccountTitle(event.target.innerText);
    }
    fetchAndLoadTransactions(event.target.dataset.id)
}

function addAccountTitle(account) {
    const main = document.getElementById("main");
    const div = document.createElement("div");
    const title = document.createElement("h2");
    title.classList.add("text-indigo-800", "font-bold", "heading");
    title.innerText = account; 
    div.classList.add("w-full", "h-16", "pt-4", "pl-4", "bg-indigo-200");
    div.appendChild(title);
    main.appendChild(div);
}

function fetchAndLoadTransactions(id=0) {
    const adapter = new BudgetAdapter();
    adapter.getTransactions().then(transactions => {
        const main = document.getElementById("main");
        const div = document.createElement("div");
        div.setAttribute("id", "transactions-table");
        main.appendChild(div);
        const transactionTableData = [];
        let transaction;
        const allCategories = [];
        for (transaction of transactions) {
            allCategories.push(transaction.category_name);
        }
        if (id !== 0) {
            for(transaction of transactions) {
                if (transaction.account_id === parseInt(id)) {
                    transactionTableData.push(transaction);
                }
            }
        } else {
            for (transaction of transactions) {
                transactionTableData.push(transaction);
            }
        } 

        //Create Date Editor for Table
        var dateEditor = function(cell, onRendered, success, cancel){
            //cell - the cell component for the editable cell
            //onRendered - function to call when the editor has been rendered
            //success - function to call to pass the successfuly updated value to Tabulator
            //cancel - function to call to abort the edit and return to a normal cell
        
            //create and style input
            var cellValue = moment(cell.getValue(), "YYYY-MM-DD").format("MM/DD/YYYY");
            input = document.createElement("input");
        
            input.setAttribute("type", "date");
        
            input.style.padding = "4px";
            input.style.width = "100%";
            input.style.boxSizing = "border-box";
        
            input.value = cellValue;
        
            onRendered(function(){
                input.focus();
                input.style.height = "100%";
            });
        
            function onChange(){
                if(input.value != cellValue){
                    success(moment(input.value, "YYYY-MM-DD").format("YYYY-MM-DD"));
                }else{
                    cancel();
                }
            }
        
            //submit new value on blur or change
            input.addEventListener("blur", onChange);
        
            //submit new value on enter
            input.addEventListener("keydown", function(e){
                if(e.keyCode == 13){
                    onChange();
                }
        
                if(e.keyCode == 27){
                    cancel();
                }
            });
        
            return input;
        };
        
        const table = new Tabulator("#transactions-table", {
            cellEdited:function(cell) {
                updateTransaction(cell);
            },
            height:817,
            resizableColumns:false,
            data:transactionTableData,
            layout:"fitColumns",
            columns:[
                {title:"Id", field:"id", visible:false},
                {title:"Date", field:"date", width:250, editor:dateEditor, sorter:"date", formatter:"datetime", formatterParams:{
                    inputFormat:"YYYY-MM-DD",
                    outputFormat:"MM/DD/YYYY",
                    invalidPlaceholder:"(invalid date)",
                }},
                {title:"Payee", field:"payee"},
                {title:"Category", field:"category_name", editor:"autocomplete", editorParams:{
                    showListOnEmpty:true,
                    freetext:false,
                    allowEmpty:false,
                    searchFunc:function(term, values){ //search for exact matches
                        var matches = [];
                
                        values.forEach(function(value){
                            //value - one of the values from the value property
                
                            if(value === term){
                                matches.push(value);
                            }
                        });
                
                        return matches;
                    },
                    searchingPlaceholder:"Filtering ...",
                    emptyPlaceholder:"(no matching results found)",
                    values: allCategories,
                    sortValuesList:"asc"
                }},
                {title:"Account", field:"account_name", visible:false},
                {title:"Outflow", field:"outflow", formatter:"money", hozAlign:"center"},
                {title:"Inflow", field:"inflow", formatter:"money", hozAlign:"center"}
            ]
        });

        if (id === 0) {
            table.showColumn("account_name");
        }
        

            const transactionTable = document.getElementById("transactions-table");
            main.appendChild(transactionTable);

    });
}

function updateTransaction(cell) {
    if (cell._cell.value !== "Invalid date") {
        const transactionId = cell._cell.row.cells[0].value;
        const data = {
            value: cell._cell.value,
            columnName: cell._cell.column.definition.title,
        }
        fetch(`http://localhost:3000/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}