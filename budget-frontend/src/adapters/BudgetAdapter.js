class BudgetAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/transactions';
    }
    
    getTransactions() {
        return fetch(this.baseUrl).then(res => res.json());
    }
}
