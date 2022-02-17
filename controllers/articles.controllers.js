const {
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  selectArticles
} = require("../models/articles.models.js");

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
  selectArticles().then((articles)=>{
    res.status(200).send({articles})
  }).catch((err)=>{
    next(err)
  })
}