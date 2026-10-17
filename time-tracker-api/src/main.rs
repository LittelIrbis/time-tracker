use std::sync::Arc;
use std::env;

use chrono::{DateTime, Utc};
use axum::routing;
use axum::routing::Router;
use axum::response::Json;
use axum::extract::State;
use serde_json::{Value, json};
use serde::{Serialize, Deserialize};
use sqlx::postgres::{PgPoolOptions, Postgres};
use sqlx::pool::Pool;


async fn get_health_live() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct Task {
    id: i64,
    name: String,
    start: DateTime<Utc>,
    end: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
struct CreateTask {
    name: String,
    start: DateTime<Utc>,
    end: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
struct UpdateTask {
    id: i64,
    new_name: Option<String>,
    new_start: Option<DateTime<Utc>>,
    new_end: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
struct DeleteTask {
    id: i64,
}

#[derive(Serialize)]
enum OperationResultStatus {
    Ok,
    Error,
    NotFound,
}

#[derive(Serialize)]
struct OperationResult {
    status: OperationResultStatus,
}

#[derive(Serialize)]
struct UpdateTaskResult {
    operation_result: OperationResult,
    task: Option<Task>,
}

async fn get_tasks(State(state): State<Arc<AppState>>) -> Json<Vec<Task>> {

    let tasks = sqlx::query_as::<_, Task>("SELECT id, name, start, \"end\" FROM tasks ORDER BY id")
        .fetch_all(&state.db_pool)
        .await
        .unwrap();

    Json(tasks)
}

async fn create_task(
    State(state): State<Arc<AppState>>,
    Json(create_task): Json<CreateTask>,
) -> Json<Task> {

    let new_task: Task = 
        sqlx::query_as(
            "INSERT INTO tasks (name, start, \"end\") VALUES ($1, $2, $3) RETURNING id, name, start, \"end\""
        )
        .bind(create_task.name)
        .bind(create_task.start)
        .bind(create_task.end)
        .fetch_one(&state.db_pool)
        .await
        .unwrap();

    Json(new_task)
}

async fn delete_task(
    State(state): State<Arc<AppState>>,
    Json(delete_task): Json<DeleteTask>,
) -> Json<OperationResult> {

    match sqlx::query("DELETE FROM tasks WHERE id = $1")
        .bind(delete_task.id)
        .fetch_one(&state.db_pool)
        .await
    {
        Ok(_) => Json(OperationResult { status: OperationResultStatus::Ok }),
        Err(sqlx::Error::RowNotFound) => Json(OperationResult { status: OperationResultStatus::NotFound }),
        Err(_) => Json(OperationResult { status: OperationResultStatus::Error }),
    }
}

async fn update_task(
    State(state): State<Arc<AppState>>,
    Json(update_task): Json<UpdateTask>,
) -> Json<UpdateTaskResult> {

    match sqlx::query_as::<_, Task>("UPDATE tasks SET name = COALESCE($2, name), start = COALESCE($3, start), \"end\" = \"end\" WHERE id = $1 RETURNING id, name, start, \"end\"")
        .bind(update_task.id)
        .bind(update_task.new_name)
        .bind(update_task.new_start)
        .bind(update_task.new_end)
        .fetch_one(&state.db_pool)
        .await
    {
        Ok(task) => Json(UpdateTaskResult { operation_result: OperationResult { status: OperationResultStatus::Ok }, task: Some(task) }),
        Err(sqlx::Error::RowNotFound) => Json(UpdateTaskResult { operation_result: OperationResult { status: OperationResultStatus::NotFound }, task: None}),
        Err(_) => Json(UpdateTaskResult { operation_result: OperationResult { status: OperationResultStatus::Error }, task: None}),
    }
}

fn create_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/tasks/list", routing::get(get_tasks))
        .route("/tasks/create", routing::post(create_task))
        .route("/tasks/update", routing::post(update_task))
        .route("/tasks/delete", routing::post(delete_task))
        .route("/health/live", routing::get(get_health_live))
        .with_state(app_state)
}

async fn get_db_pool() -> Result<Pool<Postgres>, sqlx::Error> {
    Ok(PgPoolOptions::new().connect(&env::var("DATABASE_URL").expect(
        "You must set \"DATABASE_URL\" environment variable"
    )).await?)
}

struct AppState {
    db_pool: Pool<Postgres>,
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
