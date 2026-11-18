use std::sync::Arc;

use axum::response::Json;
use axum::extract::State;

use crate::AppState;
use super::base::Task;


pub async fn list_tasks(State(state): State<Arc<AppState>>) -> Json<Vec<Task>> {

    let tasks = sqlx::query_as::<_, Task>("SELECT id, name, start, \"end\" FROM tasks ORDER BY id")
        .fetch_all(&state.db_pool)
        .await
        .unwrap();

    Json(tasks)
}
