create table users (
    id bigserial primary key,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    role varchar(20) not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),

    constraint chk_role
        check (role in ('USER', 'ADMIN'))
);

create table tasks (
    id bigserial primary key,
    name varchar(255) not null,
    priority varchar(20) not null,
    status varchar(30) not null,
    owner_id bigint not null references users(id) on delete cascade,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    constraint chk_task_priority check (priority in ('LOW', 'MEDIUM', 'HIGH')),
    constraint chk_task_status check (status in ('TODO', 'IN_PROGRESS', 'DONE'))
);

create table task_collaborators (
    task_id bigint not null references tasks(id) on delete cascade,
    user_id bigint not null references users(id) on delete cascade,
    primary key (task_id, user_id)
);