/*
 * (c) 2023 Tianyu Zhu eric@ericz.me
 * Released under MIT
 */
use std::fs;
use serde::{Deserialize,Serialize};
use serde_json;
use axum::{
    routing,
    extract::{Path,State},
    http::StatusCode,
    Router
};

#[derive(Deserialize, Serialize)]
#[derive(Clone)]
struct Node {
    id: String,
    name: String,
    rss: Option<String>,
    atom: Option<String>,
}

#[tokio::main]
async fn main() {
    let ring = parse();
    let app = Router::new()
        .route("/:name", routing::get(get_node))
        .route("/:name/neighbors", routing::get(get_neighbor))
        .with_state(ring);
    axum::Server::bind(&"0.0.0.0:3030".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// get info ab a node
async fn get_node(Path(name): Path<String>, State(ring): State<Vec<Node>>) -> (StatusCode, String) {
    if let Some(node) = get(name, ring) {
        (StatusCode::OK, serde_json::to_string(&node).unwrap())
    } else {
        (StatusCode::NOT_FOUND, "Not Found".to_string())
    }
}

// get the neighbors of a ring node
async fn get_neighbor(Path(name): Path<String>, State(ring): State<Vec<Node>>) -> (StatusCode, String) {
    if let Some(node) = get(name, ring.to_owned()) {
        let index = ring.iter().position(|x| x.id == node.id).unwrap();
        let prev = ring.get((index + ring.len() - 1) % ring.len()).unwrap();
        let next = ring.get((index + 1) % ring.len()).unwrap();
        let neighbors = vec![prev, next];
        (StatusCode::OK, serde_json::to_string(&neighbors).unwrap())
    } else {
        (StatusCode::NOT_FOUND, "Not Found".to_string())
    }
}

// Parse data.json into the ring
fn parse() -> Vec<Node> {
    let ring_raw = fs::read_to_string("data.json").expect("Failed to read data.json");
    serde_json::from_str(&ring_raw).expect("Failed to parse data.json")
}

// Get a node from the ring by it's name
fn get(id: String, ring: Vec<Node>) -> Option<Node> {
    for node in ring {
        if node.id == id {
            return Some(node);
        }
    }
    None
}
