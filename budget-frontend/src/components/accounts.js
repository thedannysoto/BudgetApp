class Accounts {
    constructor() {
        this.accounts = [];
        this.adapter = new BudgetAdapter();
        this.fetchAndLoadAccounts();
        // this.bindEventListeners();
    }

    fetchAndLoadAccounts() {
        this.adapter.getAccounts().then(accounts => {
            console.log(accounts[0])
            const list = document.getElementById("accounts-list");
            for(let account of accounts) {
                const div = document.createElement("div");
                div.classList.add("w-full", "hover:bg-indigo-500", "py-3", "text-white");
                const p = document.createElement("p");
                p.innerText = account.name;
                p.classList.add("account-name", "w-full", "font-bold", "pl-4");
                div.appendChild(p);
                list.appendChild(div);
            }
            
            

        });
    }
}