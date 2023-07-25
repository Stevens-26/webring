/*
 * (c) 2023 Tianyu Zhu eric@ericz.me
 * Released under MIT
 */
use std::fs;
use rand::seq::SliceRandom;
use serde::{Deserialize,Serialize};
use serde_json::json;
use minifier::css::minify;
use axum::{
    routing,
    extract::{Path,State},
    http::{StatusCode,header::HeaderMap},
    Router
};

#[derive(Clone)]
struct SiteState {
    ring: Vec<Node>,
    js: String,
}

#[derive(Deserialize, Serialize)]
#[derive(Clone)]
struct Node {
    id: String,
    name: String,
    url: String,
    rss: Option<String>,
    atom: Option<String>,
}

#[tokio::main]
async fn main() {
    // replace this to init state with parse() and jsinit() with minifi
    let state: SiteState = SiteState{
        ring: init_ring(),
        js: init_js(),
    };

    let app = Router::new()
        .route("/", routing::get(get_all))
        .route("/:name", routing::get(get_node))
        .route("/:name/neighbors", routing::get(get_neighbor))
        .route("/:name/random", routing::get(get_random))
        .route("/webring.js", routing::get(get_js))
        .with_state(state);

    axum::Server::bind(&"0.0.0.0:3030".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// Parse data.json into the ring
fn init_ring() -> Vec<Node> {
    let ring_raw = fs::read_to_string("data.json").expect("Failed to read data.json");
    serde_json::from_str(&ring_raw).expect("Failed to parse data.json")
}

// Read js and minify it
fn init_js() -> String {
    let js_raw = fs::read_to_string("./js/webring.js").unwrap();
    minify(&js_raw).unwrap().to_string()
}

async fn get_js(State(state): State<SiteState>) -> (HeaderMap, String) {
    let js = state.js;
    let mut resp_header = HeaderMap::new();
    resp_header.insert("Content-Type", "application/javascript".parse().unwrap());
    resp_header.insert("Access-Control-Allow-Origin", "*".parse().unwrap());
    (resp_header, js)
}

// get the whole webring
async fn get_all(State(state): State<SiteState>) -> (StatusCode, HeaderMap, String) {
    let ring = state.ring;
    let mut resp_header = HeaderMap::new();
    resp_header.insert("Content-Type", "application/json".parse().unwrap());
    resp_header.insert("Access-Control-Allow-Origin", "*".parse().unwrap());
    if let Ok(string) = serde_json::to_string(&ring) {
        (StatusCode::OK, resp_header, string)
    } else {
        let resp = json!({"Error": "Internal Server Error"}).to_string();
        (StatusCode::INTERNAL_SERVER_ERROR, resp_header, resp)
    }
}

// get info ab a node
async fn get_node(Path(name): Path<String>, State(state): State<SiteState>) -> (StatusCode, HeaderMap, String) {
    let ring = state.ring;
    let mut resp_header = HeaderMap::new();
    resp_header.insert("Content-Type", "application/json".parse().unwrap());
    resp_header.insert("Access-Control-Allow-Origin", "*".parse().unwrap());
    if let Some(node) = get(name, ring) {
        (StatusCode::OK, resp_header, serde_json::to_string(&node).unwrap())
    } else {
        // make a simple json with error: not found
        let resp = json!({"Error": "Not Found"}).to_string();
        (StatusCode::NOT_FOUND, resp_header, resp)
    }
}

// get the neighbors of a ring node
async fn get_neighbor(Path(name): Path<String>, State(state): State<SiteState>) -> (StatusCode, HeaderMap, String) {
    let ring = state.ring;
    let mut resp_header = HeaderMap::new();
    resp_header.insert("Content-Type", "application/json".parse().unwrap());
    resp_header.insert("Access-Control-Allow-Origin", "*".parse().unwrap());
    if let Some(node) = get(name, ring.to_owned()) {
        let index = ring.iter().position(|x| x.id == node.id).unwrap();
        let prev = ring.get((index + ring.len() - 1) % ring.len()).unwrap();
        let next = ring.get((index + 1) % ring.len()).unwrap();
        let neighbors = vec![prev, next];
        (StatusCode::OK, resp_header, serde_json::to_string(&neighbors).unwrap())
    } else {
        let resp = json!({"Error": "Not Found"}).to_string();
        (StatusCode::NOT_FOUND, resp_header, resp)
    }
}

// Get a random node that is not name
async fn get_random(Path(name): Path<String>, State(state): State<SiteState>) -> (StatusCode, HeaderMap, String) {
    let ring = state.ring;
    let mut resp_header = HeaderMap::new();
    resp_header.insert("Content-Type", "application/json".parse().unwrap());
    resp_header.insert("Access-Control-Allow-Origin", "*".parse().unwrap());
    if let Some(node) = get(name.to_owned(), ring.to_owned()) {
        let index = ring.iter().position(|x| x.id == node.id).unwrap();
        let prev = ring.get((index + ring.len() - 1) % ring.len()).unwrap();
        let next = ring.get((index + 1) % ring.len()).unwrap();

        let ring: Vec<Node> = ring.clone().iter()
            .filter(|&node| node.id != name)
            .filter(|&node| node.id != prev.id)
            .filter(|&node| node.id != next.id)
            .cloned().collect();
        let random: &Node = ring.choose(&mut rand::thread_rng()).unwrap();
        (StatusCode::OK, resp_header, serde_json::to_string(random).unwrap())
    } else {
        let resp = json!({"Error": "Not Found"}).to_string();
        (StatusCode::NOT_FOUND, resp_header, resp)
    }
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
