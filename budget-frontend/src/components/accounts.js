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
    }
}

function viewAccount() {
    const main = document.getElementById("main");
    main.innerHTML = "";
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

function fetchAndLoadTransactions(id) {
    const adapter = new BudgetAdapter();
    adapter.getTransactions().then(transactions => {
        const main = document.getElementById("main");
        const div = document.createElement("div");
        div.setAttribute("id", "transactions-table");
        main.appendChild(div);
        const transactionTableData = [];
        let transaction;
            for(transaction of transactions) {
                if (transaction.account_id === parseInt(id)) {
                    transactionTableData.push(transaction);
                }
            }
        
            const table = new Tabulator("#transactions-table", {
                height:817,
                data:transactionTableData,
                layout:"fitColumns",
                columns:[
                    {title:"Date", field:"date", width:250, formatter:"datetime", formatterParams:{
                        inputFormat:"YYYY-MM-DD",
                        outputFormat:"MM/DD/YYYY",
                        invalidPlaceholder:"(invalid date)",
                    }},
                    {title:"Payee", field:"payee"},
                    {title:"Amount", field:"amount", formatter:"money", hozAlign:"center"},
                ]
            });

            console.log(moment());

            const transactionTable = document.getElementById("transactions-table");
            main.appendChild(transactionTable);

    });
}