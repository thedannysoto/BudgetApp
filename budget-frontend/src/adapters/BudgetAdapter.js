class BudgetAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/';
    }

    getTransactions() {
        return fetch(this.baseUrl + "transactions").then(res => res.json());
    }

    getCategories() {
        return fetch(this.baseUrl + "categories").then(res => res.json());
    }

    getAccounts() {
        return fetch(this.baseUrl + "accounts").then(res => res.json());
    }
}
