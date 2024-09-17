// Initialize and add the map
let map;

async function initMap() {
  // The location of the listing (You can replace these with actual latitude and longitude values)
  const position = { lat: -25.344, lng: 131.031 }; // Uluru example

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at the listing location
  map = new Map(document.getElementById("map"), {
    zoom: 12, // You can adjust the zoom level
    center: position,
  });

  // The marker, positioned at the listing location
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Listing Location", // Title for the marker
  });
}

// Call the initMap function when the window loads
window.onload = initMap;
