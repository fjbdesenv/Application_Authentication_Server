create database db_autenticacao;
use db_autenticacao;

Create table aplicacao (
	codigo int auto_increment,
    nome varchar(100) not null,
    email varchar(100) not null,
    token varchar(256),
    
    unique (email),
    constraint pk_aplication primary key(codigo) 
);

create table nivel (
	codigo int auto_increment,
    descricao varchar(100) not null,
    nivel int not null,
    
    constraint pk_nivel primary key(codigo)
);

create table usuario(
	codigo int auto_increment,
    codigo_app int not null,
    codigo_nivel int not null,
    email varchar(100) not null,
    token varchar(256),
    
    unique(email),
    constraint pk_usuario primary key(codigo),
    constraint fk_nivel_app foreign key (codigo_nivel) references nivel(codigo),
    constraint fk_usuario_app foreign key (codigo_app) references aplicacao(codigo)
);

insert into aplicacao values (NULL, 'App 1', 'app1@teste.com', '');
insert into aplicacao values (NULL, 'App 2', 'app2@teste.com', '');
insert into aplicacao values (NULL, 'App 3', 'app3@teste.com', '');

insert into nivel values (NULL, 'Usuario', 1);
insert into nivel values (NULL, 'Administrador', 2);

insert into usuario values (NULL, 1, 2, 'ana@teste.com', '');
insert into usuario values (NULL, 1, 2, 'joao@teste.com', '');
insert into usuario values (NULL, 1, 2, 'jose@teste.com', '');
