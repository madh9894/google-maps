import React, { useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
const center = {
  lat: 30.0444, 
  lng: 31.2357,
};

const App = () => {
  const [placeName, setPlaceName] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAKJ4ydlFnla47b2l0Cy6PRcw5xVKiw26Q',
    libraries,
  });

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: placeName }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setMarkerPosition({ lat: lat(), lng: lng() });
      } else {
        alert('Place not found!');
      }
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Enter a place name"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        style={{ width: '300px', padding: '10px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px' }}>
        Search
      </button>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={markerPosition || center}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default App;