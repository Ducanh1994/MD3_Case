const connection = require ('../entity/connection');

class AccountService {
    connect;
    constructor() {
        connection.connectToMySQL();
        this.connect =

    }
}