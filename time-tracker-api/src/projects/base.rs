use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Project {
    pub id: i64,
    pub name: String,
    pub color: String,
    pub created_at: DateTime<Utc>,
    pub default_deadline: Option<DateTime<Utc>>,
    pub description: Option<String>,
}