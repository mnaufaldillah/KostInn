const app = require('./app.js');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Final Project PPS Server is running on port ${port}`);
});