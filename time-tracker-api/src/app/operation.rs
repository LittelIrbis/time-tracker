use serde::Serialize;


#[derive(Serialize)]
pub enum OperationResultStatus {
    Ok,
    Error,
    NotFound,
}

#[derive(Serialize)]
pub struct OperationResult {
    pub status: OperationResultStatus,
}
