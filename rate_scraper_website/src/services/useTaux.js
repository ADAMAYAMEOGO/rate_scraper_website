
import { ref, onMounted, computed, watch } from 'vue';

const API_URL = "http://localhost:3000/api/taux";

// Liste des devises et leurs icônes
const deviseIcons = {
  EUR: "🇪🇺",
  USD: "🇱🇷",
  GBP: "🇬🇧",
  XOF: "🇧🇫",
  XAF: "🇨🇲"
}

// icones et liens des plateformes
const platformIcons = {
  "TaptapSend": {
      icon: "/Pasted Graphic.png" , 
      link: "https://www.taptapsend.com/"
  },
  "TransfertChapChap": {
      icon: "/Transfert ChapChap.png", 
      link: "https://transfertchapchap.com/"
  }
};


const fromCurrency = ref("EUR");
const toCurrency = ref("GBP");
const amount = ref("1000");
const taux = ref([]);
const loading = ref(false);
const error = ref(null);
const devises = Object.keys(deviseIcons);
const swapped = ref(false);

const fetchTaux = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`${API_URL}?from=${fromCurrency.value}&to=${toCurrency.value}`);
    if (!response.ok) {
      throw new Error(`Erreur réseau: ${response.statusText}`);
    }
    const data = await response.json();
    taux.value = data;
  } catch (err) {
    console.error("Erreur lors de la récupération des taux: ", err);
    error.value = "Impossible de récupérer les taux.";
  }
  loading.value = false;
};

// Calcul du montant reçu pour un élément donné
const calculateReceivedAmount = computed(() => {
  return (item) => {
    const tauxValue = parseFloat(item.taux_du_jour) || 0;
    const frais = parseFloat(item.frais_transfert) || 0;
    return ((amount.value - frais) * tauxValue).toFixed(2);
  };
});

const swapDevise = () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  swapped.value = !swapped.value;
  fetchTaux();
};

watch([fromCurrency, toCurrency, amount], fetchTaux, { immediate: true });

onMounted(fetchTaux);

export {
  fromCurrency,
  toCurrency,
  amount,
  taux,
  loading,
  error,
  devises,
  fetchTaux,
  calculateReceivedAmount,
  deviseIcons,
  platformIcons,
  swapDevise
};
