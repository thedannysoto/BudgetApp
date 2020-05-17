class Categories {
    constructor() {
        this.categories = [];
        this.adapter = new BudgetAdapter();
        
    }

    fetchAndLoadCategories() {
       
        this.adapter.getCategories().then(categories => {
            
            // Category List Title
            const main = document.getElementById("main");
            main.innerHTML = "";
            const tableDiv = document.createElement("div")
            const div = document.createElement("div");
            const title = document.createElement("h2");
            tableDiv.setAttribute("id", "categories-table")
            main.appendChild(tableDiv);
            title.classList.add("text-indigo-800", "font-bold", "heading");
            title.innerText = "Category List"; 
            div.classList.add("w-full", "h-16", "pt-4", "pl-4", "bg-indigo-200");
            div.appendChild(title);
            main.appendChild(div);



            const tableData = [];
            let category;
            for(category of categories) {
                tableData.push(category);
            }
            
            const table = new Tabulator("#categories-table", {
                height:817,
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