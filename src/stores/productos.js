import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductosStore = defineStore('productos', () => {
  const products = ref([
    {
      id: 1,
      name: 'Mazda MX-5',
      description: 'Rendimiento y estilo en un solo auto.',
      price: 183200000,
      discount: 20,
      image: 'https://media-assets.mazda.eu/image/upload/q_auto,f_auto/mazdaes/globalassets/cars/2027-mazda-mx-5-rf/assets/masonry-grid/mme-mazda-mx-5-rf-masonry-grid-mobile-01.jpg?rnd=4a65a9',
      images: [
        'https://media-assets.mazda.eu/image/upload/q_auto,f_auto/mazdaes/globalassets/cars/2027-mazda-mx-5-rf/assets/masonry-grid/mme-mazda-mx-5-rf-masonry-grid-mobile-01.jpg?rnd=4a65a9',
        'https://hips.hearstapps.com/es.h-cdn.co/cades/contenidos/10117/4mazda_mx-5rf_showmodel_fq_open_white.jpg?resize=640:*',
        'https://www.elcarrocolombiano.com/wp-content/uploads/2024/01/20240125-MAZDA-MX-5-2024-ACTUALIZACION-02.jpg'
      ],
      category: 'Deportivos',
      characteristics: 'El Mazda MX-5 es un automóvil deportivo de dos plazas que destaca por su diseño moderno y aerodinámico. Cuenta con un techo descapotable retráctil, motor de 2.0 litros y 181 caballos de fuerza, transmisión manual de seis velocidades y tracción trasera. Su interior combina comodidad y tecnología, con pantalla multimedia, conectividad Apple CarPlay y Android Auto, cámara de reversa y sistemas de seguridad. Es un vehículo ideal para quienes buscan una experiencia de conducción dinámica, libertad y estilo deportivo.',
      rating: 5
    },
    {
      id: 2,
      name: 'Jeep Cherokee XJ',
      description: 'Comodidad y espacio para tus aventuras.',
      price: 30000000,
      discount: 0,
      image: 'https://www.diariomotor.com/imagenes/2026/03/jeep-cherokee-xj-pioneer-concept-01-69c8e37039c2f.jpg?class=XL',
      category: 'Todoterreno',
      images: [
        'https://www.diariomotor.com/imagenes/2026/03/jeep-cherokee-xj-pioneer-concept-01-69c8e37039c2f.jpg?class=XL',
        'https://hagerty-media-prod.imgix.net/2026/08/RR_JeepCherokeeXJ_DSC05024-scaled.jpg?auto=format%2Ccompress&ixlib=php-3.3.0',
        'https://images.squarespace-cdn.com/content/v1/5febbf6e3ce7d665de39acdd/1638035134650-GD87KN6L2CZ25SHWFOQX/green%2Bcherokee%2BXJ%2BSport%2B.jpg'
      ],
      characteristics: 'Su estilo todoterreno, carrocería de líneas cuadradas y amplia cabina le dan una personalidad única. Está equipada, en sus versiones más reconocidas, con un potente motor de 4.0 litros, tracción 4x4 y una suspensión diseñada para afrontar caminos exigentes. Su interior ofrece espacio para cinco pasajeros y comodidad para viajes largos. Es una excelente opción para quienes buscan resistencia, versatilidad y un vehículo con carácter propio.',
      rating: 4
    },
    {
      id: 3,
      name: 'Ford Mustang 1967',
      description: 'Un ícono de la carretera que nunca pasa de moda.',
      price: 140000000,
      discount: 0,
      image: 'https://am-s3-bucket-assets.s3.eu-west-2.amazonaws.com/silverstone/prod/lot_images/large/REC17257-1/REC17257-1_27.jpg.webp?dummy=1793001457',
      category: 'Deportivos',
      images: [
        'https://am-s3-bucket-assets.s3.eu-west-2.amazonaws.com/silverstone/prod/lot_images/large/REC17257-1/REC17257-1_27.jpg.webp?dummy=1793001457',
        'https://www.gallery-aaldering.com/wp-content/uploads/2025/06/ford-mustang-shelby-gt-500-fastback-1967.jpg',
        'https://www.gallery-aaldering.com/wp-content/uploads/2025/06/ford-mustang-fastback-s-code-390-1967.jpg'
      ],
      characteristics: 'automóvil deportivo clásico que destaca por su diseño musculoso, sus líneas elegantes y su inconfundible estilo americano. Cuenta con una amplia parrilla frontal, capó alargado, faros característicos y las clásicas luces traseras triples. Estuvo disponible en versiones coupé, Fastback y convertible. Según su configuración, incorpora motores V8 de 4.7 o 6.4 litros, con potencias que pueden alcanzar los 320 caballos de fuerza. Su interior combina detalles clásicos con una distribución cómoda y un tablero de diseño vintage. Es una verdadera joya automotriz para quienes aprecian la potencia, la historia y el estilo de los deportivos clásicos.',
      rating: 5
    },
    {
      id: 4,
      name: 'BMW 218i Gran Coupé',
      description: 'Diseño moderno para recorrer la ciudad.',
      price: 119700000,
      discount: 10,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxWFTP2S5yaZ2-gA-I5ht3adD8deptmQiYf2xXJlhZf8gZQABYBUHExraI&s=10',
      category: 'Urbanos',
      images: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxWFTP2S5yaZ2-gA-I5ht3adD8deptmQiYf2xXJlhZf8gZQABYBUHExraI&s=10',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOoLn1_KdCoqAwyDjgTR6LoBHHDS-Lv9YZ1SSncMUoE3F_LIx2IkLraIF&s=10',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiVD2IvMB5lA6tjLJvvdYSHZnjClBzpHa_swm9Ao2HJc5h30njw12RDRtQ&s=10'
      ],
      characteristics: 'combina elegancia, tecnología y un diseño deportivo de líneas aerodinámicas. Cuenta con una carrocería de cuatro puertas, detalles exteriores sofisticados y una parrilla frontal característica de BMW. Está equipado con un motor TwinPower Turbo de 1.5 litros y tres cilindros, que desarrolla aproximadamente 140 a 156 caballos de fuerza, dependiendo del año y la versión. Su transmisión automática ofrece una conducción suave y dinámica, mientras que su interior incorpora asientos deportivos, pantalla multimedia, iluminación ambiental y acabados de alta calidad. Además, dispone de faros LED, sensores de estacionamiento y sistemas de asistencia al conductor.',
      rating: 4
    },
    {
      id: 5,
      name: 'Toyota Prado TX-L 2022',
      description: 'Listo para salir de la rutina y explorar.',
      price: 259700000,
      discount: 15,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtJP-DXc4vh2duF75wy5XOZFUVQw32RqpP_WFd-M5Xg3TUkhJ4LRES4a8&s=10',
      category: 'Todoterreno',
      images: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtJP-DXc4vh2duF75wy5XOZFUVQw32RqpP_WFd-M5Xg3TUkhJ4LRES4a8&s=10',
        'https://tradexauto.com/wp-content/uploads/2022/02/ToyotaLandCruiserPrado2021estacionado-1920w-1024x768.jpg.webp',
        'https://tradexauto.com/wp-content/uploads/2021/09/image.jpg'
      ],
      characteristics: 'camioneta SUV que combina elegancia, comodidad y potencia. Cuenta con un diseño robusto, capacidad para siete pasajeros y tracción 4x4, ideal para viajes y terrenos exigentes. Según su versión, incorpora un motor de gasolina de 4.0 litros o diésel de 2.8 litros, transmisión automática y un interior espacioso con acabados de calidad. Es una excelente opción para quienes buscan aventura, seguridad y confort en un solo vehículo.',
      rating: 5
    },
    {
      id: 6,
      name: 'Mercedes-Benz Clase S',
      description: 'Una combinación de confort y sofisticación.',
      price: 225000000,
      discount: 0,
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/34/0_Mercedes-Maybach_S_580_1.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original',
      category: 'Familiares',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/3/34/0_Mercedes-Maybach_S_580_1.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original',
        'https://hips.hearstapps.com/hmg-prod/images/mercedes-benz-clase-s-2025-01-67eed736d67ad.jpg?crop=0.7802666666666667xw:1xh;center,top&resize=1200:*',
        'https://media.revistagq.com/photos/698a022e4c8c59d77fd79703/16:9/w_2560%2Cc_limit/26c0017_041.jpg'
      ],
      characteristics: 'sedán de lujo que destaca por su diseño elegante, comodidad y tecnología avanzada. Cuenta con un amplio interior de acabados premium, asientos ergonómicos, iluminación ambiental y pantallas digitales. Según su versión, incorpora motores de seis u ocho cilindros, transmisión automática y sistemas de suspensión que ofrecen una conducción suave. Además, dispone de techo panorámico, conectividad multimedia y avanzados asistentes de seguridad. Es ideal para quienes buscan una combinación de exclusividad, sofisticación y confort en cada viaje.',
      rating: 5
    },
    {
      id: 7,
      name: 'Porsche 911 GT3 RS',
      description: 'Un deportivo legendario con carácter y precisión.',
      price: 2590000000,
      discount: 12,
      image: 'https://www.levorecollection.com/wp-content/uploads/2026/03/Porsche-911-GT3-RS-1024x683.jpg',
      images: [
        'https://www.levorecollection.com/wp-content/uploads/2026/03/Porsche-911-GT3-RS-1024x683.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm0YIOwfLKKrAB4RnWPH2j25fKShfJ43FFkcwL8suAaqrWaRNwv1go6ZJD&s=10',
        'https://newsroom.porsche.com/dam/jcr:83d3c489-9a28-4469-bd6b-219a15b899c2/b-titelShowroom2.jpeg'
      ],
      category: 'Deportivos',
      characteristics: 'automóvil deportivo de alto rendimiento que destaca por su diseño agresivo y aerodinámico, inspirado en los vehículos de competición. Cuenta con un motor bóxer de seis cilindros y 4.0 litros, capaz de generar 525 caballos de fuerza. Incorpora una transmisión automática PDK de siete velocidades, tracción trasera y un imponente alerón posterior que mejora su aerodinámica. Su interior combina acabados deportivos, materiales ligeros y tecnología avanzada. Es una auténtica expresión de ingeniería, elegancia y espíritu de competición.',
      rating: 5
    },
    {
      id: 8,
      name: 'Ford Mustang Dark Horse',
      description: 'Potencia y estilo clásico para cada trayecto.',
      price: 320000000,
      discount: 8,
      image: 'https://live.dealer-asset.co/images/br1166/news/ford-colombia-mustang-dark-horse-noticia.jpg?s=1024',
      images: [
        'https://live.dealer-asset.co/images/br1166/news/ford-colombia-mustang-dark-horse-noticia.jpg?s=1024',
        'https://www.popsci.com/wp-content/uploads/2023/02/13/Mustang-Dark-Horse-Carbon-Fiber-Wheels_01.jpg',
        'https://weupreviewimagesprd.blob.core.windows.net/br1166/siteassets/ford-colombia-mustang-dark-horse-lateral.jpg'
      ],
      category: 'Deportivos',
      characteristics: 'eportivo de alto rendimiento que destaca por su diseño agresivo, líneas aerodinámicas y detalles exclusivos. Cuenta con un potente motor Coyote V8 de 5.0 litros capaz de generar 500 caballos de fuerza. Incorpora transmisión manual de seis velocidades, tracción trasera, suspensión MagneRide y frenos Brembo. Su exterior luce un alerón deportivo y acabados distintivos, mientras que su interior combina tecnología, comodidad y detalles inspirados en la competición. Es una combinación de potencia, diseño y personalidad deportiva.',
      rating: 5
    },
    {
      id: 9,
      name: 'BMW Serie 3 Berlina',
      description: 'Confort ejecutivo y dinámica para la ciudad.',
      price: 115900000,
      discount: 0,
      image: 'https://www.bmwautomotor.com/wp-content/uploads/2018/09/serie3_3.webp',
      images: [
        'https://www.bmwautomotor.com/wp-content/uploads/2018/09/serie3_3.webp',
        'https://www.ceccatomotors.com/media/td0mjun0/p90462492_lowres_the-new-bmw-3-series.jpg?format=webp',
        'https://img.autotrader.co.za/27565062/Crop860x650'
      ],
      category: 'Urbanos',
      characteristics: 'Combina elegancia, comodidad y deportividad en un diseño moderno de cuatro puertas. Cuenta con una parrilla frontal característica, líneas aerodinámicas y un interior espacioso con acabados de alta calidad. Según su versión, incorpora motores TwinPower Turbo, transmisión automática de ocho velocidades y tracción trasera o integral. También ofrece pantalla multimedia, conectividad inteligente, iluminación LED y sistemas de asistencia al conductor.',
      rating: 4
    },
    {
      id: 10,
      name: 'Range Rover Evoque',
      description: 'Versatilidad y elegancia para la ciudad y la aventura.',
      price: 165000000,
      discount: 5,
      image: 'https://media.cdn-jaguarlandrover.com/api/v2/images/119854/w/1600/h/900.jpg',
      images: [
        'https://media.cdn-jaguarlandrover.com/api/v2/images/119854/w/1600/h/900.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCcGE0XpfkQqn6QACFxR2fMFEUSi557-c9J82u6NsHNDmcypc09yeuRiwN&s=10',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCy00gq823bLtEg2HlJc_u2O7L3_ulM1dSou_b0tY2UhoEv0XoZROax_Q&s=10'
      ],
      category: 'Todoterreno',
      characteristics: 'SUV de lujo que destaca por su diseño moderno, elegante y deportivo. Cuenta con una silueta tipo coupé, techo panorámico según versión, faros LED y manijas de puertas retráctiles. Su interior ofrece acabados premium, asientos cómodos y una pantalla táctil multimedia de gran tamaño. Además, incorpora tecnologías de asistencia al conductor y opciones de tracción en las cuatro ruedas para afrontar diferentes terrenos.',
      rating: 4
    }
  ])

  const categorias = computed(() => [
    ...new Set(products.value.map(product => product.category).filter(Boolean))
  ])

  function buscarProducto(id) {
    return products.value.find(product => product.id === Number(id))
  }

  function obtenerProductosPorCategoria(categoria) {
    return products.value.filter(product => product.category === categoria)
  }

  return {
    products,
    categorias,
    buscarProducto,
    obtenerProductosPorCategoria
  }
})
