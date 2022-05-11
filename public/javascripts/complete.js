// const { response } = require("../../app");

window.addEventListener('load', () => {

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            console.log(e.target.checked, e.target.id);

            const id = e.target.id.split("-")[1];

            const url = `/profile/${id}/complete`

            fetch(url, {
                method: 'POST'
            }).then(response => {
                console.log(response);
            }).catch(error => {
                console.error(error);
            })
        });
    });
});

// https://developer.mozilla.org/en-US/docs/Web/API/fetch
// https://www.w3schools.com/jsref/jsref_split.asp