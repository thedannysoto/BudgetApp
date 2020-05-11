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
            
            const tableData = [
                {id:1, name:"danny", age:"32", col:"blue", dob:"10/25/1987"},
                {id:2, name:"mark", age:"24", col:"red", dob:"04/30/1996"}
            ]

            const table = new Tabulator("#example-table", {
                height:205,
                data:tableData,
                layout:"fitColumns",
                columns:[
                    {title:"Name", field:"name", width:150},
                    {title:"Age", field:"age", hozAlign:"right"},
                    {title:"Favorite Color", field:"col"},
                    {title:"Birthday", field:"dob", sorter:"date", hozAlign:"center"}
                ]
            });

        });
    }
}