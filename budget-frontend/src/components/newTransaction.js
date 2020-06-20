function validateTransaction() {
    const newDate = document.getElementById("new-transaction-date");
    const newPayee = document.getElementById("new-transaction-payee");
    const newCategory = document.getElementById("new-transaction-category");
    const newMemo = document.getElementById("new-transaction-memo");
    const newAmount = document.getElementById("new-transaction-amount");
    let newOutflow = document.querySelectorAll('input[name="outflow"]');
    const account = document.getElementById("tableHeading").dataset.id;

    let errors = 0;

    if (newDate.value === "") {
        newDate.classList.add("border-red-600");
        errors = 1;
    }

    if (newPayee.value === "") {
        newPayee.classList.add("border-red-600");
        errors = 1;
    }

    if (newCategory.value === "") {
        newCategory.classList.add("border-red-600");
        errors = 1;
    }

    if (newAmount.value <= 0) {
        document.getElementById("amount-error").style.display = "flex";
        newAmount.classList.add("border-red-600");
        errors = 1;
    }
    
    if (newOutflow[0].checked) {
        newOutflow = "Outflow";
    } else {
        newOutflow = "Inflow";
    }

    if (errors === 0) {
        const data = {
            date: newDate.value,
            payee: newPayee.value,
            category: newCategory.value,
            memo: newMemo.value,
            amount: newAmount.value,
            outflow: newOutflow,
            account: account
        };
        toggleModal();
        saveTransaction(data);

        newDate.value = "";
        newPayee.value = "";
        newCategory.value = "";
        newMemo.value = "";
        newAmount.value = "";
    }
}

function saveTransaction(data) {
    fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            reloadAccount();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

