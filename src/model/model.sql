CREATE DATABASE milk;

CREATE TABLE users(
    user_id bigserial PRIMARY KEY,
    user_name varchar(64) not null,
    user_password varchar(64),
    user_status int DEFAULT 2
);

CREATE TABLE stores(
    store_id bigserial PRIMARY KEY,
    store_name varchar(64) not null,
    store_password varchar(64) not null
);

CREATE TABLE user_stores(
    user_store_id bigserial PRIMARY KEY,
    user_store int,
        FOREIGN KEY(user_store)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    store_id int,
    FOREIGN KEY(store_id)
        REFERENCES stores(store_id)
        ON DELETE CASCADE
);

CREATE TABLE products(
    product_id bigserial PRIMARY KEY,
    product_name text not null,
    product_price bigint not null
);

CREATE TABLE store_products(
    store_product_id bigserial PRIMARY KEY,
    store_id int REFERENCES stores(store_id) not null,
    product_id int REFERENCES products(product_id) not null,
    product_received bigint not null,
    product_unreceived bigint DEFAULT null,
    product_returned bigint DEFAULT null
);

CREATE TABLE store_money(
    store_money_id bigserial PRIMARY KEY,
    storde_money_cash bigint,
    store_money_incass bigint,
    store_money_humo bigint,
    store_money_uzcard bigint,
    store_id int REFERENCES stores(store_id),
    store_money_status int DEFAULT 1
);

CREATE TABLE power_price(
    power_price_id serial PRIMARY KEY,
    power_price bigint not null
);

CREATE TABLE power_consume(
    power_consume_id bigserial PRIMARY KEY,
    store_id int REFERENCES stores(store_id),
    power_amount bigint not null
);