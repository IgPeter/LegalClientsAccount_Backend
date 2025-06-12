const authJs = (req, res, next) => {
  const secret = process.env.SECERET;

  const token =
    req.body.token || req.params.token || req.headers("authorization");

  const splitToken = token.split(" ")[1];

  if (!splitToken) {
    return res.status(403).send("This user is not authenticated");
  }

  try {
    const verifiedToken = jwt.verify(splitToken, secret);
    req.user = verifiedToken;
  } catch (err) {
    res.status(401).send("Invalid token");
  }

  return next();
};

export default authJs;
