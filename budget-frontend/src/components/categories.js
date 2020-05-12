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
            
            const main = document.getElementById("main");
            const div = document.createElement("div");
            const title = document.createElement("h2");
            title.classList.add("text-indigo-800", "font-bold", "heading");
            title.innerText = "Budget Categories"; 
            div.classList.add("w-full", "h-16", "pt-4", "pl-4", "bg-indigo-200");
            div.appendChild(title);
            main.appendChild(div);



            const tableData = [];
            let category;
            for(category of categories) {
                tableData.push(category);
            }
            
            const table = new Tabulator("#categories-table", {
                height:832,
                data:tableData,
                layout:"fitColumns",
                columns:[
                    {title:"Name", field:"name", width:950},
                    {title:"Budgeted", field:"budgeted", formatter:"money", hozAlign:"center"},
                    {title:"Activity", field:"activity", formatter:"money", hozAlign:"center"},
                    {title:"Available", field:"available", formatter:"money", hozAlign:"center"}
                ]
            });

            const catTable = document.getElementById("categories-table");
            main.appendChild(catTable);

        });
    }
}