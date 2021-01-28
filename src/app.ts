let dotenv = require('dotenv').config();
let mysql = require('mysql');
let fs = require('fs');

const connection = mysql.createConnection({
    host: process.env.SERVER_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

connection.connect();

const jsSolution = (process.env.IS_JS_SOLUTION.toLocaleLowerCase() === "true");

const fileName = "solution.txt";

const deciderLimit = +process.env.DECIDER_LIMIT;

if (jsSolution) {
    const sqlCommand = 'select ' +
                        process.env.FIELD +
                        ' from ' +
                        process.env.TABLE;

    connection.query(sqlCommand, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }

        let sum = 0;

        result.forEach(item => {
            const actualNumber = +item.cost;

            if (actualNumber < deciderLimit) {
                sum += actualNumber;
            }
        });

        let solution = [];

        solution.push("A limit ",
                      deciderLimit,
                      " volt. A számok összege pedig: ",
                      sum,
                      ".\n",
                      "A megoldást a JS számolta.");

        console.log(solution.join(""));

        fs.writeFileSync(fileName, solution.join(""), 'utf-8');

        console.log("A megoldás bekerült a " + fileName + "-be is...");
    });
} else {
    const sqlCommand = "select sum(case when " +
                       process.env.FIELD +
                       " < " +
                       process.env.DECIDER_LIMIT +
                       " then " +
                       process.env.FIELD +
                       " else 0 end) as sum_cost from " +
                       process.env.TABLE;

    connection.query(sqlCommand, function (error, result) {
        const sum = +result[0].sum_cost;

        let solution = [];

        solution.push("A limit ",
                      deciderLimit,
                      " volt. A számok összege pedig: ",
                      sum,
                      ".\n",
                      "A megoldást az SQL számolta.");

        console.log(solution.join(""));

        fs.writeFileSync(fileName, solution.join(""), 'utf-8');

        console.log("A megoldás bekerült a " + fileName + "-be is...");
    });
}

connection.end();
