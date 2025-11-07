// ----- Productos personalizados -----
const ALL_ITEMS = [
  {
    id: 1,
    name: "Llaveros",
    price: 4.80,
    category: "Accesorios",
    series: "Básicos",
    rating: 4.5,
  img:"https://i.pinimg.com/1200x/b5/a3/5c/b5a35cd090d02a3fa46dc9207af599b1.jpg"
  },
  {
    id: 2,
    name: "Lapiceros",
    price: 4.85,
    category: "Escritura",
    series: "Básicos",
    rating: 4.3,
    img: "https://i.pinimg.com/736x/ed/d4/80/edd480025339598fef987e93d23e1c0a.jpg"
  },
  {
    id: 3,
    name: "Pulseras personalizadas",
    price: 5.95,
    category: "Accesorios",
    series: "Personalizados",
    rating: 4.7,
    img: "https://i.pinimg.com/1200x/b1/bc/fc/b1bcfc06b64e673c8dc090c8f314c334.jpg"
  },
  {
    id: 4,
    name: "Separadores personalizados",
    price: 4.15,
    category: "Oficina",
    series: "Personalizados",
    rating: 4.2,
    img: "https://i.pinimg.com/736x/e5/b5/67/e5b56706268f0d485b23b6662d96667a.jpg"
  },
  {
    id: 5,
    name: "Portavasos",
    price: 5.00,
    category: "Hogar",
    series: "Básicos",
    rating: 4.0,
    img: "https://i.pinimg.com/1200x/0a/19/29/0a1929549ecee8147f68803508e20508.jpg"
  },
  {
    id: 6,
    name: "Cases + PopSockets",
    price: 20.00,
    category: "Tecnología",
    series: "Combos",
    rating: 4.8,
    img: "https://i.pinimg.com/1200x/48/2f/46/482f46e18781ec7ced9d2644acbc1152.jpg"
  },
  {
    id: 7,
    name: "Cuadros (fotos decoradas)",
    price: 25.00,
    category: "Decoración",
    series: "Personalizados",
    rating: 4.9,
    img: "https://i.pinimg.com/1200x/ae/bf/63/aebf6312d83592594cb1be975e8e699b.jpg"
  }
];

// Si necesitas mantener las variables SALES y COLLECTIBLES para otras partes del código,
// puedes definirlos como arrays vacíos o con tus productos:
const SALES = ALL_ITEMS.filter(item => item.category !== "Colección");
const COLLECTIBLES = ALL_ITEMS.filter(item => item.category === "Colección");