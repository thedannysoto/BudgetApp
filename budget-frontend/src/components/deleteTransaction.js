function deleteTransaction(id) {
    data = {
        id: id
    }

    fetch(`http://localhost:3000/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            console.log('Success:');
            const heading = document.getElementById("tableHeading");
            fetchAndLoadTransactions(heading.dataset.id);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}