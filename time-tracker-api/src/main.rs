use std::sync::Arc;
use std::env;

use axum::routing;
use axum::routing::Router;
use axum::response::Json;
use serde_json::{Value, json};
use sqlx::postgres::{PgPoolOptions, Postgres};
use sqlx::pool::Pool;

mod tasks;
mod app;
mod projects;

use tasks::list::list_tasks;
use tasks::create::create_task;
use tasks::update::update_task;
use tasks::delete::delete_task;
use app::state::AppState;


async fn get_health_live() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

fn create_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/tasks/list", routing::get(list_tasks))
        .route("/tasks/create", routing::post(create_task))
        .route("/tasks/update", routing::post(update_task))
        .route("/tasks/delete", routing::post(delete_task))
        .route("/health/live", routing::get(get_health_live))
        .route("/projects/list", routing::get(projects::list::list_projects))
        .route("/projects/create", routing::post(projects::create::create_project))
        
        .with_state(app_state)
}

async fn get_db_pool() -> Result<Pool<Postgres>, sqlx::Error> {
    Ok(PgPoolOptions::new().connect(&env::var("DATABASE_URL").expect(
        "You must set \"DATABASE_URL\" environment variable"
    )).await?)
}

#[tokio::main]
async fn main() {

    dotenvy::dotenv().ok();

    let app_state = Arc::new(AppState {
        db_pool: get_db_pool().await.unwrap(),
    });

    let app = create_router(app_state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8002").await.expect(
        "Cannot set up TCP listener"
    );

    axum::serve(listener, app).await.expect("Cannot set up axum server");
}
