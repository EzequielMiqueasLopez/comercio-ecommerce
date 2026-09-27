-- =========================================================
-- Esquema PostgreSQL - Sistema de Comercio Electrónico
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- para gen_random_uuid()

-- =========================================================
-- Tabla: usuarios
-- =========================================================
CREATE TABLE usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,              -- bcrypt/argon2 hash, nunca texto plano
    rol             VARCHAR(20) NOT NULL DEFAULT 'cliente'
                        CHECK (rol IN ('cliente', 'admin')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- Tabla: productos
-- =========================================================
CREATE TABLE productos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(150) NOT NULL,
    descripcion     TEXT,
    precio          NUMERIC(10,2) NOT NULL CHECK (precio > 0),
    stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- Tabla: pedidos (cabecera)
-- =========================================================
CREATE TABLE pedidos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    estado          VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                        CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'cancelado')),
    total           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- Tabla: pedido_detalle (líneas del pedido, N:M usuario-producto)
-- =========================================================
CREATE TABLE pedido_detalle (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id           UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id         UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad            INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario     NUMERIC(10,2) NOT NULL CHECK (precio_unitario > 0),
    UNIQUE (pedido_id, producto_id)
);

-- =========================================================
-- Índices útiles
-- =========================================================
CREATE INDEX idx_pedidos_usuario_id ON pedidos(usuario_id);
CREATE INDEX idx_pedido_detalle_pedido_id ON pedido_detalle(pedido_id);
CREATE INDEX idx_pedido_detalle_producto_id ON pedido_detalle(producto_id);
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- =========================================================
-- Trigger genérico para updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_productos_updated_at
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
