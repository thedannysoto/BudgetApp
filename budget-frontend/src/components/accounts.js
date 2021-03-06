class Accounts {
    constructor() {
        this.adapter = new BudgetAdapter();
        this.fetchAndLoadAccounts();
    }

    fetchAndLoadAccounts() {
        this.adapter.getAccounts().then(accounts => {
            const list = document.getElementById("accounts-list");
            for(let account of accounts) {
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

const categoryList =[];
const categoryFetch = new BudgetAdapter().getCategories().then(categories => {
    for(let category of categories) {
        categoryList.push(category.name);
    }
});

const accountList = [];
const accountFetch = new BudgetAdapter().getAccounts().then(accounts => {
    for (let account of accounts) {
        accountList.push(account.name);
    }
});

console.log(categoryList);


function refreshCategories() {
    const refresh = new Categories();
    refresh.fetchAndLoadCategories();
}

function viewAccount() {
    main.innerHTML = "";
    if (event.target.classList.contains("all-accounts")) {
        addAccountTitle("All Accounts", 0);
        fetchAndLoadTransactions();
        return;
    }
    if (event.target.classList.contains("account")) {
        addAccountTitle(event.target.querySelectorAll("p")[0].innerText, event.target.dataset.id);
    } else {
        addAccountTitle(event.target.innerText, event.target.dataset.id);
    }
    fetchAndLoadTransactions(event.target.dataset.id)
}

function addAccountTitle(account, id) {
    const main = document.getElementById("main");
    const div = document.createElement("div");
    const button = document.createElement("p");
    const title = document.createElement("h2");
    const balanceDiv = document.createElement("div");
    const balance = document.createElement("p");

    balanceDiv.classList.add("flex", "absolute", "right-0", "mr-24", "px-4", "pt-2", "-mt-1", "bg-gray-800", "w-auto", "border-white", "border-2");
    balance.classList.add("font-bold", "mb-2")
    balance.setAttribute("id", "account-balance");
    balanceDiv.appendChild(balance);

    title.classList.add("text-indigo-800", "font-bold", "heading", "flex");
    title.innerText = account;
    button.classList.add("modal-open", "text-white", "bg-indigo-800", "rounded-full", "font-bold", "hover:bg-indigo-600", "flex", "h-8", "pb-1", "pt-1", "px-2", "ml-4"); 
    button.setAttribute("id", "add-new-transaction");
    button.innerText = "Add New Transaction";
    div.dataset.id = id;
    div.setAttribute("id", "tableHeading");
    div.classList.add("w-full", "h-16", "pt-4", "pl-4", "bg-indigo-200", "flex");
    div.appendChild(title);
    if (id !== 0) {
    div.appendChild(button);
    div.appendChild(balanceDiv);
    fetchAccountBalance(id);
    }
    main.appendChild(div)
}

function fetchAndLoadTransactions(id=0) {

    // Hide To be Budgeted
    const budgeted = document.getElementById("to-be-budgeted");
    budgeted.style.display = "none";
    const adapter = new BudgetAdapter();
    adapter.getTransactions().then(transactions => {
        const main = document.getElementById("main");
        const div = document.createElement("div");
        div.setAttribute("id", "transactions-table");
        main.appendChild(div);
        const transactionTableData = [];
        let transaction;    
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
            initialSort:[
                {column:"date", dir:"desc"}
            ],
            rowContextMenu:[
                {
                    label:"Delete Row",
                    action:function(e, row){
                        deleteTransaction(row._row.data.id);
                        row.delete();
                    }
                }
            ],
            layout:"fitColumns",
            columns:[
                {title:"Id", field:"id", visible:false},
                {title:"Date", field:"date", editor:dateEditor, formatter:"datetime", formatterParams:{
                    inputFormat:"YYYY-MM-DD",
                    outputFormat:"MM/DD/YYYY",
                    invalidPlaceholder:"(invalid date)",
                }, sorter:"date", sorterParams:{
                    format:"MM/DD/YYYY"
                }
            },
                {title:"Payee", field:"payee", editor:"input"},
                {title:"Category", field:"category_name", editor:"autocomplete", editorParams:{
                    showListOnEmpty:true,
                    freetext:false,
                    values: categoryList,
                    sortValuesList:"asc"
                }},
                {title:"Memo", field:"memo", editor:"input"},
                {title:"Outflow", field:"outflow", formatter:"money", editor:"input", validator:["numeric", "min:0.01"], hozAlign:"center"},
                {title:"Inflow", field:"inflow", formatter:"money", editor:"input", validator:["numeric", "min:0.01"], hozAlign:"center"},
                {title:"", field: "hold"},
                {title:"Account", field:"account_name", visible:false, editor:"autocomplete", editorParams:{
                    showListOnEmpty:true,
                    freetext:false,
                    values: accountList,
                    sortValuesList:"asc"
                }}
            ]
        });

        if (id === 0) {
            // table.modules.layout.mode = "fitDataStretch";
            table.showColumn("account_name");
            table.hideColumn("hold");
            table.redraw(true);  
        } else {
            // Bind Event Listener to Add New Transaction Button
            setModal();
            document.getElementById("transaction-save").addEventListener("click", validateTransaction);
            document.getElementById("amount-error").style.display = "none";
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
            if (data.outflow || data.inflow) {
                const heading = document.getElementById("tableHeading");
                fetchAndLoadTransactions(heading.dataset.id);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function fetchAccountBalance(id) {
    fetch(`http://localhost:3000/accounts/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        
    })
    .then(response => response.json())
    .then(data => {
        const balance = document.getElementById("account-balance");
        if (data < 0) {
            balance.classList.add("text-red-500");
        } else {
            balance.classList.add("text-green-500");
        }
        balance.innerText = "Balance: " + " $" + data.toFixed(2);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

function reloadAccount() {
    const tableHeading = document.getElementById("tableHeading");
    const heading = tableHeading.querySelector("h2").innerText;
    const main = document.getElementById("main");
    main.innerHTML = "";
    addAccountTitle(heading, tableHeading.dataset.id)
    fetchAndLoadTransactions(tableHeading.dataset.id);
}