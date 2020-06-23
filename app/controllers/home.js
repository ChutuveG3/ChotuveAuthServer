exports.home = (req, res) => {
  res.send({ message: 'Auth server hello world' });
};

exports.end = (req, res) => res.status(200).end();

exports.endWithPrivilege = (req, res) => res.status(200).send({ privilege: req.privilege });
