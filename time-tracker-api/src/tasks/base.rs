use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Task {
    pub id: i64,
    pub name: String,
    pub start: DateTime<Utc>,
    pub end: Option<DateTime<Utc>>,
}
