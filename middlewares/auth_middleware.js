const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //Accede al header de autorizacion, tiene el Bearer Token
  const authHeader = req.headers["authorization"];

  console.log(authHeader);
  //Elimina "Bearer" se queda solamente con el token
  const token = authHeader && authHeader.split(" ")[1];

  //Si no hay token => log in
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, no token provided, please log in to continue",
    });
  }

  //Decodifica el token con la private key con la que fue firmado en authcontroller
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decodedToken);

    //Asigna el token decodificado al atributo userInfo (que es la informacion del usuario firmada en authcontroller)
    req.userInfo = decodedToken;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access denied, no token provided, please log in to continue",
    });
  }
};

module.exports = authMiddleware;
