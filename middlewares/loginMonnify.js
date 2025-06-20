import { MonnifyAPI } from "monnify-nodejs-lib";

const getMonnifyAuth = async (req, res, next) => {
  const monnifyClient = new MonnifyAPI({
    MONNIFY_APIKEY: process.env.MONNIFY_API_KEY,
    MONNIFY_SECRET: process.env.MONNIFY_SECRET,
    env: process.env.MONNIFY_ENV,
  });

  const baseUrl =
    monnifyClient.environment == "SANDBOX"
      ? "https:/sandbox.monnify.com"
      : "api.monnify.com";

  const authString = Buffer.from(
    `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    const token = data.responseBody.accessToken;
    req.monnifyToken = token;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

export default getMonnifyAuth;
