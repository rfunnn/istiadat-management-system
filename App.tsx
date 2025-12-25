
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BookingsTable from './components/BookingsTable';
import BookingEditor from './components/BookingEditor';
import ViewingsTable from './components/ViewingsTable';
import AvailabilityManager from './components/AvailabilityManager';
import MenuManager from './components/MenuManager';
import { AppState, BookingStatus, MenuPackage, WeddingBooking, SlotType, AddonService } from './types';
import { INITIAL_BOOKINGS, INITIAL_VIEWINGS, INITIAL_MENUS, INITIAL_AVAILABILITY, INITIAL_STALLS, INITIAL_ADDONS_PORTFOLIO } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookingView, setBookingView] = useState<'list' | 'edit'>('list');
  const [editingBooking, setEditingBooking] = useState<WeddingBooking | null>(null);
  
  const [state, setState] = useState<AppState>({
    bookings: INITIAL_BOOKINGS,
    viewings: INITIAL_VIEWINGS,
    menus: INITIAL_MENUS,
    addonsPortfolio: INITIAL_ADDONS_PORTFOLIO,
    availability: INITIAL_AVAILABILITY,
    isCateringEnabled: true,
    cateringOnlyMode: false,
    stallItems: INITIAL_STALLS,
  });

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === id ? { ...b, status } : b)
    }));
  };

  const saveBookingUpdate = (updated: WeddingBooking) => {
    setState(prev => {
      const exists = prev.bookings.some(b => b.id === updated.id);
      return {
        ...prev,
        bookings: exists 
          ? prev.bookings.map(b => b.id === updated.id ? updated : b)
          : [...prev.bookings, updated]
      };
    });
    setBookingView('list');
    setEditingBooking(null);
  };

  const updateViewingStatus = (id: string, status: BookingStatus) => {
    setState(prev => ({
      ...prev,
      viewings: prev.viewings.map(v => v.id === id ? { ...v, status } : v)
    }));
  };

  const toggleSlot = (date: string, type: 'day' | 'night') => {
    setState(prev => {
      const existing = prev.availability.find(s => s.date === date);
      if (existing) {
        return {
          ...prev,
          availability: prev.availability.map(s => 
            s.date === date ? { 
              ...s, 
              daySlot: type === 'day' ? !s.daySlot : s.daySlot,
              nightSlot: type === 'night' ? !s.nightSlot : s.nightSlot
            } : s
          )
        };
      } else {
        return {
          ...prev,
          availability: [...prev.availability, {
            date,
            daySlot: type === 'day' ? false : true,
            nightSlot: type === 'night' ? false : true,
          }]
        };
      }
    });
  };

  const toggleCatering = (enabled: boolean) => {
    setState(prev => ({ ...prev, isCateringEnabled: enabled }));
  };

  const toggleCateringOnlyMode = (enabled: boolean) => {
    setState(prev => ({ ...prev, cateringOnlyMode: enabled }));
  };

  const handleEditBooking = (booking: WeddingBooking) => {
    setEditingBooking(booking);
    setBookingView('edit');
  };

  const handleAddNewBooking = () => {
    const newBooking: WeddingBooking = {
      id: `W-${Date.now()}`,
      clientName: '',
      contact: '',
      phoneNumber: '',
      date: new Date().toISOString().split('T')[0],
      slot: SlotType.DAY,
      status: BookingStatus.PENDING,
      guests: 0,
      totalAmount: 0,
      menuPackageId: state.menus[0]?.id
    };
    setEditingBooking(newBooking);
    setBookingView('edit');
  };

  const saveMenu = (menu: MenuPackage) => {
    setState(prev => {
      const exists = prev.menus.some(m => m.id === menu.id);
      return {
        ...prev,
        menus: exists 
          ? prev.menus.map(m => m.id === menu.id ? menu : m)
          : [...prev.menus, menu]
      };
    });
  };

  const deleteMenu = (id: string) => {
    setState(prev => ({
      ...prev,
      menus: prev.menus.filter(m => m.id !== id)
    }));
  };

  const saveAddonService = (addon: AddonService) => {
    setState(prev => {
      const exists = prev.addonsPortfolio.some(a => a.id === addon.id);
      return {
        ...prev,
        addonsPortfolio: exists 
          ? prev.addonsPortfolio.map(a => a.id === addon.id ? addon : a)
          : [...prev.addonsPortfolio, addon]
      };
    });
  };

  const deleteAddon = (id: string) => {
    setState(prev => ({
      ...prev,
      addonsPortfolio: prev.addonsPortfolio.filter(a => a.id !== id)
    }));
  };

  const updateStalls = (stalls: string[]) => {
    setState(prev => ({
      ...prev,
      stallItems: stalls
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} />;
      case 'bookings':
        if (bookingView === 'edit' && editingBooking) {
          return (
            <BookingEditor 
              booking={editingBooking} 
              menus={state.menus}
              addonsPortfolio={state.addonsPortfolio}
              stallItems={state.stallItems}
              onSave={saveBookingUpdate} 
              onCancel={() => setBookingView('list')} 
            />
          );
        }
        return (
          <BookingsTable 
            bookings={state.bookings} 
            menus={state.menus}
            onUpdateStatus={updateBookingStatus} 
            isCateringEnabled={state.isCateringEnabled} 
            onEdit={handleEditBooking}
            onAddNew={handleAddNewBooking}
          />
        );
      case 'viewings':
        return <ViewingsTable viewings={state.viewings} onUpdateStatus={updateViewingStatus} />;
      case 'availability':
        return <AvailabilityManager availability={state.availability} onToggleSlot={toggleSlot} />;
      case 'menus':
        return (
          <MenuManager 
            menus={state.menus} 
            isCateringEnabled={state.isCateringEnabled} 
            cateringOnlyMode={state.cateringOnlyMode}
            addonsPortfolio={state.addonsPortfolio}
            stallItems={state.stallItems}
            onToggleCatering={toggleCatering}
            onToggleCateringOnly={toggleCateringOnlyMode}
            onAddMenu={saveMenu} 
            onDeleteMenu={deleteMenu}
            onSaveAddon={saveAddonService}
            onDeleteAddon={deleteAddon}
            onUpdateStalls={updateStalls}
          />
        );
      default:
        return <Dashboard state={state} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => {
      setActiveTab(tab);
      if (tab === 'bookings') setBookingView('list');
    }}>
      {renderContent()}
    </Layout>
  );
};

export default App;
