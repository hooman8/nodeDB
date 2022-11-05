module.exports = {
  index: (req, res) => {
    res.json({ hello: "there" });
  },
  chat: (req, res) => {
    console.log("inside of chat function");
    res.render("chat");
  },
};
