// AGUARDA O CARREGAMENTO COMPLETO DO DOM
document.addEventListener("DOMContentLoaded", () => {
  const dietForm = document.getElementById("dietForm");
  const mealList = document.getElementById("mealList");
  const mealCount = document.getElementById("mealCount");
  const totalCaloriesEl = document.getElementById("totalCalories");

  // ETAPA 11: PERSISTÊNCIA VIA LOCALSTORAGE (Buscar dados salvos)
  let meals = JSON.parse(localStorage.getItem("nutriVidaMeals")) || [];

  // FUNÇÃO PARA ATUALIZAR A TELA (RENDERIZAR)
  function renderMeals() {
    mealList.innerHTML = "";
    let totalCalories = 0;

    if (meals.length === 0) {
      mealList.innerHTML = `<p class="empty-msg">Nenhuma refeição cadastrada ainda. Preencha o formulário acima!</p>`;
    } else {
      meals.forEach((meal, index) => {
        totalCalories += Number(meal.calories);

        const mealCard = document.createElement("div");
        mealCard.classList.add("meal-item");

        mealCard.innerHTML = `
          <h3>${meal.title}</h3>
          <span class="meal-tag">${meal.category}</span>
          <p class="meal-info"><strong>Usuário:</strong> ${meal.userName}</p>
          <p class="meal-info"><strong>Alimentos:</strong> ${meal.details}</p>
          <p class="meal-info"><strong>Calorias:</strong> ${meal.calories} kcal</p>
          <p class="meal-info"><strong>Data:</strong> ${formatDate(meal.date)}</p>
          <button class="btn-delete" onclick="deleteMeal(${index})">Excluir</button>
        `;

        mealList.appendChild(mealCard);
      });
    }

    // ATUALIZA OS CONTADORES E IMPACTO
    mealCount.textContent = `${meals.length} ${meals.length === 1 ? 'refeição' : 'refeições'}`;
    totalCaloriesEl.textContent = totalCalories;

    // SALVA NO LOCALSTORAGE
    localStorage.setItem("nutriVidaMeals", JSON.stringify(meals));
  }

  // FUNÇÃO PARA FORMATAR A DATA (AAAA-MM-DD para DD/MM/AAAA)
  function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // ADICIONAR NOVA REFEIÇÃO VIA FORMULÁRIO
  dietForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newMeal = {
      userName: document.getElementById("userName").value.trim(),
      title: document.getElementById("mealTitle").value.trim(),
      category: document.getElementById("mealCategory").value,
      details: document.getElementById("mealDetails").value.trim(),
      calories: document.getElementById("calories").value,
      date: document.getElementById("planDate").value
    };

    meals.push(newMeal);
    renderMeals();
    dietForm.reset();
  });

  // FUNÇÃO GLOBAL PARA DELETAR REFEIÇÃO
  window.deleteMeal = function(index) {
    meals.splice(index, 1);
    renderMeals();
  };

  // CARREGA A LISTA INICIAL AO ABRIR A PÁGINA
  renderMeals();
});