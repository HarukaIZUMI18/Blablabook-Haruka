# MLD 

Table USER {
  id integer [primary key]
  email varchar [not null]
  password varchar [not null]
  name varchar(100) [not null]
  created_at timestamp
  updated_at timestamp
}

Table BOOK {
  id integer [primary key]
  title varchar(100) [not null]
  cover varchar  [not null]
  author varchar(100) [not null]
  description varchar [not null]
  publish_year smallint  [not null]
  created_at timestamp
  updated_at timestamp
}

Table COLLECT {   
  user_id integer
  book_id integer
  status varchar(50) [not null]
}
 
Ref: COLLECT.user_id > USER.id  
Ref: COLLECT.book_id > BOOK.id