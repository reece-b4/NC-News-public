const request = require("supertest");
const db = require("../db/connection.js");

const testData = require("../db/data/test-data/");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

// is not empty array assertion ok here as that table shouldnt ever be empty from the start? For purpose of this task yes as we are seeding with this data?
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
    test("404 - given correct id with no data, returns message: not found", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
        });
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', ()=>{
    test('200 - given article id responds with all comments for that article. Each comment should have properties: comment_id, votes, created_at, author, body', ()=> {
      return request(app).get('/api/articles/1/comments')
      .expect(200)
      .then((res)=>{

        const comments = res.body.comments;
        comments.forEach((comment)=>{
          expect(comments).not.toEqual([]);
          expect.objectContaining({comment_id: expect.any(Number),
          votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String)
      })
        })
      })
    })
  })
})
//add line that ensures empty array doesnt pass test incorrectly
// errors: given wrong path, wrong id type, non existent id, correct id but no comments

//promise.all in controller to prevent conflicts of empty array being 200 and 404 in different situations, 200 if id is good but no data, 404 if id is not found,

//   sql injection
//data mutation
//potentially refactor created_at in get article by id path
//when commit check change to previous code, added line to check no empty array but commited with previous push by accident without noting it, added.length assertion to get/api/topics, refactored error handling
