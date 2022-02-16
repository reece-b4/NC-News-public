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

//ticket 14
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200 - responds with article object with properties: author<username from users table>, title, article_id, body, topic, created_at, votes", () => {
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

  //ticket 7
  describe("PATCH", () => {
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
    //already covered by get request error?
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
    test("404 - given correct id with no data, returns message: not found", () => {
      const votes = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/999999")
        .send(votes)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
        });
    });
    //if no code change needed outside of test, is the error test redundant?
    test(" 400 - given incorrect votes data type returns message: bad request", () => {
      const votes = { inc_votes: 'not-a-valid-vote-count' };
      return request(app)
        .patch("/api/articles/999999")
        .send(votes)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test(" 400- given incorrect but existing key returns message: not found", () => {
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

//ticket 21
describe('/api/users', () =>{
  describe('GET', () => {
    test('200 - returns array of objects with username property', () => {
      return request(app).get('/api/users')
      .expect(200)
      .then((res)=>{
        res.body.usernames.forEach((user)=>{
          expect.objectContaining({
            username: expect.any(String)
          })
          expect.not.objectContaining({
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
        })
      })
    })
  })
})

//promise.all in controller to prevent conflicts of empty array being 200 and 404 in different situations, 200 if id is good but no data, 404 if id is not found,

//sql injection
//data mutation

//while waiting for pull request to be approved, making and switching to new branch to work on also changes previous branch.

// refactor to use async/await?
