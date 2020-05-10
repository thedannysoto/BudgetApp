class Transactions {
    constructor() {
        this.transactions = [];
        this.adapter = new BudgetAdapter();
        this.fetchAndLoadTransactions();
        // this.bindEventListeners();
    }

    fetchAndLoadTransactions() {
        this.adapter.getTransactions().then(notes => {
            console.log(notes)
        });
    }
}