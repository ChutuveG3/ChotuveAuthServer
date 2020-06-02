exports.home = (req, res) => {
  res.send({ message: 'Auth server hello world' });
};

exports.end = (req, res) => res.status(200).end();
