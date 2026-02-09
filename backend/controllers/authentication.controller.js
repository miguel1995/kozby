const authenticationService = require('../services/authentication.service');

const postLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos.' });
  }
  try {
    const user = await authenticationService.readValidateUser(username);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (user) {
      if (user.password === password) {
        const token = "mi_token_de_ejemplo";
        return res.status(200).json({ message: 'Login exitoso',token });
      } else {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

    }


  } catch (err) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

};

module.exports = {
  postLogin,
};
