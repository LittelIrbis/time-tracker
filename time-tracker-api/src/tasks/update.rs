use std::sync::Arc;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use axum::response::Json;
use axum::extract::State;

use crate::AppState;
use crate::app::operation::{OperationResult, OperationResultStatus};
use super::base::Task;


#[derive(Deserialize)]
pub struct UpdateTask {
    pub id: i64,
    pub new_name: Option<String>,
    pub new_start: Option<DateTime<Utc>>,
    pub new_end: Option<DateTime<Utc>>,
}

#[derive(Serialize)]
pub struct UpdateTaskResult {
    pub operation_result: OperationResult,
    pub task: Option<Task>,
}

pub async fn update_task(
    State(state): State<Arc<AppState>>,
    Json(update_task): Json<UpdateTask>,
) -> Json<UpdateTaskResult> {

    match sqlx::query_as::<_, Task>("UPDATE tasks SET name = COALESCE($2, name), start = COALESCE($3, start), \"end\" = COALESCE($4, \"end\") WHERE id = $1 RETURNING id, name, start, \"end\"")
        .bind(update_task.id)
        .bind(update_task.new_name)
        .bind(update_task.new_start)
        .bind(update_task.new_end)
        .fetch_one(&state.db_pool)
        .await
    {
        Ok(task) => Json(UpdateTaskResult {
            operation_result: OperationResult { status: OperationResultStatus::Ok },
            task: Some(task),
        }),
        Err(sqlx::Error::RowNotFound) => Json(UpdateTaskResult {
            operation_result: OperationResult { status: OperationResultStatus::NotFound },
            task: None,
        }),
        Err(_) => Json(UpdateTaskResult {
            operation_result: OperationResult { status: OperationResultStatus::Error },
            task: None,
        }),
    }
}
