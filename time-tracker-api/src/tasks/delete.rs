use std::sync::Arc;

use serde::Deserialize;
use axum::response::Json;
use axum::extract::State;

use crate::AppState;
use crate::app::operation::{OperationResult, OperationResultStatus};


#[derive(Deserialize)]
pub struct DeleteTask {
    pub id: i64,
}

pub async fn delete_task(
    State(state): State<Arc<AppState>>,
    Json(delete_task): Json<DeleteTask>,
) -> Json<OperationResult> {

    match sqlx::query("DELETE FROM tasks WHERE id = $1")
        .bind(delete_task.id)
        .fetch_one(&state.db_pool)
        .await
    {
        Ok(_) => Json(OperationResult { status: OperationResultStatus::Ok }),
        Err(sqlx::Error::RowNotFound) => Json(OperationResult {
            status: OperationResultStatus::NotFound,
        }),
        Err(_) => Json(OperationResult { status: OperationResultStatus::Error }),
    }
}
