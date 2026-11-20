use std::sync::Arc;

use chrono::{DateTime, Utc};
use serde::Deserialize;
use axum::response::Json;
use axum::extract::State;

use crate::AppState;
use super::base::Project;


#[derive(Deserialize)]
pub struct CreateProject {
    pub name: String,
    pub color: Option<String>,
    pub default_deadline: Option<DateTime<Utc>>,
    pub description: Option<String>,
}

pub async fn create_project(
    State(state): State<Arc<AppState>>,
    Json(create_project): Json<CreateProject>,
) -> Json<Project> {

    let new_project: Project = 
        sqlx::query_as(
            "INSERT INTO projects (name, description, color, default_deadline) 
             VALUES ($1, $2, COALESCE($3, '#7f64c7'), $4) 
             RETURNING id, name, description, color, default_deadline, created_at"
        )
        .bind(create_project.name)
        .bind(create_project.description)
        .bind(create_project.color)
        .bind(create_project.default_deadline)
        .fetch_one(&state.db_pool)
        .await
        .unwrap();

    Json(new_project)
}