const express = require('express');

function startServer() {
    const app = express();
    const port = 2519;

    app.get('/', (req, res) => {
        res.send('OK');
    });

    app.listen(port, () => {
        console.log(`Backend server started!`);
    });
}

module.exports = { startServer };

// this was previously when i had a more open server but i got ddosed so now it just... exists
// maybe i could repurpose it so ex3 can talk to it