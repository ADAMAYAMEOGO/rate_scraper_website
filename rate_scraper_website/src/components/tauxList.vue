<template>
  <div class="taux-container">

    <!-- Filtres -->
     <div class="filters-container">
        <div class="filters">
        <div class="filter">
            <label for="fromCurrency">Envoyer</label>
            <select v-model="fromCurrency">
            <option v-for="devise in devises" :key="devise" :value="devise">
                {{ deviseIcons[devise] }} {{ devise }}
            </option>
            </select>
        </div>

        <span class="swap">⇆</span>

        <div class="filter">
            <label for="toCurrency">Recevoir</label>
            <select v-model="toCurrency">
            <option v-for="devise in devises" :key="devise" :value="devise">
                {{ deviseIcons[devise] }} {{ devise }}
            </option>
            </select>
        </div>

        <div class="filter">
            <label for="amount">Montant</label>
            <input type="number" min="1" v-model="amount" />
        </div>
        </div>
        <!-- Bouton de rafraîchissement (optionnel, puisque le watch se charge du rafraîchissement) -->
        <button @click="fetchTaux" :disabled="loading">Rafraîchir les taux</button>
    </div>

    <!-- Messages de chargement et d'erreur -->
    <p v-if="loading">Chargement...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Tableau des taux -->
    <div v-if="taux && taux.length > 0">
        <table v-if="windowWidth > 750">
            <thead>
                <tr>
                    <th>Prestataire</th>
                    <th>Taux de Change</th>
                    <th>Frais</th>
                    <th>Montant Reçu</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in taux" :key="item.id">
                    <td>{{ item.service }}</td>
                    <td>{{ item.taux_du_jour }}</td>
                    <td>{{ item.frais_transfert }} {{ fromCurrency }}</td>
                    <td>
                        {{ calculateReceivedAmount(item) }} {{ deviseIcons[toCurrency] }} ({{ toCurrency }})
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Affichage en cartes sur mobile -->
        <div v-if="windowWidth <= 750">
            <div v-for="item in taux" :key="item.id" class="rate-card">
                <div class="provider">{{ item.service }}</div>
                <div class="rate"> {{ item.taux_du_jour }}</div>
                <div class="fees"> Frais : {{ item.frais_transfert }} {{ fromCurrency }}</div>
                <div class="received"> {{ calculateReceivedAmount(item) }} {{ deviseIcons[toCurrency] }}</div>
                <a href="#" class="send">Envoyer de l'argent</a>
            </div>
        </div>
    </div>
    <p v-else>Aucun taux disponible.</p>

  </div>
</template>

<script setup>
import {
  amount,
  calculateReceivedAmount,
  deviseIcons,
  devises,
  error,
  fetchTaux,
  fromCurrency,
  loading,
  taux,
  toCurrency,
} from '../services/useTaux.js'

import { ref, onMounted, onUnmounted } from 'vue'

const windowWidth = ref(window.innerWidth)

// Mettre à jour la largeur de l'écran lors du redimensionnement
const updateWidth = () => {
    windowWidth.value = window.innerWidth
}

onMounted(() => {
    window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})

</script>

<style scoped>

.taux-container {
  text-align: center;
  max-width: 1000px;
  margin: auto;
  font-family: Arial, Helvetica, sans-serif;
  padding: 20px 0;
}
.filters-container {
    background-color: #ffff;
    padding: 20px;
    border-radius: 15px 15px 0 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.filters {
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 30px;
   margin-bottom: 20px;
}
.filter {
  display: flex;
  flex-direction: column;
  align-items: center;
}
label {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 10px;
}
select, input {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
  text-align: start;
}
.swap {
  font-size: 30px;
  margin-top: 40px;
  color: #333;
}
button {
  background-color: #028a0f;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px 0;
}
button:hover {
    background-color: #02710d;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
    background-color: rgba(34, 61, 13, .9);
}
tbody {
    background-color: #fafff6;
}
th, td {
  border: 1px solid #d5d5d5;
  padding: 15px;
  text-align: center;
}
th {
  color: white;
  border-radius: 15px 15px 0 0;
}
.error {
  color: red;
  font-weight: bold;
}

/*-- Responsives ---*/
@media screen and (max-width: 800px) {
    .filters {
        gap: 20px;
    }
    select, input {
        width: 100%;
    }
    .swap {
        font-size: 20px;
    }
    th, td {
        padding: 10px
    }
}

/* Mode mobile : en dessous de 750px */
@media screen and (max-width: 750px) {
    .filters-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        gap: 15px;
    }
    .filters {
        min-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .filter {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    select, input {
        width: 100%;
        /* max-width: 300px; */
    }
    .swap {
        display: none;
    }

    /* Désactiver le tableau */
    table {
        display: none;
    }

    /* Affichage en cartes */
    .rate-card {
        width: 100%;
        min-width: 500px;
        background-color: white;
        padding: 15px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    .rate-card .provider {
        font-size: 18px;
        font-weight: bold;
    }
    .rate-card .rate {
        font-size: 16px;
        color: #028a0f;
        font-weight: bold;
    }
    .rate-card .fees {
        font-size: 14px;
        color: grey;
    }
    .rate-card .received {
        font-size: 20px;
        font-weight: bold;
        margin-top: 10px;
    }
    .rate-card .send {
        background-color: #028a0f;
        color: white;
        padding: 8px 15px;
        border-radius: 5px;
        text-align: center;
        display: block;
        margin-top: 10px;
        text-decoration: none;
    }
}
@media screen and (max-width: 600px) {
    .rate-card {
        min-width: 400px;
    }
}
@media screen and (max-width: 500px) {
    .rate-card {
        width: 100%;
        min-width: none;
    }
}

</style>
