
<template>
    <div class="taux-container">

        <!-- Filtres -->
        <div class="filters-container">
            <div class="filters">
                <div class="filter" :class="{ 'order-2': swapped }">
                    <select v-model="fromCurrency">
                        <option v-for="devise in devises" :key="devise" :value="devise">
                            {{ deviseIcons[devise] }} {{ devise }}
                        </option>
                    </select>
                </div>
        
                <button class="swap" @click="swapDevise">⇆</button>
        
                <div class="filter" :class="{ 'order-1': swapped }">
                    <select v-model="toCurrency">
                        <option v-for="devise in devises" :key="devise" :value="devise">
                            {{ deviseIcons[devise] }} {{ devise }}
                        </option>
                    </select>
                </div>
            </div>
  
            <div class="filter-taux">
                <div class="filter2 convertir">
                    <div class="rate-wrapper">
                        <h3>1 {{ fromCurrency }} = ... {{ toCurrency }} . <br> <span>Taux de change moyen du marché</span></h3>
                    </div>
                </div>
                <div class="filter2 amount-container">
                    <span for="amount">Montant à envoyer</span>
                    <div class="input-wrapper">
                        <input type="number" min="1" v-model="amount" />
                        <span class="currency-icon">{{ fromCurrency }}</span>
                    </div>
                </div>
            </div>

            <!-- Bouton de rafraîchissement (optionnel, puisque le watch se charge du rafraîchissement) -->
            <button class="refresh" @click="fetchTaux" :disabled="loading">Rafraîchir les taux</button>
        </div>

  
      <!-- Messages de chargement et d'erreur -->
      <p v-if="loading">Chargement...</p>
      <p v-if="error" class="error">{{ error }}</p>
  
      <!-- Tableau des taux -->
       <div class="table" v-if="taux && taux.length > 0">
            <table v-if="windowWidth > 770">
                <thead>
                    <tr>
                      <th>Prestataire</th>
                      <th>Taux de Change <br> <span>(1 {{ fromCurrency }} ➡️ {{toCurrency}})</span></th>
                      <th>Frais</th>
                      <th>Le bénéficiaire reçoit</th>
                   </tr>
                </thead>
                <tbody>
                    <tr v-for="item in taux" :key="item.id">
                        <td>
                            <a v-if="platformIcons[item.service]" 
                                :href="platformIcons[item.service].link" 
                                target="_blank" 
                                class="platform-link">
                                <img :src="platformIcons[item.service].icon" 
                                    alt="icon" 
                                    class="platform-icon"/>
                            </a>
                            <span v-else>{{ item.service }}</span>
                        </td>

                        <td>{{ item.taux_du_jour }}</td>
                        <td>{{ item.frais_transfert }}</td>
                        <td> {{ calculateReceivedAmount(item) }} {{ toCurrency }}</td>
                    </tr>
                </tbody>
            </table>
  
          <!-- Affichage en cartes sur mobile -->
            <div v-if="windowWidth <= 770" class="carte">
                <div v-for="item in taux" :key="item.id" class="rate-card">
                    <div class=" cta provider">
                        <a v-if="platformIcons[item.service]" 
                            :href="platformIcons[item.service].link" 
                            target="_blank" 
                            class="platform-link">
                            <img :src="platformIcons[item.service].icon" 
                                alt="icon" 
                                class="platform-icon"/>
                        </a>
                        <span v-else>{{ item.service }}</span>
                    </div>
                    <div class="cta rate">
                        <span>Taux de Change </span> 
                        <span>{{ item.taux_du_jour }}</span>
                    </div>
                    <div class="cta fees">
                        <span>Frais </span>
                        <span>{{ item.frais_transfert }} {{ fromCurrency }}</span>
                    </div>
                    <div class="cta received">
                        <span>Le bénéficiaire reçoit</span> 
                        <span>{{ calculateReceivedAmount(item) }} {{ toCurrency }}</span>
                    </div>
                </div>
            </div>
        </div>
      <p v-else>Aucun taux disponible.</p>
    </div>
</template>
  
<script setup>
  import {
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
  } from '../services/useTaux.js'
  
  import { ref, onMounted, onUnmounted } from 'vue';

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

  @import '../assets/tauxList.css';
  
</style>
