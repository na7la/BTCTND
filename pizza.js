// Sélection des éléments HTML
const btcValueElement = document.getElementById("btcValue");
const pizzaCountElement = document.getElementById("pizzaCount");

// API de CoinGecko pour obtenir le prix du Bitcoin en USD
const BTC_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

// Valeurs constantes
const BTC_AMOUNT = 10000; // Nombre de BTC
const PIZZA_PRICE_USD = 20; // Prix d'une pizza en USD

// Stocker la valeur précédente de 10 000 BTC en USD
let previousTotalValueInUSD = 0;

// Fonction pour obtenir le prix du Bitcoin et mettre à jour l'affichage
async function fetchBitcoinData() {
  try {
    // Récupérer le prix du Bitcoin en USD
    const response = await fetch(BTC_API_URL);
    const data = await response.json();
    const btcPriceInUSD = data.bitcoin.usd;

    // Calculer la valeur de 10 000 BTC en USD
    const totalValueInUSD = BTC_AMOUNT * btcPriceInUSD;

    // Calculer le nombre de pizzas achetables
    const pizzaCount = Math.floor(totalValueInUSD / PIZZA_PRICE_USD);

    // Changer la couleur du texte en fonction de l'évolution du prix
    if (previousTotalValueInUSD !== null) {
      if (totalValueInUSD > previousTotalValueInUSD) {
        // Le prix a augmenté : vert
        btcValueElement.style.color = "#28a745"; // Vert
        pizzaCountElement.style.color = "#28a745"; // Vert
      } else if (totalValueInUSD < previousTotalValueInUSD) {
        // Le prix a diminué : rouge
        btcValueElement.style.color = "#dc3545"; // Rouge
        pizzaCountElement.style.color = "#dc3545"; // Rouge
      } else {
        // Le prix est inchangé : couleur par défaut
        btcValueElement.style.color = "#000000"; // Noir
        pizzaCountElement.style.color = "#000000"; // Noir
      }
    }

    // Mettre à jour l'affichage
    btcValueElement.textContent = `${totalValueInUSD.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}`;
    pizzaCountElement.textContent = `${pizzaCount.toLocaleString(
      "en-US"
    )} pizzas`;

    // Mettre à jour la valeur précédente
    previousTotalValueInUSD = totalValueInUSD;
  } catch (error) {
    btcValueElement.textContent = "Erreur de récupération";
    pizzaCountElement.textContent = "Erreur de récupération";
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Mettre à jour les données toutes les 60 secondes
fetchBitcoinData();
setInterval(fetchBitcoinData, 60000);
