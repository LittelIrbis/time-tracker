### How to run?

1. Clone repo and cd into `time-tracker-api` dir:
    `git clone https://github.com/LittelIrbis/time-tracker.git && cd time-tracker-api`
2. Install [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
3. Create an `.env` file and fill the values:
```
# url for your db, e.g.: postgres://postgres:postgres@localhost:5432/time-tracker-api
DATABASE_URL=postgres://<user>:<password>C@<db_host>:<db_port>/<db_name>
```
4. Install [SQLx CLI](https://github.com/transact-rs/sqlx/blob/main/sqlx-cli/README.md) to run
    migrations: `cargo install sqlx-cli`
5. Create the database (if not yet): `sqlx database create`. And run migrations: `sqlx migrate run`
6. Compile and run the API: `cargo run`
7. Use the API:
    - GET on `http://0.0.0.0:8002/tasks/list` - list all tasks as json list
    - POST on `http://0.0.0.0:8002/tasks/create` - create a task, pass the JSON body:
        ```json
        {
            "name": "some name",
            "start": "2026-01-01T12:00:00.000Z",
            "end": null  // optional
        }
        ```
    - POST on `http://0.0.0.0:8002/tasks/update` - update a task, pass the JSON body:
        ```json
        {
            "id": 1,
            "new_name": "some name",  // optional, null will do nothing
            "new_start": "2026-01-01T12:00:00.000Z",  // optional, null will do nothing
            "new_end": null  // if null passed, null will be set
        }
        ```
    - POST on `http://0.0.0.0:8002/tasks/delete` - delete a task, pass the JSON body:
        ```json
        {
            "id": 1
        }
        ```
