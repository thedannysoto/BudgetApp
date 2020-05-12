class Categories {
    constructor() {
        this.categories = [];
        this.adapter = new BudgetAdapter();
        this.fetchAndLoadCategories();
        // this.bindEventListeners();
    }

    fetchAndLoadCategories() {
        this.adapter.getCategories().then(categories => {
            console.log(categories)
            
            const tableData = [];
            let category;
            for(category of categories) {
                tableData.push(category);
            }
            
            const table = new Tabulator("#example-table", {
                height:205,
                data:tableData,
                layout:"fitColumns",
                columns:[
                    {title:"Name", field:"name", width:950},
                    {title:"Budgeted", field:"budgeted", formatter:"money", hozAlign:"center"},
                    {title:"Activity", field:"activity", formatter:"money", hozAlign:"center"},
                    {title:"Available", field:"available", formatter:"money", hozAlign:"center"}
                ]
            });

        });
    }
}