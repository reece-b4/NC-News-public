const request = require("supertest");
const db = require("../db/connection.js");

const testData = require("../db/data/test-data");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("200 - responds with array of topic objects with properties: slug, description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).not.toEqual([]);
          expect(res.body.topics.length).toBe(3);
          res.body.topics.forEach((topic) => {
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    test("404 - given non existent path responds with message path not found <GLOBAL>", () => {
      return request(app)
        .get("/api/not-a-path")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("path not found");
        });
    });
  });
});
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200 - responds with article object with properties: author<username from users table>, title, article_id, body, topic, created_at, votes, comment count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            comment_count: 11,
          });
        });
    });
    test("200 - responds with article object with properties: author<username from users table>, title, article_id, body, topic, created_at, votes, comment count - if comment count 0", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: expect.any(String),
            votes: 0,
            comment_count: 0,
          });
        });
    });
    test("400 - given invalid id data type, returns message: bad request", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test("404 - given non existent id with no data, returns message: not found", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
        });
    });
  });

describe("PATCH - votes", () => {
  test("200 - accepts body in form of { inc_votes: newVote } with newVote dictating the inc/decrement of votes. Responds with updated article", () => {
    const votes = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 90,
        });
      });
  });
  test("200 - accepts body in form of { inc_votes: newVote } with newVote dictating the inc/decrement of votes. Responds with updated article", () => {
    const votes = { inc_votes: +9 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 109,
        });
      });
  });
  test("404 - given correct id type but no article exists at that id, returns message: not found", () => {
    const votes = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/999999")
      .send(votes)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test(" 400 - given incorrect votes data type returns message: bad request", () => {
    const votes = { inc_votes: "not-a-valid-vote-count" };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test(" 400- given incorrect but existing key returns message: bad request", () => {
    const votes = { title: 9 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test(" 200- given extra key on body ignores incorrect key and returns updated article", () => {
    const votes = { inc_votes: -10, title: 9 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 90,
        });
      });
  });
  test("400 - given invalid id data type, returns message: bad request", () => {
    const votes = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(votes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test(" 400- given empty object returns message: bad request", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
})

describe("/api/users", () => {
  describe("GET", () => {
    test("200 - returns array of objects with username property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          res.body.usernames.forEach((user) => {
            expect.objectContaining({
              username: expect.any(String),
            });
            expect.not.objectContaining({
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200 - returns array of objects with username property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          res.body.usernames.forEach((user) => {
            expect.objectContaining({
              username: expect.any(String),
            });
            expect.not.objectContaining({
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200 - given article id responds with all comments for that article. Each comment should have properties: comment_id, votes, created_at, author, body", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          const comments = res.body.comments;
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(comments).not.toEqual([]);
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    test("200 - article exists but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([]);
        });
    });test('404 - given possible but non existent article id returns message not found', () => {
      return request(app).get('/api/articles/9999999/comments')
      .expect(404)
      .then((res)=>{
        expect(res.body.msg).toBe('not found')
      })
    })

  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200 - responds with array of article objects with properties: author, title, article_id, topic, created_at, votes, comment_count. Sorted by descending date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles.length).toBe(12);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("200 - article exists but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([]);
        });
    });
    test("404 - given possible but non existent article id returns message not found", () => {
      return request(app)
        .get("/api/articles/9999999/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test("201 - give body object with properties: username & body, posts comment then returns posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "icellusedkars", body: "Test comment." })
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual({
            comment_id: expect.any(Number),
            body: "Test comment.",
            votes: 0,
            author: "icellusedkars",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    });
    test('201 - if comment already exists', () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "icellusedkars", body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works." })
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual({
            comment_id: expect.any(Number),
            body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            votes: 0,
            author: "icellusedkars",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    })
    test('400 - if no body given sends message bad request', ()=> {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe('bad request');
        });
    })
    test('201 - given body with extra key, ignores extra keys', ()=>{
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "icellusedkars", body: "Test comment.", extraKey: 9 })
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual({
            comment_id: expect.any(Number),
            body: "Test comment.",
            votes: 0,
            author: "icellusedkars",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    })
    test('400 - given body with missing key send message bad request', () =>{
      return request(app)
        .post("/api/articles/1/comments")
        .send({ body: "Test comment." })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe('bad request')
        });
    })
  });
});

//error: given wrong id type, given non existent id
// describe.only('/api/comments/:comment_id', () =>{
//   describe('DELETE', () =>{
//     test('204 - deletes comment with given id and returns nothing', () => {
//       return request(app).delete('/api/comments/:comment_id')
//       .expect(204)
//       .then((res)=>{
//         expect(res.body).toBe({})
//       })
//     })
//   })
// })

//promise.all in controller to prevent conflicts of empty array being 200 and 404 in different situations, 200 if id is good but no data, 404 if id is not found----I chained a .then block which negated need for this, any pros/cons of this method?

//sql injection
//data mutation
//check test structure, some tests shifted to wrong endpoint block
//refactor to use async/await?
//refactor variable names to js convention without _'s
//refactor to include destructuring
//check any tests need to prevent false pass by empty array
