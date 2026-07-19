import React from 'react';
import { Home as HomeIcon, Moon, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Hanya tampil di halaman yang memiliki bottom nav
  const visiblePaths = ['/', '/islami'];
  if (!visiblePaths.includes(path)) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full px-6 pb-6 pt-12 pointer-events-none z-[200]">
      <div className="glass-card rounded-3xl p-4 flex justify-around items-center bg-[#141414]/95 pointer-events-auto border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        
        {/* Beranda */}
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            path === '/' ? 'text-neonGreen' : 'text-gray-500 hover:text-white'
          }`}
        >
          <HomeIcon size={22} strokeWidth={path === '/' ? 2.5 : 2} />
          <span className={`text-[10px] ${path === '/' ? 'font-semibold' : 'font-medium'}`}>
            Beranda
          </span>
        </button>

        {/* Islami */}
        <button
          onClick={() => navigate('/islami')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            path === '/islami' ? 'text-neonGreen' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Moon size={22} strokeWidth={path === '/islami' ? 2.5 : 2} />
          <span className={`text-[10px] ${path === '/islami' ? 'font-semibold' : 'font-medium'}`}>
            Islami
          </span>
        </button>

        {/* Asisten AI */}
        <button
          onClick={() => navigate('/ai')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            path === '/ai' ? 'text-neonBlue' : 'text-gray-500 hover:text-neonBlue'
          }`}
        >
          <Sparkles size={22} strokeWidth={path === '/ai' ? 2.5 : 2} />
          <span className={`text-[10px] ${path === '/ai' ? 'font-semibold' : 'font-medium'}`}>
            Asisten AI
          </span>
        </button>

      </div>
    </div>
  );
};

export default BottomNav;
