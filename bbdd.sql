CREATE DATABASE IF NOT EXISTS gamexstore_db;
USE gamexstore_db;

-- 1. Table des Produits (L'essentiel pour le chatbot)
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(100),
    imagen_url VARCHAR(255)
);

-- 2. Table FAQ (Pour les questions répétitives)
CREATE TABLE faq (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL
);

-- 3. Table des Conversations (Pour l'historique du chatbot)
CREATE TABLE chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    mensaje_usuario TEXT,
    respuesta_bot TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 4. Table pour le contenu statique du site (Pages, Blog, Services)
CREATE TABLE site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pagina_nombre VARCHAR(100), -- Exemple: 'Blog', 'Contacto', 'Home'
    seccion VARCHAR(100),       -- Exemple: 'Horarios', 'Ubicación', 'Resumen'
    contenido TEXT,             -- El klem elli foust el page
    url_relativa VARCHAR(255)   -- Path: '/contacto.html'
);

INSERT IGNORE INTO productos (id, nombre, descripcion, precio, stock, categoria, imagen_url) VALUES

-- ── CONSOLAS ──────────────────────────────────────────────
(1,  'PlayStation 5 Disc Edition',
     'La consola next-gen de Sony con lector de discos. 4K a 120fps, SSD ultrarrápido, mando DualSense con feedback háptico y vibración adaptativa.',
     499.00, 20, 'consola', 'image/products/card/1.webp'),

(2,  'Nintendo Switch OLED',
     'Pantalla OLED de 7 pulgadas, base LAN integrada y 64GB de almacenamiento interno. Juega en casa o en modo portátil donde quieras.',
     329.00, 20, 'consola', 'image/products/card/2.webp'),

(3,  'Xbox Series X',
     '12 teraflops de potencia gráfica, SSD Velocity de 1TB y retrocompatibilidad total con miles de juegos. Compatible con Xbox Game Pass.',
     499.00, 20, 'consola', 'image/products/card/3.webp'),

(4,  'Nintendo Switch Lite',
     'Versión compacta y económica de la Switch. Diseño portátil ultraligero ideal para jugar fuera de casa.',
     219.00, 20, 'consola', 'image/products/card/4.webp'),

(16, 'PS5 Slim Digital Edition',
     'La versión más compacta y ligera de la PS5. Sin lector de discos, perfecta para jugar en digital. Mismo rendimiento 4K que el modelo estándar.',
     399.00, 20, 'consola', 'image/products/card/16.webp'),

(17, 'Xbox Series S',
     'La consola Xbox más accesible. Diseño compacto en blanco, 512GB SSD y soporte para juegos a 1440p. Ideal para jugar con Game Pass.',
     299.00, 20, 'consola', 'image/products/card/17.webp'),

-- ── ACCESORIOS ────────────────────────────────────────────
(5,  'Auriculares Razer Kraken V3',
     'Sonido envolvente THX 7.1, micrófono retráctil con cancelación de ruido y almohadillas de memory foam. Compatible con PC, PS5 y Switch.',
     99.00, 20, 'accesorio', 'image/products/card/5.webp'),

(6,  'Teclado Razer BlackWidow V4',
     'Teclado mecánico con switches Green clicky, iluminación RGB Chroma por tecla, anti-ghosting completo y macro keys dedicadas.',
     120.00, 20, 'accesorio', 'image/products/card/6.webp'),

(7,  'Ratón Razer DeathAdder V3',
     'Sensor óptico Focus Pro de 30.000 DPI, 8 botones programables, RGB Chroma y diseño ergonómico ultra ligero de 59g. Ideal para FPS y MMO.',
     110.00, 3,  'accesorio', 'image/products/card/7.webp'),

(8,  'Monitor LG UltraGear 27" 144Hz',
     'Panel IPS Full HD 27" a 144Hz, 1ms GtG, compatible G-Sync y FreeSync Premium. Ideal para e-sports y gaming competitivo.',
     280.00, 20, 'accesorio', 'image/products/card/8.webp'),

(9,  'Auriculares Logitech G Pro X',
     'Auriculares gaming con tecnología Blue VO!CE, sonido DTS 7.1 y almohadillas intercambiables de cuero o espuma.',
     129.00, 20, 'accesorio', 'image/products/card/9.webp'),

(10, 'Teclado HyperX Alloy Origins',
     'Teclado mecánico compacto TKL con switches HyperX Red lineales, construcción de aluminio y iluminación RGB personalizable.',
     89.00, 20, 'accesorio', 'image/products/card/10.webp'),

(18, 'DualSense Edge Controller',
     'El mando inalámbrico premium de PS5 con palancas intercambiables, botones traseros programables y perfiles de juego personalizables.',
     219.00, 20, 'accesorio', 'image/products/card/18.webp'),

(19, 'Xbox Elite Controller Series 2',
     'El mando premium de Xbox con palancas de tensión ajustable, D-pad facetado, 4 botones traseros y batería de hasta 40 horas.',
     179.00, 20, 'accesorio', 'image/products/card/19.webp'),

(20, 'Ratón Razer Basilisk V3',
     'Ratón gaming con rueda de desplazamiento multifunción HyperScroll, sensor Focus+ de 26.000 DPI y 11 botones programables con RGB Chroma.',
     89.00, 20, 'accesorio', 'image/products/card/20.webp'),

(21, 'Teclado Logitech G915 TKL',
     'Teclado mecánico inalámbrico de perfil ultra bajo con switches GL, iluminación RGB LIGHTSYNC y hasta 40 horas de batería.',
     199.00, 20, 'accesorio', 'image/products/card/21.webp'),

(22, 'Auriculares HyperX Cloud Alpha',
     'Auriculares gaming con drivers duales, sonido estéreo de alta fidelidad, micrófono desmontable con cancelación de ruido y compatibilidad multiplataforma.',
     79.00, 20, 'accesorio', 'image/products/card/22.webp'),

(23, 'Monitor LG 32" 4K 144Hz',
     'Monitor gaming 32 pulgadas 4K UHD con panel Nano IPS, 144Hz, 1ms GtG, HDMI 2.1 para PS5 y Xbox Series X.',
     599.00, 3,  'accesorio', 'image/products/card/23.webp'),

(24, 'Alfombrilla Razer Goliathus XXL',
     'Alfombrilla de tela suave de tamaño XXL (920x294mm) con superficie optimizada para sensores de baja y alta DPI y base antideslizante.',
     39.00, 20, 'accesorio', 'image/products/card/24.webp'),

(25, 'PULSE 3D Wireless Headset',
     'Los auriculares oficiales de PS5 con audio 3D Tempest, micrófono dual con reducción de ruido y conectividad USB inalámbrica.',
     99.00, 20, 'accesorio', 'image/products/card/25.webp'),

-- ── JUEGOS ────────────────────────────────────────────────
(11, 'Spider-Man 2',
     'Marvel Spider-Man 2 para PS5. Peter Parker y Miles Morales en un Nueva York de mundo abierto con gráficos next-gen. Exclusivo PS5.',
     70.00, 20, 'juego', 'image/products/card/11.webp'),

(12, 'Zelda: Tears of the Kingdom',
     'La obra maestra de Nintendo. El mundo abierto más grande de Hyrule con mecánicas de construcción únicas. GOTY 2023. Exclusivo Switch.',
     60.00, 20, 'juego', 'image/products/card/12.webp'),

(13, 'God of War Ragnarök',
     'Kratos y Atreus en un viaje épico por los Nueve Reinos. GOTY 2022. Disponible en PS5 y PS4.',
     55.00, 20, 'juego', 'image/products/card/13.webp'),

(14, 'Mario Kart 8 Deluxe',
     'El juego de carreras más vendido de la historia. 48 pistas, 40+ personajes y multijugador local para 4 jugadores. Exclusivo Switch.',
     55.00, 20, 'juego', 'image/products/card/14.webp'),

(15, 'Stellar Blade',
     'Acción RPG exclusivo PS5 con combates espectaculares, gráficos next-gen y una historia de ciencia ficción.',
     70.00, 3,  'juego', 'image/products/card/15.webp'),

(26, 'Super Mario Bros. Wonder',
     'La nueva aventura 2D de Mario más innovadora en décadas. Con la flor Wonder que transforma el juego radicalmente. Exclusivo Switch.',
     55.00, 20, 'juego', 'image/products/card/26.webp'),

(27, "Demon's Souls Remake",
     'El remake definitivo del legendario Demon Soul. Gráficos completamente renovados a 4K. Exclusivo PS5.',
     45.00, 20, 'juego', 'image/products/card/27.webp'),

(28, 'Pokémon Escarlata',
     'La nueva generación de Pokémon en mundo abierto. Explora la región de Paldea, captura más de 400 Pokémon. Exclusivo Switch.',
     55.00, 20, 'juego', 'image/products/card/28.webp'),

(29, 'Forza Horizon 5',
     'El mejor juego de conducción en mundo abierto. Ambientado en México con más de 500 coches. Incluido en Game Pass. Xbox y PC.',
     40.00, 20, 'juego', 'image/products/card/29.webp'),

(30, 'Final Fantasy XVI',
     'Una nueva saga épica de Final Fantasy. Combate de acción frenético con invocaciones gigantescas. Exclusivo PlayStation.',
     60.00, 20, 'juego', 'image/products/card/30.webp'),

(31, 'Animal Crossing: New Horizons',
     'Crea tu isla paradisíaca, personaliza tu vida y conecta con amigos. El juego más relajante de Nintendo Switch.',
     45.00, 20, 'juego', 'image/products/card/31.webp'),

(32, 'Halo Infinite',
     'El regreso del Jefe Maestro en una aventura de mundo abierto. Multijugador gratuito. Incluido en Game Pass. Xbox y PC.',
     35.00, 20, 'juego', 'image/products/card/32.webp');

-- Verificación
SELECT categoria, COUNT(*) as total FROM productos GROUP BY categoria;

