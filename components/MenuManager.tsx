
import React, { useState, useEffect } from 'react';
import { MenuPackage, AddonService } from '../types';

interface MenuManagerProps {
  menus: MenuPackage[];
  addonsPortfolio: AddonService[];
  isCateringEnabled: boolean;
  cateringOnlyMode: boolean;
  stallItems: string[];
  onToggleCatering: (enabled: boolean) => void;
  onToggleCateringOnly: (enabled: boolean) => void;
  onAddMenu: (menu: MenuPackage) => void;
  onDeleteMenu: (id: string) => void;
  onSaveAddon: (addon: AddonService) => void;
  onDeleteAddon: (id: string) => void;
  onUpdateStalls: (stalls: string[]) => void;
}

const MenuManager: React.FC<MenuManagerProps> = ({ 
  menus, 
  addonsPortfolio,
  isCateringEnabled, 
  cateringOnlyMode,
  stallItems,
  onToggleCatering, 
  onToggleCateringOnly,
  onAddMenu,
  onDeleteMenu,
  onSaveAddon,
  onDeleteAddon,
  onUpdateStalls 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'packages' | 'addons' | 'stalls'>('packages');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  
  const [showAddAddonForm, setShowAddAddonForm] = useState(false);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  
  // New Package Form State
  const [newPkg, setNewPkg] = useState({
    id: '',
    name: '',
    basePax: 1000,
    basePrice: 0,
    description: '',
    items: [] as string[],
    brideItems: [] as string[],
    inclusions: [] as string[]
  });

  // New Addon Form State
  const [newAddon, setNewAddon] = useState({
    id: '',
    name: '',
    category: 'Other' as AddonService['category'],
    price: 0,
    description: '',
    icon: 'fa-box'
  });
  
  const [tempItem, setTempItem] = useState('');
  const [tempBrideItem, setTempBrideItem] = useState('');
  const [tempInclusion, setTempInclusion] = useState('');
  const [newStallName, setNewStallName] = useState('');

  const resetPkgForm = () => {
    setNewPkg({
      id: '',
      name: '',
      basePax: 1000,
      basePrice: 0,
      description: '',
      items: [],
      brideItems: [],
      inclusions: []
    });
    setEditingPackageId(null);
  };

  const resetAddonForm = () => {
    setNewAddon({
      id: '',
      name: '',
      category: 'Other',
      price: 0,
      description: '',
      icon: 'fa-box'
    });
    setEditingAddonId(null);
  };

  const addCoreItem = () => {
    if (tempItem.trim()) {
      setNewPkg(prev => ({ ...prev, items: [...prev.items, tempItem.trim()] }));
      setTempItem('');
    }
  };

  const removeCoreItem = (index: number) => {
    setNewPkg(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const addBrideItem = () => {
    if (tempBrideItem.trim()) {
      setNewPkg(prev => ({ ...prev, brideItems: [...(prev.brideItems || []), tempBrideItem.trim()] }));
      setTempBrideItem('');
    }
  };

  const removeBrideItem = (index: number) => {
    setNewPkg(prev => ({ ...prev, brideItems: (prev.brideItems || []).filter((_, i) => i !== index) }));
  };

  const addInclusionItem = () => {
    if (tempInclusion.trim()) {
      setNewPkg(prev => ({ ...prev, inclusions: [...(prev.inclusions || []), tempInclusion.trim()] }));
      setTempInclusion('');
    }
  };

  const removeInclusionItem = (index: number) => {
    setNewPkg(prev => ({ ...prev, inclusions: (prev.inclusions || []).filter((_, i) => i !== index) }));
  };

  const handleManagePackage = (pkg: MenuPackage) => {
    setNewPkg({
      id: pkg.id,
      name: pkg.name,
      basePax: pkg.basePax,
      basePrice: pkg.basePrice,
      description: pkg.description,
      items: pkg.items,
      brideItems: pkg.brideItems || [],
      inclusions: pkg.inclusions || []
    });
    setEditingPackageId(pkg.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitPackage = () => {
    if (!newPkg.name || newPkg.basePrice <= 0) return;
    const pkgToAdd: MenuPackage = {
      ...newPkg,
      id: newPkg.id || `M-${Date.now()}`,
      pricePerPax: newPkg.basePrice / (newPkg.basePax || 1),
      icon: 'fa-utensils'
    };
    onAddMenu(pkgToAdd);
    setShowAddForm(false);
    resetPkgForm();
  };

  const handleManageAddon = (addon: AddonService) => {
    setNewAddon({
      id: addon.id,
      name: addon.name,
      category: addon.category,
      price: addon.price,
      description: addon.description,
      icon: addon.icon
    });
    setEditingAddonId(addon.id);
    setShowAddAddonForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitAddon = () => {
    if (!newAddon.name || newAddon.price <= 0) return;
    const addonToSave: AddonService = {
      ...newAddon,
      id: newAddon.id || `A-${Date.now()}`,
      icon: getIconForCategory(newAddon.category)
    };
    onSaveAddon(addonToSave);
    setShowAddAddonForm(false);
    resetAddonForm();
  };

  const getIconForCategory = (cat: string) => {
    switch(cat) {
      case 'Photographer': return 'fa-camera';
      case 'E-Card': return 'fa-envelope-open-text';
      case 'Attire': return 'fa-vest';
      case 'MC': return 'fa-microphone-lines';
      case 'Sound System': return 'fa-tower-broadcast';
      default: return 'fa-box';
    }
  };

  const handleAddStall = () => {
    if (newStallName.trim()) {
      onUpdateStalls([...stallItems, newStallName.trim()]);
      setNewStallName('');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Configuration Header */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#3d2b1f] text-[#a67c52] rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-boxes-packing text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#3d2b1f]">Service & Package Portfolio</h3>
              <p className="text-sm text-stone-500 font-medium max-w-xl">Curate your hall's signature offerings, external vendor addons, and operational modes.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-6 bg-stone-50 p-2.5 px-4 rounded-xl border border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Hall-Only Mode</span>
              <button 
                onClick={() => onToggleCatering(!isCateringEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative ${isCateringEnabled ? 'bg-[#a67c52]' : 'bg-stone-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${isCateringEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a67c52]">Full Catering</span>
            </div>
            <div className="flex items-center justify-between gap-6 bg-stone-50 p-2.5 px-4 rounded-xl border border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Venue Required</span>
              <button 
                onClick={() => onToggleCateringOnly(!cateringOnlyMode)}
                className={`w-12 h-6 rounded-full transition-all relative ${cateringOnlyMode ? 'bg-amber-600' : 'bg-stone-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${cateringOnlyMode ? 'right-1' : 'left-1'}`}></div>
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Offsite Catering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border border-stone-200 rounded-2xl w-fit shadow-sm">
        {(['packages', 'addons', 'stalls'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeSubTab === tab 
              ? 'bg-[#3d2b1f] text-white shadow-lg' 
              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeSubTab === 'packages' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-[#3d2b1f]">Signature Wedding Packages</h3>
              <button 
                onClick={() => {
                  if (showAddForm) {
                    resetPkgForm();
                    setShowAddForm(false);
                  } else {
                    setShowAddForm(true);
                  }
                }}
                className="px-6 py-3 bg-[#3d2b1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#a67c52] transition-all flex items-center gap-3 shadow-lg active:scale-95"
              >
                <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'}`}></i> 
                {showAddForm ? (editingPackageId ? 'Cancel Update' : 'Close Editor') : 'Register New Package'}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-[#fcfaf7] p-8 md:p-12 rounded-[2.5rem] border border-[#a67c52]/20 shadow-xl animate-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-xl font-serif font-bold text-[#3d2b1f] mb-2">
                      {editingPackageId ? 'Update Package Definition' : 'Package Definition'}
                    </h4>
                    <p className="text-sm text-stone-500">Create a comprehensive bundle that combines catering and essential services.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Package Title</label>
                      <input 
                        value={newPkg.name} 
                        onChange={e => setNewPkg(p => ({ ...p, name: e.target.value }))} 
                        className="w-full p-4 rounded-xl border border-stone-200 focus:border-[#a67c52] outline-none transition-all" 
                        placeholder="e.g. Istiadat Royal Banquet" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Base Guest Count</label>
                        <input 
                          type="number" 
                          value={newPkg.basePax} 
                          onChange={e => setNewPkg(p => ({ ...p, basePax: Number(e.target.value) }))} 
                          className="w-full p-4 rounded-xl border border-stone-200 outline-none focus:border-[#a67c52]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Total Package Price (RM)</label>
                        <input 
                          type="number" 
                          value={newPkg.basePrice} 
                          onChange={e => setNewPkg(p => ({ ...p, basePrice: Number(e.target.value) }))} 
                          className="w-full p-4 rounded-xl border border-stone-200 outline-none focus:border-[#a67c52]" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Brief Description</label>
                      <textarea 
                        rows={3}
                        value={newPkg.description} 
                        onChange={e => setNewPkg(p => ({ ...p, description: e.target.value }))} 
                        className="w-full p-4 rounded-xl border border-stone-200 outline-none focus:border-[#a67c52] resize-none" 
                        placeholder="Summarize the value of this package..." 
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Core Menu Builder */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Core Menu Items (Guest Table)</label>
                      <div className="flex gap-2">
                        <input 
                          value={tempItem}
                          onChange={e => setTempItem(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && addCoreItem()}
                          placeholder="Add guest dish..."
                          className="flex-1 p-3.5 rounded-xl border border-stone-200 focus:border-[#a67c52] outline-none text-sm"
                        />
                        <button 
                          onClick={addCoreItem}
                          className="px-5 bg-stone-200 text-stone-600 rounded-xl hover:bg-stone-300 transition-colors"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                        {newPkg.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 shadow-sm">
                            {item}
                            <button onClick={() => removeCoreItem(idx)} className="text-stone-300 hover:text-rose-500"><i className="fas fa-times text-[10px]"></i></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bride Menu Builder */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Bride Menu Items (Hidangan Pengantin)</label>
                      <div className="flex gap-2">
                        <input 
                          value={tempBrideItem}
                          onChange={e => setTempBrideItem(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && addBrideItem()}
                          placeholder="Add specialized bride dish..."
                          className="flex-1 p-3.5 rounded-xl border border-stone-200 focus:border-[#a67c52] outline-none text-sm"
                        />
                        <button 
                          onClick={addBrideItem}
                          className="px-5 bg-[#a67c52]/20 text-[#a67c52] rounded-xl hover:bg-[#a67c52] hover:text-white transition-all"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                        {newPkg.brideItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-[#a67c52]/10 border border-[#a67c52]/20 px-3 py-1.5 rounded-lg text-xs font-bold text-[#a67c52] shadow-sm">
                            <i className="fas fa-heart text-[8px]"></i>
                            {item}
                            <button onClick={() => removeBrideItem(idx)} className="text-[#a67c52]/40 hover:text-rose-500"><i className="fas fa-times text-[10px]"></i></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Package Inclusions / Add-ons */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Package Inclusions (Add-ons)</label>
                      <div className="flex gap-2">
                        <input 
                          value={tempInclusion}
                          onChange={e => setTempInclusion(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && addInclusionItem()}
                          placeholder="Add a service or perk (e.g. Free DJ)..."
                          className="flex-1 p-3.5 rounded-xl border border-stone-200 focus:border-[#a67c52] outline-none text-sm"
                        />
                        <button 
                          onClick={addInclusionItem}
                          className="px-5 bg-stone-200 text-stone-600 rounded-xl hover:bg-stone-300 transition-colors"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                        {newPkg.inclusions?.map((inc, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-[#3d2b1f]/5 border border-[#3d2b1f]/10 px-3 py-1.5 rounded-lg text-xs font-bold text-[#3d2b1f] shadow-sm">
                            <i className="fas fa-star text-[8px]"></i>
                            {inc}
                            <button onClick={() => removeInclusionItem(idx)} className="ml-1 text-[#3d2b1f]/40 hover:text-rose-500"><i className="fas fa-times text-[10px]"></i></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 pt-6 flex gap-4">
                    <button 
                      onClick={handleSubmitPackage} 
                      className="flex-1 py-5 bg-[#3d2b1f] text-white font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#a67c52] transition-all active:scale-[0.98]"
                    >
                      {editingPackageId ? 'Update Signature Package' : 'Publish Signature Package'}
                    </button>
                    {editingPackageId && (
                      <button 
                        onClick={() => {
                          if (confirm('Delete this package? This action cannot be undone.')) {
                            onDeleteMenu(editingPackageId);
                            setShowAddForm(false);
                            resetPkgForm();
                          }
                        }}
                        className="px-8 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                      >
                        <i className="fas fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menus.map((menu) => (
                <div key={menu.id} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
                  <div className="w-12 h-12 bg-stone-50 text-[#a67c52] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#a67c52] group-hover:text-white transition-colors">
                    <i className={`fas ${menu.icon}`}></i>
                  </div>
                  <h4 className="font-serif font-bold text-[#3d2b1f] text-lg mb-1">{menu.name}</h4>
                  <p className="text-xl font-bold text-stone-800">RM{menu.basePrice.toLocaleString()}</p>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-6">Base for {menu.basePax} Pax</p>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    <div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Core Menu</span>
                      <div className="space-y-1.5">
                        {menu.items.slice(0, 3).map((it, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-stone-500">
                            <div className="w-1 h-1 bg-[#a67c52] rounded-full"></div>
                            {it}
                          </div>
                        ))}
                        {menu.items.length > 3 && <p className="text-[9px] text-[#a67c52] font-bold italic">+ {menu.items.length - 3} more items</p>}
                      </div>
                    </div>

                    {menu.brideItems && menu.brideItems.length > 0 && (
                      <div>
                        <span className="text-[9px] font-bold text-[#a67c52] uppercase tracking-widest block mb-2">Bride Special</span>
                        <div className="space-y-1.5">
                          {menu.brideItems.slice(0, 2).map((it, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] text-[#a67c52] font-medium">
                              <i className="fas fa-heart text-[8px]"></i>
                              {it}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {menu.inclusions && menu.inclusions.length > 0 && (
                      <div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Key Inclusions</span>
                        <div className="flex flex-wrap gap-1.5">
                          {menu.inclusions.slice(0, 2).map((inc, i) => (
                            <span key={i} className="text-[9px] font-bold bg-[#fcfaf7] text-[#a67c52] border border-[#a67c52]/20 px-2 py-0.5 rounded uppercase">{inc}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleManagePackage(menu)}
                    className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                      editingPackageId === menu.id 
                      ? 'bg-[#a67c52] text-white' 
                      : 'bg-stone-50 text-stone-400 hover:bg-[#3d2b1f] hover:text-white'
                    }`}
                  >
                    {editingPackageId === menu.id ? 'Editing Now' : 'Manage Package'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'addons' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#3d2b1f]">Service Add-ons (Excludes)</h3>
                <p className="text-xs text-stone-400 mt-1">Standalone services that can be added to any hall booking.</p>
              </div>
              <button 
                onClick={() => {
                  if (showAddAddonForm) {
                    resetAddonForm();
                    setShowAddAddonForm(false);
                  } else {
                    setShowAddAddonForm(true);
                  }
                }}
                className="px-6 py-3 bg-[#a67c52] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#3d2b1f] transition-all flex items-center gap-3 shadow-lg active:scale-95"
              >
                <i className={`fas ${showAddAddonForm ? 'fa-times' : 'fa-plus'}`}></i> 
                {showAddAddonForm ? (editingAddonId ? 'Cancel Update' : 'Close Editor') : 'Register New Service'}
              </button>
            </div>

            {showAddAddonForm && (
              <div className="bg-[#fcfaf7] p-10 rounded-[2.5rem] border border-[#a67c52]/20 shadow-xl animate-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-xl font-serif font-bold text-[#3d2b1f] mb-2">
                      {editingAddonId ? 'Update Service Details' : 'Service Provider Definition'}
                    </h4>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Service Name</label>
                     <input value={newAddon.name} onChange={e => setNewAddon(a => ({ ...a, name: e.target.value }))} className="w-full p-4 rounded-xl border border-stone-200 outline-none focus:border-[#a67c52]" placeholder="e.g. Signature Photobooth" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Category</label>
                     <select value={newAddon.category} onChange={e => setNewAddon(a => ({ ...a, category: e.target.value as any }))} className="w-full p-4 rounded-xl border border-stone-200 outline-none focus:border-[#a67c52] bg-white appearance-none">
                       {['Photographer', 'E-Card', 'Attire', 'MC', 'Sound System', 'Other'].map(c => (
                         <option key={c} value={c}>{c}</option>
                       ))}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Service Rate (RM)</label>
                     <input type="number" value={newAddon.price} onChange={e => setNewAddon(a => ({ ...a, price: Number(e.target.value) }))} className="w-full p-4 rounded-xl border border-stone-200 outline-none focus:border-[#a67c52]" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Service Description</label>
                     <input value={newAddon.description} onChange={e => setNewAddon(a => ({ ...a, description: e.target.value }))} className="w-full p-4 rounded-xl border border-stone-200 outline-none focus:border-[#a67c52]" placeholder="What is provided?" />
                  </div>
                  <button onClick={handleSubmitAddon} className="col-span-1 md:col-span-2 py-5 bg-[#a67c52] text-white font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#3d2b1f] transition-all">
                    {editingAddonId ? 'Update Registered Service' : 'List Service Add-on'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {addonsPortfolio.map((addon) => (
                <div key={addon.id} className={`bg-white rounded-3xl p-8 border shadow-sm flex flex-col items-start text-left transition-all ${editingAddonId === addon.id ? 'border-[#a67c52] ring-1 ring-[#a67c52]' : 'border-stone-200 hover:border-stone-300'}`}>
                  <div className="w-12 h-12 bg-[#fcfaf7] text-[#a67c52] rounded-2xl flex items-center justify-center mb-6">
                    <i className={`fas ${addon.icon} text-lg`}></i>
                  </div>
                  <span className="text-[9px] font-bold text-[#a67c52] uppercase tracking-[0.2em] mb-2">{addon.category}</span>
                  <h4 className="font-serif font-bold text-[#3d2b1f] text-lg mb-1">{addon.name}</h4>
                  <p className="text-xl font-bold text-stone-800 mb-4">RM{addon.price.toLocaleString()}</p>
                  <p className="text-xs text-stone-400 mb-8 line-clamp-2 leading-relaxed">{addon.description}</p>
                  <div className="mt-auto w-full flex gap-2">
                    <button 
                      onClick={() => handleManageAddon(addon)}
                      className="flex-1 py-2.5 bg-stone-50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-stone-100 transition-all border border-stone-100"
                    >
                      {editingAddonId === addon.id ? 'Editing' : 'Edit'}
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this service provider?')) onDeleteAddon(addon.id);
                      }}
                      className="px-4 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'stalls' && (
          <div className="max-w-2xl mx-auto py-10 text-center space-y-8">
             <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-100 shadow-inner">
               <i className="fas fa-store text-2xl"></i>
             </div>
             <h3 className="text-2xl font-serif font-bold text-[#3d2b1f]">Live Stall Catalog</h3>
             <p className="text-stone-500 text-sm">Add dynamic interactive food stations to elevate the guest experience.</p>
             
             <div className="flex gap-2">
                <input 
                  value={newStallName}
                  onChange={(e) => setNewStallName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddStall()}
                  className="flex-1 p-4 rounded-xl border border-stone-200 focus:border-[#a67c52] outline-none transition-all shadow-inner bg-stone-50"
                  placeholder="Enter stall item name (e.g. Fresh Roti Canai Station)"
                />
                <button onClick={handleAddStall} className="px-8 bg-[#3d2b1f] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#a67c52] transition-all active:scale-95 shadow-lg">Register Stall</button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stallItems.map((stall, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-100 flex items-center justify-between group hover:border-[#a67c52] transition-all shadow-sm">
                    <span className="text-xs font-bold text-stone-600">{stall}</span>
                    <button onClick={() => onUpdateStalls(stallItems.filter((_, i) => i !== idx))} className="text-stone-300 hover:text-rose-500 transition-colors">
                      <i className="fas fa-trash-can text-xs"></i>
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManager;
