class App {
    constructor() {
        this.categories = new Categories();
        this.categories.fetchAndLoadCategories();
        this.accounts = new Accounts();
    }
}