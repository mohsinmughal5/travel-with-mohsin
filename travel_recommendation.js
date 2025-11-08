fetch('travel_recommendation_api.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Travel Data:', data); // ✅ This should log your JSON data
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });


 let travelData = {};

fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log("✅ Travel data loaded:", travelData);
  })
  .catch(error => console.error("❌ Error loading JSON:", error));


// Function to display search results
function displayResults(results, category) {
  const main = document.querySelector('main');
  let resultSection = document.getElementById('search-results');

  // Create result container if not present
  if (!resultSection) {
    resultSection = document.createElement('section');
    resultSection.id = 'search-results';
    main.appendChild(resultSection);
  }

  resultSection.innerHTML = ""; // Clear previous results

  if (results.length === 0) {
    resultSection.innerHTML = `<p style="text-align:center;">No results found for "${category}".</p>`;
    return;
  }

  // Ensure at least 2 recommendations
  const displayItems = results.slice(0, 2);

  displayItems.forEach(place => {
    const card = document.createElement('div');
    card.classList.add('result-card');
    card.innerHTML = `
      <h3>${place.name}</h3>
      <img src="${place.imageUrl}" alt="${place.name}" width="250">
      <p>${place.description}</p>
    `;
    resultSection.appendChild(card);
  });
}


// Search button click
document.getElementById('search-button').addEventListener('click', () => {
  const input = document.getElementById('search-input').value.trim().toLowerCase();
  if (!input) {
    alert("Please enter a keyword to search.");
    return;
  }

  let results = [];

  // 🔹 Search for Beaches
  if (input.includes("beach")) {
    results = travelData.beaches || [];
    displayResults(results, "Beaches");
    return;
  }

  // 🔹 Search for Temples
  if (input.includes("temple")) {
    results = travelData.temples || [];
    displayResults(results, "Temples");
    return;
  }

  // 🔹 Search for Countries (or cities)
  travelData.countries.forEach(country => {
    if (country.name.toLowerCase().includes(input)) {
      results = [...results, ...country.cities];
    } else {
      // Also match city names or descriptions
      const matchedCities = country.cities.filter(city =>
        city.name.toLowerCase().includes(input) ||
        city.description.toLowerCase().includes(input)
      );
      results = [...results, ...matchedCities];
    }
  });

  displayResults(results, input);
});


// Reset button click
document.getElementById('reset').addEventListener('click', () => {
  document.getElementById('search-input').value = "";
  const resultSection = document.getElementById('search-results');
  if (resultSection) resultSection.innerHTML = "";
});
