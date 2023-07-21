FROM rust:1.70-alpine

ADD . .

RUN apk add --no-cache musl-dev
RUN cargo build --release

CMD ["./target/release/webring"]
