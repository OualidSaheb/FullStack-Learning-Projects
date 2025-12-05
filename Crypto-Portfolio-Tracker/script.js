document.addEventListener("DOMContentLoaded", () => {
  // 5 objets qui seront les items par défaut
  let coins = JSON.parse(localStorage.getItem("coins")) || [
    {
      id: 1,
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
      nom: "Bitcoin",
      categorie: "Layer 1",
      prixAchat: 21300,
      dateAchat: "2023-01-05",
      montantTotal: 10000,
    },
    {
      id: 2,
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
      nom: "Ethereum",
      categorie: "Layer 1",
      prixAchat: 1300,
      dateAchat: "2022-08-01",
      montantTotal: 5000,
    },
    {
      id: 3,
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
      nom: "Dogecoin",
      categorie: "Meme",
      prixAchat: 0.05,
      dateAchat: "2021-07-11",
      montantTotal: 1000,
    },
    {
      id: 4,
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
      nom: "Uniswap",
      categorie: "CEX",
      prixAchat: 4.15,
      dateAchat: "2022-11-21",
      montantTotal: 15000,
    },

    {
      id: 5,
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/328.png",
      nom: "Monero",
      categorie: "Privacy",
      prixAchat: 130.11,
      dateAchat: "2021-12-27",
      montantTotal: 5000,
    },
  ];
  localStorage.setItem("coins", JSON.stringify(coins));

  const coinTableBody = document.getElementById("coin-table-body");
  const investmentTotal = document.querySelector(".investment-total");

  // Mise à jour de l'investissement total (champ calculé)
  function miseaJourInvestmentTotal() {
    let total = coins.reduce((acc, coin) => acc + coin.montantTotal, 0);
    investmentTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Récupération du tableau en triant selon une colonne
  function tableauCoins(sortBy = "id", sortOrder = "asc") {
    if (sortBy === "prix-total") {
      coins.sort((a, b) => a.montantTotal - b.montantTotal);
    } else {
      coins.sort((a, b) => a[sortBy] - b[sortBy]);
    }

    if (sortOrder === "desc") {
      coins.reverse();
    }

    coinTableBody.innerHTML = coins
      .map((coin) => {
        return `
            <tr>
              <td>${coin.id}</td>
              <td><img src="${coin.logoUrl}" alt="${
          coin.nom
        } logo" width="32" height="32" /></td>
              <td>${coin.nom}</td>
              <td>${coin.categorie}</td>
              <td>${coin.prixAchat}</td>
              <td>${coin.dateAchat}</td>
              <td>${coin.montantTotal.toFixed(2)}</td>
              <td>
                <i class="action-icons edit-icon" data-id="${
                  coin.id
                }">&#9998;</i>
                <i class="action-icons delete-icon" data-id="${
                  coin.id
                }">&#10006;</i>
              </td>
            </tr>
          `;
      })
      .join("");
    miseaJourInvestmentTotal();
  }

  // Ajouter une cryptomonnaie
  function ajouterCoin(coin) {
    coins.push(coin);
    localStorage.setItem("coins", JSON.stringify(coins));
    tableauCoins();
  }

  // modification une cryptomonnaie
  function modifierCoin(coin) {
    const index = coins.findIndex((c) => c.id === coin.id);
    coins[index] = coin;
    localStorage.setItem("coins", JSON.stringify(coins));
    tableauCoins();
  }

  // function qui gère les IDs
  function getNextId() {
    return coins.length ? Math.max(...coins.map((coin) => coin.id)) + 1 : 1;
  }

  const ajouterFormulaire = document.getElementById("ajouter-formulaire");
  const fermer = document.querySelector(".fermer");
  // function qui gère la soumission du formulaire
  function soumettreFormulaire(e) {
    e.preventDefault();

    const id = parseInt(e.target.dataset.id) || getNextId();
    const logoUrl = document.getElementById("logo-url").value;
    const nom = document.getElementById("nom").value;
    const categorie = document.getElementById("categorie").value;
    const prixAchat = parseFloat(document.getElementById("prix-achat").value);
    const dateAchat = document.getElementById("date-achat").value;
    const montantTotal = parseFloat(
      document.getElementById("montant-total").value
    );

    if (prixAchat <= 0 || montantTotal <= 0) {
      alert(
        "Veuillez vous assurer que le prix d'achat et le montant total sont supérieurs à 0."
      );
      return;
    }

    const coin = {
      id,
      logoUrl,
      nom,
      categorie,
      prixAchat,
      dateAchat,
      montantTotal,
    };

    if (e.target.dataset.id) {
      modifierCoin(coin);
    } else {
      ajouterCoin(coin);
    }

    fermer.click();
  }

  ajouterFormulaire.addEventListener("submit", soumettreFormulaire);
  // fermer le formulaire
  coinTableBody.parentNode.addEventListener("click", triClick);

  // supprimer une cryptomonnaie
  function supprimerCoin(id) {
    coins = coins.filter((coin) => coin.id !== id);
    localStorage.setItem("coins", JSON.stringify(coins));
    tableauCoins();
  }

  // Gérer l'événement de clic pour supprimer une coin
  function supprimerClick(e) {
    if (e.target.classList.contains("delete-icon")) {
      const id = parseInt(e.target.dataset.id);
      supprimerCoin(id);
    }
  }
  coinTableBody.addEventListener("click", supprimerClick);

  const ajouterCoinBtn = document.getElementById("ajouter-coin-btn");
  // Gérer l'événement de clic pour éditer une coin
  function modifierClick(e) {
    if (e.target.classList.contains("edit-icon")) {
      const id = parseInt(e.target.dataset.id);
      const coin = coins.find((c) => c.id === id);

      document.getElementById("logo-url").value = coin.logoUrl;
      document.getElementById("nom").value = coin.nom;
      document.getElementById("categorie").value = coin.categorie;
      document.getElementById("prix-achat").value = coin.prixAchat;
      document.getElementById("date-achat").value = coin.dateAchat;
      document.getElementById("montant-total").value = coin.montantTotal;

      ajouterFormulaire.dataset.id = id;
      ajouterCoinBtn.click();
    }
  }
  coinTableBody.addEventListener("click", modifierClick);

  // la function qui gère le tri
  function triClick(e) {
    if (e.target.nodeName === "TH" && e.target.id) {
      const sortBy = e.target.id;
      const sortOrder = e.target.dataset.sort === "asc" ? "desc" : "asc";
      e.target.dataset.sort = sortOrder;

      tableauCoins(sortBy, sortOrder);
    }
  }

  const formulaireContainer = document.getElementById("formulaire-container");
  // afficher le formulaire
  ajouterCoinBtn.addEventListener("click", () => {
    formulaireContainer.style.display = "block";
  });

  // fermer le formulaire
  fermer.addEventListener("click", () => {
    formulaireContainer.style.display = "none";
    ajouterFormulaire.reset();
    delete ajouterFormulaire.dataset.id;
  });

  tableauCoins();
});
