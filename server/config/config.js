// config/config.js

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_cambiar_en_produccion',
  JWT_EXPIRES_IN: '24h'
}; 