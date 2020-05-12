class Accounts {
    constructor() {
        this.accounts = [];
        this.adapter = new BudgetAdapter();
        this.fetchAndLoadAccounts();
        // this.bindEventListeners();
    }

    fetchAndLoadAccounts() {
        this.adapter.getAccounts().then(accounts => {
            console.log(accounts)
            
            

        });
    }
}