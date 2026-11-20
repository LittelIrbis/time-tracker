use std::sync::Arc;

use axum::response::Json;
use axum::extract::State;

use crate::AppState;
use super::base::Project;

pub async fn list_projects(State(state): State<Arc<AppState>>) -> Json<Vec<Project>> {
    let projects = sqlx::query_as::<_, Project>(
        "SELECT id, name, color, created_at, default_deadline, description FROM projects ORDER BY id"
    )
        .fetch_all(&state.db_pool)
        .await
        .unwrap();

    Json(projects)
}