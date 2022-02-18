const {
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  selectArticles,
  addCommentByArticleId
} = require("../models/articles.models.js");
const { selectTopics } = require("../models/topics.models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  updateArticleById(article_id, body)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {article_id} = req.params;
  selectArticleById(article_id)
  .then(()=>{
   return selectCommentsByArticleId(article_id)})
  .then((comments)=>{
    res.status(200).send({comments})
  }).catch((err)=>{
    next(err)
  })
}

exports.getArticles = (req, res, next) => {
  const {query} = req
  selectTopics()
  .then((returnedTopics)=>{
    const topics = returnedTopics.map((topic) => {
      return topic.slug
      })
      return topics
  })
  .then((topicsArray)=>{
  selectArticles(query, topicsArray).then((articles)=>{
    res.status(200).send({articles})
  }).catch((err)=>{
    next(err)
  })
})
}

exports.postCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params
  const {body} = req;
  addCommentByArticleId(body, article_id)
  .then((comment)=>{
    res.status(201).send({comment})
  }).catch((err)=>{
    next(err);
  })
}