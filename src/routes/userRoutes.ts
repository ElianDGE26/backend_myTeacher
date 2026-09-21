/**
 * @fileoverview Enrutador de Usuarios y Autenticación (User & Auth Routes)
 * @module routes/userRoutes
 * @description Define las rutas HTTP para la administración y consulta de usuarios (estudiantes y tutores), así como los flujos de autenticación, registro, inicio y cierre de sesión, cambio de contraseña y renovación de tokens.
 * Base path: `/api/users`
 */

import { Router } from "express";
import { 
    createUser, 
    getAllUsers, 
    getUserByid, 
    updateUserByid, 
    deleteUserByid 
} from "../controllers/userControllers";
import { 
    loginUser, 
    registerUSer, 
    changePassword, 
    logoutUser, 
    refreshToken 
} from "../controllers/auth/authControllers";
import { verifyToken } from "../middelwears/authMiddelwears";

const router = Router();

// ==========================================
// Rutas GET
// ==========================================

/**
 * Obtiene la lista completa de usuarios registrados en la plataforma.
 *
 * @name GET /
 * @route GET /api/users/
 * @access Privado
 * @middleware verifyToken
 */
router.get("/", verifyToken, getAllUsers);

/**
 * Obtiene la información del perfil detallado de un usuario por su ID.
 *
 * @name GET /:id
 * @route GET /api/users/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del usuario.
 */
router.get("/:id", verifyToken, getUserByid);

// ==========================================
// Rutas POST
// ==========================================

/**
 * Crea y registra directamente un nuevo usuario en la base de datos (vía controlador de usuarios).
 *
 * @name POST /create
 * @route POST /api/users/create
 * @access Público
 * @param {User} body.body.required - Datos del usuario a crear.
 */
router.post("/create", createUser);

// ==========================================
// Rutas PUT
// ==========================================

/**
 * Actualiza la información del perfil de un usuario existente por su ID.
 *
 * @name PUT /update/:id
 * @route PUT /api/users/update/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del usuario.
 * @param {Partial<User>} body.body.required - Campos del perfil a actualizar.
 */
router.put("/update/:id", verifyToken, updateUserByid);

/**
 * Permite cambiar la contraseña de un usuario validando su contraseña actual y estableciendo la nueva.
 *
 * @name PUT /auth/change-password
 * @route PUT /api/users/auth/change-password
 * @access Público
 * @param {string} body.email - Correo electrónico del usuario.
 * @param {string} body.oldPassword - Contraseña actual del usuario.
 * @param {string} body.newPassword - Nueva contraseña a asignar.
 */
router.put("/auth/change-password", changePassword);

// ==========================================
// Rutas DELETE
// ==========================================

/**
 * Elimina la cuenta y registro de un usuario de la base de datos por su ID.
 *
 * @name DELETE /delete/:id
 * @route DELETE /api/users/delete/:id
 * @access Privado
 * @middleware verifyToken
 * @param {string} id.path.required - ID de MongoDB (ObjectId) del usuario a eliminar.
 */
router.delete("/delete/:id", verifyToken, deleteUserByid);

// ==========================================
// Rutas de Autenticación (Auth)
// ==========================================

/**
 * Registra un nuevo usuario en la plataforma con contraseña hasheada y asignación de rol (estudiante o tutor).
 *
 * @name POST /auth/register
 * @route POST /api/users/auth/register
 * @access Público
 * @param {string} body.name - Nombre completo del usuario.
 * @param {string} body.email - Correo electrónico único del usuario.
 * @param {string} body.password - Contraseña en texto plano a encriptar.
 * @param {string} body.role - Rol del usuario ('student', 'tutor', 'admin').
 * @param {string} [body.phone] - Número telefónico de contacto.
 */
router.post("/auth/register", registerUSer);

/**
 * Autentica las credenciales de un usuario y genera tokens JWT (Access Token y Refresh Token).
 *
 * @name POST /auth/login
 * @route POST /api/users/auth/login
 * @access Público
 * @param {string} body.email - Correo electrónico registrado.
 * @param {string} body.password - Contraseña del usuario.
 */
router.post("/auth/login", loginUser);

/**
 * Cierra la sesión activa del usuario invalidando el Refresh Token almacenado en las sesiones.
 *
 * @name POST /auth/logout
 * @route POST /api/users/auth/logout
 * @access Público
 * @param {string} body.refreshToken - Token de actualización a revocar.
 */
router.post("/auth/logout", logoutUser);

/**
 * Emite un nuevo Access Token a partir de un Refresh Token válido y no revocado.
 *
 * @name POST /auth/refresh-token
 * @route POST /api/users/auth/refresh-token
 * @access Público
 * @param {string} body.refreshToken - Token de actualización vigente.
 */
router.post("/auth/refresh-token", refreshToken);

export default router;


