import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Geolocation } from '@capacitor/geolocation';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CreatePlayScreen from './screens/CreatePlayScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import LocationConfirmScreen from './screens/LocationConfirmScreen';
import MemoriesScreen from './screens/MemoriesScreen';
import MemoriesCreateScreen from './screens/MemoriesCreateScreen';
import MemoriesDetailScreen from './screens/MemoriesDetailScreen';
import PlayDetailScreen from './screens/PlayDetailScreen';
import EditPlayScreen from './screens/EditPlayScreen';
import JoinedPlaysScreen from './screens/JoinedPlaysScreen';

const App = () => {
  useEffect(() => {
    const requestLocation = async () => {
      try {
        await Geolocation.requestPermissions({ permissions: ['location'] });
      } catch (_) {
        // ignore - fall back to browser permission prompt when needed
      }
    };
    requestLocation();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/create" element={<CreatePlayScreen />} />
      <Route path="/edit/:postId" element={<EditPlayScreen />} />
      <Route path="/chat-list" element={<ChatListScreen />} />
      <Route path="/chat-room/:postId" element={<ChatRoomScreen />} />
      <Route path="/map" element={<MapScreen />} />
      <Route path="/memories" element={<MemoriesScreen />} />
      <Route path="/memories/create" element={<MemoriesCreateScreen />} />
      <Route path="/memories/:id" element={<MemoriesDetailScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/joined" element={<JoinedPlaysScreen />} />
      <Route path="/location-confirm" element={<LocationConfirmScreen />} />
      <Route path="/play/:id" element={<PlayDetailScreen />} />
    </Routes>
  );
};

export default App;
