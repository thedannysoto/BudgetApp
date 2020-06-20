function updateCategory(cell) {
    const id = cell._cell.row.data.id;
    const data = {
        value: parseFloat(cell._cell.value).toFixed(2),
    }
    fetch(`http://localhost:3000/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
            reloadCategories();       
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
}