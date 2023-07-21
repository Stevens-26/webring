FROM rust:1.70-alpine

ADD . .

RUN cargo build --release

CMD ["./target/release/webring"]
