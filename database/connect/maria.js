const maria = require('mysql')

const conn = maria.createConnection({
    host: 'localhost',
    port:3306,
    user: 'root',
    password: 'password',
    database: 'user'
})

module.exports = conn