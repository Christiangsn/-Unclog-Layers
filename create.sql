drop table transaction;
drop table installment;

create table transaction (
    code text primary key,
    amount numeric,
    number_installments integer,
    payment_method text,
    date timestamp default now()
);

create table installment (
    code text references transaction (code),
    number integer,
    amount numeric,
    primary key (code, number)
);