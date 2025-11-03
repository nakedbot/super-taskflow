import React from 'react';
import { View } from '../types';
import { ChartBarIcon, TableCellsIcon, PlusIcon, MenuIcon, XMarkIcon, UserPlusIcon } from '../constants';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: View;
    setActiveView: (view: View) => void;
    onNewArtisanClick: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, activeView, setActiveView, onNewArtisanClick }) => {
    
    const handleNavigate = (view: View) => {
        setActiveView(view);
        onClose();
    }
    
    const handleNewArtisan = () => {
        onNewArtisanClick();
        onClose();
    }

    const navItemClasses = "flex items-center px-4 py-3 text-md font-medium rounded-md transition-colors w-full text-left";
    const activeClasses = "bg-primary-600 text-white";
    const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

    return (
        <div className={`fixed inset-0 z-[100] ${isOpen ? 'visible' : 'invisible'} flex justify-start`}>
             <div className={`fixed inset-0 bg-black bg-opacity-50 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`} onClick={onClose}></div>
             <div className={`relative w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl h-full ${isOpen ? 'animate-slide-in-left' : 'animate-slide-out-left'}`}>
                <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Menu</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-2">
                        <button onClick={() => handleNavigate('dashboard')} className={`${navItemClasses} ${activeView === 'dashboard' ? activeClasses : inactiveClasses}`}>
                            <ChartBarIcon className="w-5 h-5 mr-3" />
                            Dashboard
                        </button>
                         <button onClick={() => handleNavigate('tasks')} className={`${navItemClasses} ${activeView === 'tasks' ? activeClasses : inactiveClasses}`}>
                            <TableCellsIcon className="w-5 h-5 mr-3" />
                            Tasks
                        </button>
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <button onClick={handleNewArtisan} className={`${navItemClasses} ${inactiveClasses}`}>
                           <UserPlusIcon className="w-5 h-5 mr-3" />
                           Add Artisan
                        </button>
                    </nav>
                </div>
             </div>
        </div>
    );
};

interface HeaderProps {
    activeView: View;
    setActiveView: (view: View) => void;
    onNewTaskClick: () => void;
    isSideMenuOpen: boolean;
    setIsSideMenuOpen: (isOpen: boolean) => void;
    onNewArtisanClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onNewTaskClick, isSideMenuOpen, setIsSideMenuOpen, onNewArtisanClick }) => {
    return (
        <>
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setIsSideMenuOpen(true)} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
                                 <MenuIcon className="w-6 h-6" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Super TaskFlow</h1>
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                             <nav className="flex space-x-1">
                                <button
                                    onClick={() => setActiveView('dashboard')}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeView === 'dashboard' ? 'text-primary-600 bg-primary-50 dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <ChartBarIcon className="w-5 h-5 mr-2" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveView('tasks')}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeView === 'tasks' ? 'text-primary-600 bg-primary-50 dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <TableCellsIcon className="w-5 h-5 mr-2" />
                                    Tasks
                                </button>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button
                                onClick={onNewArtisanClick}
                                className="hidden md:flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                             >
                                <UserPlusIcon className="w-5 h-5 mr-2 -ml-1" />
                                Add Artisan
                             </button>
                             <button
                                onClick={onNewTaskClick}
                                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                                New Task
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <SideMenu
                isOpen={isSideMenuOpen}
                onClose={() => setIsSideMenuOpen(false)}
                activeView={activeView}
                setActiveView={setActiveView}
                onNewArtisanClick={onNewArtisanClick}
            />
        </>
    );
};

export default Header;