/**
 * Adaptador de entrada: traduce peticiones HTTP a llamadas de casos de uso.
 * No contiene reglas de negocio, solo orquesta request -> usecase -> response.
 */
class UsuarioController {
  constructor({ crearUsuario, listarUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, autenticarUsuario, jwtService }) {
    this.crearUsuario = crearUsuario;
    this.listarUsuarios = listarUsuarios;
    this.obtenerUsuario = obtenerUsuario;
    this.actualizarUsuario = actualizarUsuario;
    this.eliminarUsuario = eliminarUsuario;
    this.autenticarUsuario = autenticarUsuario;
    this.jwtService = jwtService;
  }

  crear = async (req, res) => {
    try {
      const usuario = await this.crearUsuario.ejecutar(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const usuarios = await this.listarUsuarios.ejecutar();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  obtener = async (req, res) => {
    try {
      const usuario = await this.obtenerUsuario.ejecutar(req.params.id);
      res.json(usuario);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const usuario = await this.actualizarUsuario.ejecutar(req.params.id, req.body);
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      const resultado = await this.eliminarUsuario.ejecutar(req.params.id);
      res.json(resultado);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const usuario = await this.autenticarUsuario.ejecutar(req.body);
      const token = this.jwtService.generar({ sub: usuario.id, rol: usuario.rol });
      res.json({ token, usuario: usuario.toPublicObject() });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
}

module.exports = UsuarioController;
