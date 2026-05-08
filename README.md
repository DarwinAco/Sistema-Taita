📱 SISTEMA TAITA - POS Offline-First

📌 Descripción

SISTEMA TAITA es una plataforma web desarrollada como "prototipo" para la gestión de comandas, orientada a garantizar la operatividad continua del personal (mozos y cajeros) mediante una solución digital con arquitectura Offline-First, diseñada para entornos con conectividad inestable.

🚨 Problema

El establecimiento presenta las siguientes dificultades:
* Pérdida de pedidos debido a cortes o fallas en la red WiFi local.
* Lentitud y desorden por el uso tradicional de notas de papel.
* Falta de sincronización fluida entre los pedidos tomados en el salón y la preparación en barra.
* Dificultad para realizar una auditoría exacta de la caja al final del turno.

🎯 Objetivo

Desarrollar una plataforma web que permita:
* Registrar pedidos desde celulares sin depender de una conexión a internet.
* Sincronizar automáticamente la información con la caja en cuanto regrese la red.
* Mejorar la rapidez de atención y la experiencia de usuario del personal.

👥 Usuarios

* Mozos: Toman pedidos desde sus propios celulares en el salón, con o sin internet.
* Cajeros / Barman: Gestionan la cola de preparación en tiempo real desde un monitor.
* Administradores: Auditan las transacciones y verifican la recaudación total.

⚙️ Funcionalidades

📱 Mozo
* Visualización del catálogo de productos y precios.
* Registro rápido de cantidades.
* Interfaz móvil (uso a una mano).
* Cola visual de pedidos locales (pendientes de sincronizar).

💻 Cajero / Barra
* Dashboard de recepción en tiempo real.
* Cambio de estados de comanda (Nuevos, Preparando, Entregado).

📊 Administrador
* Sistema de login seguro con credenciales.
* Tabla de auditoría con identificadores únicos (UUIDv4).
* Cálculo automático de la recaudación en caja.

⚙️ Sistema
* Auto-sincronización de datos al detectar red (Background Sync).
* Diseño responsive (Mobile-First para mozos, Desktop para caja).
* Almacenamiento persistente en navegador (LocalStorage).

🧠 Características

* Latencia de 0ms (Interfaz Optimista) para un registro al instante.
* Interfaz intuitiva enfocada en la usabilidad y la Ley de Fitts para pantallas táctiles.
* Cero pérdida de datos ante fallos de red.
* Evita la duplicación de comandas mediante códigos únicos.

🛠️ Tecnologías

* HTML5
* CSS3 (Flexbox & Grid)
* Vanilla JavaScript
* LocalStorage API
* FontAwesome
* GitHub Pages

🚀 Alcance (MVP)

El sistema implementa un Producto Mínimo Viable (MVP) para el curso de Interacción Humano-Computador, incluyendo las funcionalidades esenciales de frontend para validar la arquitectura Offline-First y demostrar la solución a los cuellos de botella en la atención.

📈 Impacto

* 0% de pérdida de pedidos por red.
* +50% de rapidez en la atención al cliente.
* Adiós a las comandas de papel (Impacto ecológico y organizativo).
* Auditoría de caja exacta y libre de errores matemáticos.

📍 Ubicación

Cajamarca, Perú
