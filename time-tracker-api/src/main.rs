use chrono::{DateTime, TimeZone, Utc};
use axum::routing;
use axum::routing::Router;
use axum::response::Json;
use serde_json::{Value, json};
use serde::{Serialize, Deserialize};


async fn get_health_live() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

#[derive(Serialize, Deserialize)]
struct Task {
    id: u32,
    name: String,
    start: DateTime<Utc>,
    end: Option<DateTime<Utc>>,
}

async fn get_tasks() -> Json<Value> {

    let tasks = [
        Task {
            id: 3,
            name: String::from("Hello, World!"),
            start: Utc.with_ymd_and_hms(2026, 10, 10, 6, 15, 3).unwrap(),
            end: None,
        },
        Task {
            id: 2,
            name: String::from("Second task"),
            start: Utc.with_ymd_and_hms(2026, 10, 10, 6, 15, 3).unwrap(),
            end: None,
        },
        Task {
            id: 1,
            name: String::from("First task"),
            start: Utc.with_ymd_and_hms(2026, 10, 10, 6, 15, 3).unwrap(),
            end: None,
        },
    ];

    Json(json!(tasks))
}

fn create_router() -> Router {
    Router::new()
        .route("/", routing::get(get_tasks))
        .route("/health/live", routing::get(get_health_live))
}

#[tokio::main]
async fn main() {

    let app = create_router();
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8002").await.expect(
        "Cannot set up TCP listener"
    );

    axum::serve(listener, app).await.expect("Cannot set up axum server");
}
