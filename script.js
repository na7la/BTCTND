// Obtenir l'élément où le prix sera affiché
const priceElement = document.getElementById("price");

// API pour obtenir le prix du Bitcoin en USD
const BTC_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
// API pour obtenir le taux de change USD -> TND
const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

// Stocker la valeur précédente du prix du Bitcoin en TND
let previousBtcPriceInTND = 0;

// Liste des produits avec leur prix en TND et l'ID de l'élément HTML pour l'affichage
const products = [
  { name: "ka3ba Gaucho", priceTND: 0.315, elementId: "gaucho-calcul" },
  { name: "Année de loyer", priceTND: 12000, elementId: "app-calcul" },
  { name: "Baguette", priceTND: 0.2, elementId: "pain-calcul" },
  { name: "Litre d'huile", priceTND: 20, elementId: "huile-calcul" },
  { name: "BIC 4 couleurs", priceTND: 5.9, elementId: "bic-calcul" },
  { name: "Suzuki Swift", priceTND: 53400, elementId: "swift-calcul" },
  { name: "JBL Flip 6", priceTND: 485, elementId: "jbl-calcul" },
  { name: "Spaghetti 2", priceTND: 0.41, elementId: "spag-calcul" },
  { name: "Vinyl Daft Punk", priceTND: 119, elementId: "daft-punk-calcul" },
  { name: "Stika Birra", priceTND: 49.466, elementId: "stika-calcul" },
  { name: "Kilou Degla", priceTND: 5.2, elementId: "degla-calcul" },
  { name: "7oka Harissa (380gr)", priceTND: 3.5, elementId: "harissa-calcul" },
  {
    name: "Lave Linge LG (7Kg)",
    priceTND: 1699,
    elementId: "lave-linge-calcul",
  },
  { name: "Rouleau PQ", priceTND: 0.95, elementId: "pq-calcul" },
  { name: "Perceuse Bosch", priceTND: 134, elementId: "perceuse-calcul" },
  { name: "Stan Smith", priceTND: 430, elementId: "stan-smith-calcul" },
];

// Fonction pour obtenir et mettre à jour le prix du Bitcoin
async function fetchBitcoinPrice() {
  try {
    // Obtenir le taux de conversion USD -> TND
    const rateResponse = await fetch(EXCHANGE_RATE_API_URL);
    const rateData = await rateResponse.json();
    const usdToTndRate = rateData.rates.TND;

    // Obtenir le prix du Bitcoin en USD
    const btcResponse = await fetch(BTC_API_URL);
    const btcData = await btcResponse.json();
    const btcPriceInUSD = btcData.bitcoin.usd;

    // Convertir le prix en TND
    const btcPriceInTND = btcPriceInUSD * usdToTndRate;

    // Comparer le prix actuel avec le prix précédent et changer la couleur
    if (previousBtcPriceInTND !== 0) {
      if (btcPriceInTND > previousBtcPriceInTND) {
        // Le prix a augmenté : vert
        priceElement.style.color = "green";
      } else if (btcPriceInTND < previousBtcPriceInTND) {
        // Le prix a diminué : rouge
        priceElement.style.color = "red";
      } else {
        // Le prix est inchangé
        priceElement.style.color = "black";
      }
    }

    // Afficher le prix sur la page
    priceElement.textContent = `${Math.round(btcPriceInTND).toLocaleString(
      "fr-FR"
    )} TND`;

    // Mettre à jour la valeur précédente du prix
    previousBtcPriceInTND = btcPriceInTND;

    // Mettre à jour l'affichage pour chaque produit
    products.forEach((product) => {
      const productElement = document.getElementById(product.elementId);
      const quantity = Math.floor(btcPriceInTND / product.priceTND);

      // Afficher la quantité et l'unité sur deux lignes
      productElement.innerHTML = `
        <div style="font-weight: bold; font-size: 1.4em;">
          ${quantity.toLocaleString("fr-FR").replace(/\s/g, " ")}
        </div>
        <div style="font-size: 0.8em;">
          ${product.name}
        </div>
      `;
    });
  } catch (error) {
    priceElement.textContent = "Erreur de récupération des données";
    console.error("Erreur lors de la récupération du prix du Bitcoin :", error);

    // Afficher une erreur pour chaque produit
    products.forEach((product) => {
      const productElement = document.getElementById(product.elementId);
      productElement.innerHTML = `<div>Erreur de calcul</div>`;
    });
  }
}

// Actualiser toutes les 60 secondes
fetchBitcoinPrice();
setInterval(fetchBitcoinPrice, 60000);
