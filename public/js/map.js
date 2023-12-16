{/* let mapToken =mapTokenforWeb;
  console.log("mapToke is ", mapToken); */}
  mapboxgl.accessToken = mapTokenforWeb;
  const map = new mapboxgl.Map({
    container: "map", // container ID
    center: [88.363892, 22.572645], // starting position [lng, lat]
    style: "mapbox://styles/mapbox/streets-v12", //style url
    zoom: 9, // starting zoom
  });