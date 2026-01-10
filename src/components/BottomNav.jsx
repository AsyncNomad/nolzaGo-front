import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PlusIcon, ChatIcon, BookmarkIcon, UserIcon } from '../assets/icons';

const navItems = [
  { label: '홈', icon: HomeIcon, path: '/home' },
  { label: '내 주변 놀이', icon: PlusIcon, path: '/map' },
  { label: '채팅', icon: ChatIcon, path: '/chat-list' },
  { label: '추억', icon: BookmarkIcon, path: null }, // 추후 구현
  { label: '마이페이지', icon: UserIcon, path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="bottom-bar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.path ? location.pathname.startsWith(item.path) : false;
        const content = (
          <div
            className="bottom-item"
            style={{ color: isActive ? '#f36f72' : '#9b9b9b', opacity: item.path ? 1 : 0.5 }}
          >
            <Icon color={isActive ? '#f36f72' : '#9b9b9b'} />
            <span>{item.label}</span>
          </div>
        );

        return item.path ? (
          <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
            {content}
          </Link>
        ) : (
          <div key={item.label}>{content}</div>
        );
      })}
    </div>
  );
};

export default BottomNav;
