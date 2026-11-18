use sqlx::postgres::Postgres;
use sqlx::pool::Pool;


pub struct AppState {
    pub db_pool: Pool<Postgres>,
}
