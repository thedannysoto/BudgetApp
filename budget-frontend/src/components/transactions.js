class Transactions {
    constructor() {
        this.transactions = [];
        this.adapter = new BudgetAdapter();
        this.fetchAndLoadTransactions();
    }

    fetchAndLoadTransactions() {
        this.adapter.getTransactions().then(transactions => {
            return transactions;
        });
    }
}