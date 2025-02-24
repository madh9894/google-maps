import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const App = () => {
  const [placeType, setPlaceType] = useState('hospital');
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAKJ4ydlFnla47b2l0Cy6PRcw5xVKiw26Q',
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => alert('Could not get your location')
      );
    }
  }, []);

  const findNearbyPlaces = () => {
    if (!userLocation) {
      alert('Waiting for location...');
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 5000,
      type: placeType,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
      } else {
        alert('No places found');
      }
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Enter place type (e.g., hospital)"
        value={placeType}
        onChange={(e) => setPlaceType(e.target.value)}
        style={{ width: '300px', padding: '10px', marginRight: '10px' }}
      />
      <button onClick={findNearbyPlaces} style={{ padding: '10px' }}>
        Find Nearby Places
      </button>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={userLocation || { lat: 30.0444, lng: 31.2357 }}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {places.map((place, index) => (
          <Marker key={index} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default App;
