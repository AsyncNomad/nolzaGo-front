import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import PlayDetailScreen from './screens/PlayDetailScreen';
import EditPlayScreen from './screens/EditPlayScreen';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/create" element={<CreatePlayScreen />} />
      <Route path="/edit/:postId" element={<EditPlayScreen />} />
      <Route path="/chat-list" element={<ChatListScreen />} />
      <Route path="/chat-room" element={<ChatRoomScreen />} />
      <Route path="/map" element={<MapScreen />} />
      <Route path="/memories" element={<MemoriesScreen />} />
      <Route path="/memories/create" element={<MemoriesCreateScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/location-confirm" element={<LocationConfirmScreen />} />
      <Route path="/play/:id" element={<PlayDetailScreen />} />
    </Routes>
  );
};

export default App;
