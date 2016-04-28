# Code Camp iOS
Simple REST API made in node.js to ensure connexions between a database and an iOS app.

## Routes
Below are listed the different routes, used with POST data.

### @add
Adds a user in a table (coach or client, depending of the content of the POST data)
Triggers in the database are made to add client to another table, which contains informations about the role of the user. (see @connect)

### @newrel
Creates a new relation between a coach and an user in a relation table.
