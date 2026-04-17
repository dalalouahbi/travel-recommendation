// Show all beaches on homepage load
window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch("travel_recommendation_api.json");
  const data = await response.json();
  const beaches = data.beaches;
  const beachList = document.getElementById('beach-list');
  if (!beachList) return;
  beachList.innerHTML = '';
  beaches.forEach((beach, index) => {
    // Alternate between beach1.jpg and beach2.jpg
    const imageName = index % 2 === 0 ? 'beach1.jpg' : 'beach2.jpg';
    beachList.innerHTML += `
      <div class="beach-card">
        <img src="${imageName}" alt="${beach.name}" style="width:200px;height:120px;object-fit:cover;border-radius:8px;">
        <h3>${beach.name}</h3>
      </div>
    `;
  });
});
async function search() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const response = await fetch("travel_recommendation_api.json");
  const data = await response.json();
console.log("data'",data);
  let results = [];

  // Search beaches
  results = results.concat(
    data.beaches.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    )
  );

  // Search temples
  results = results.concat(
    data.temples.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    )
  );

  // Search countries and their cities
  data.countries.forEach(country => {
    // If country matches
    if (
      country.name.toLowerCase().includes(query)
    ) {
      results.push(country);
    }
    // If any city matches
    country.cities.forEach(city => {
      if (
        city.name.toLowerCase().includes(query) ||
        (city.description && city.description.toLowerCase().includes(query))
      ) {
        // Push as a single city result
        results.push({
          name: city.name,
          imageUrl: city.imageUrl,
          description: city.description
        });
      }
    });
  });

  displayResults(results);
}


function displayResults(items) {
  const popup = document.getElementById("search-popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.innerHTML = "";
  if (items.length === 0) {
    popupContent.innerHTML = '<p>No results found.</p>';
  } else {
    items.forEach(item => {
      if (item.cities) {
        item.cities.forEach(city => {
          popupContent.innerHTML += `
            <div class="result-card">
              <img src="${city.imageUrl}" width="200" style="border-radius:8px;object-fit:cover;">
              <div class="result-info">
                <h3>${city.name}</h3>
                <p>${city.description || ''}</p>
              </div>
            </div>
          `;
        });
      } else {
        popupContent.innerHTML += `
          <div class="result-card">
            <img src="${item.imageUrl}" width="200" style="border-radius:8px;object-fit:cover;">
            <div class="result-info">
              <h3>${item.name}</h3>
              <p>${item.description || ''}</p>
            </div>
          </div>
        `;
      }
    });
  }
  popup.style.display = "block";
}


function clearResults() {
  document.getElementById("search-popup").style.display = "none";
}