module.exports = {
  index: (req, res) => {
    res.json({ hello: "there" });
  },
  chat: (req, res) => {
    res.render("chat");
  },
};
