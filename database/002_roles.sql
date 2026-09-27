-- =========================================================
-- Migración: ampliar los roles de usuario
-- admin     -> acceso total (productos + pedidos + usuarios)
-- productos -> solo puede VER el catálogo de productos
-- pedidos   -> solo puede VER el historial de pedidos
-- =========================================================

ALTER TABLE usuarios DROP CONSTRAINT usuarios_rol_check;

ALTER TABLE usuarios ADD CONSTRAINT usuarios_rol_check
    CHECK (rol IN ('admin', 'productos', 'pedidos'));

-- Si ya tienes usuarios con el rol antiguo 'cliente', conviértelos a 'productos'
-- (o al rol que prefieras) para que la restricción no falle:
UPDATE usuarios SET rol = 'productos' WHERE rol = 'cliente';
