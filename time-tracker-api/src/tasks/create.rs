use std::sync::Arc;

use chrono::{DateTime, Utc};
use serde::Deserialize;
use axum::response::Json;
use axum::extract::State;

use crate::AppState;
use super::base::Task;


#[derive(Deserialize)]
pub struct CreateTask {
    pub name: String,
    pub start: DateTime<Utc>,
    pub end: Option<DateTime<Utc>>,
}

pub async fn create_task(
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
