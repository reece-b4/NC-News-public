<h1 align="center">Welcome to Reece Balfour's Northcoders News API 👋</h1>

An API to interact with data in nc_news database which consists of four tables: <br> articles, comments, topics, users. Endpoints are listed in endpoints.json and include: <br>
"GET /api" <br>
"GET /api/topics" <br>
"GET /api/articles" <br>
"GET /api/articles/:article_id" <br>
"PATCH /api/articles/:article_id" -votes- <br>
"GET /api/articles/:article_id/comments" <br>
"POST /api/articles/:article_id/comments" <br>
"DELETE /api/comments/:comment_id" <br>
"GET /api/users" <br>
<br>
Queries of: <br>
sortBy(created_at, topic, author, title, votes, defaults to created_at, comment_count),  <br>
order(ASC or DESC, defaults to DESC) and <br>
topic(filters by topic)  <br>
can be made on "GET /api/articles".

<br>
Minimum version of node: v16.13.2 <br>
Minimum version of Postgres: 14.1 <P>

## Links

## 🏠 [Hosted API](https://reece-ncnews.herokuapp.com/api)
## 🖥️ [Git Repo](https://github.com/reece-b4/NC-News-public)

## 🏠 [Front-end Homepage](https://reecebalfourncnews.netlify.app)
## 🖥️ [Front-end GitHub Repo](https://github.com/reece-b4/fe-nc-news)
<br>

## Cloning repo (link above)

Copy code url from github <br>
In required directory:
```sh
 git clone <url>
```

## Install Dependencies
```sh
npm install
```
Full list of dependencies can be found further in ReadMe.

## Creating .env files

You will need to create two .env files in the repo root directory: <br>
`.env.test` and <br>
`.env.development` <br>
Into each, add:
```sh
 PGDATABASE=PGDATABASE=nc_news_test 
```
and 
```sh
PGDATABASE=PGDATABASE=nc_news 
```
respectively.

## Seeding local database
```sh
npm run setup-dbs
npm run seed
```

## Run tests

```sh
npm test app
```

## Author

👤 **ReeceBalfour**

* Github: [@reece-b4](https://github.com/reece-b4)
