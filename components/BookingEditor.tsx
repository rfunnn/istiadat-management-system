
import React, { useState } from 'react';
import { WeddingBooking, SlotType, BookingStatus, MenuPackage, AddonService } from '../types';

interface BookingEditorProps {
  booking: WeddingBooking;
  menus: MenuPackage[];
  addonsPortfolio: AddonService[];
  stallItems: string[];
  onSave: (updated: WeddingBooking) => void;
  onCancel: () => void;
}

const BookingEditor: React.FC<BookingEditorProps> = ({ 
  booking, 
  menus, 
  addonsPortfolio, 
  stallItems, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<WeddingBooking>({ 
    ...booking,
    addons: booking.addons || [],
    customBrideItems: booking.customBrideItems || []
  });
  const [newCustomItem, setNewCustomItem] = useState('');
  const [newBrideItem, setNewBrideItem] = useState('');
  const [newManualAddon, setNewManualAddon] = useState('');

  const isNew = !booking.clientName; // Simple heuristic to detect new booking

  const selectedPackage = menus.find(m => m.id === formData.menuPackageId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' || name === 'totalAmount' ? Number(value) : value
    }));
  };

  const toggleMenuType = (isCustom: boolean) => {
    setFormData(prev => ({
      ...prev,
      isCustomMenu: isCustom,
      menuPackageId: isCustom ? prev.menuPackageId : (prev.menuPackageId || menus[0]?.id),
      customMenuItems: isCustom ? (prev.customMenuItems || []) : undefined,
      customBrideItems: isCustom ? (prev.customBrideItems || []) : undefined
    }));
  };

  const customizeCurrentPackage = () => {
    if (!selectedPackage) return;
    setFormData(prev => ({
      ...prev,
      isCustomMenu: true,
      customMenuItems: [...selectedPackage.items],
      customBrideItems: [...(selectedPackage.brideItems || [])]
    }));
  };

  const addCustomItem = () => {
    if (newCustomItem.trim()) {
      setFormData(prev => ({
        ...prev,
        customMenuItems: [...(prev.customMenuItems || []), newCustomItem.trim()]
      }));
      setNewCustomItem('');
    }
  };

  const removeCustomItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customMenuItems: (prev.customMenuItems || []).filter((_, i) => i !== index)
    }));
  };

  const addBrideItem = () => {
    if (newBrideItem.trim()) {
      setFormData(prev => ({
        ...prev,
        customBrideItems: [...(prev.customBrideItems || []), newBrideItem.trim()]
      }));
      setNewBrideItem('');
    }
  };

  const removeBrideItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customBrideItems: (prev.customBrideItems || []).filter((_, i) => i !== index)
    }));
  };

  const toggleAddon = (item: string) => {
    const current = formData.addons || [];
    if (current.includes(item)) {
      setFormData(prev => ({
        ...prev,
        addons: current.filter(i => i !== item)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        addons: [...current, item]
      }));
    }
  };

  const addManualAddon = () => {
    if (newManualAddon.trim()) {
      toggleAddon(newManualAddon.trim());
      setNewManualAddon('');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onCancel}
            className="group flex items-center gap-2 text-stone-400 hover:text-[#a67c52] transition-colors mb-4"
          >
            <i className="fas fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Return to Registry</span>
          </button>
          <h2 className="text-3xl font-serif font-bold text-[#3d2b1f]">
            {isNew ? 'Register New Event' : 'Refine Event Details'}
          </h2>
          <p className="text-stone-500 mt-1">
            {isNew 
              ? 'Fill in the details to create a new reservation' 
              : <>Modifying reservation for <span className="text-[#a67c52] font-bold">{booking.clientName}</span></>}
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="px-8 py-3 rounded-xl border border-stone-200 text-stone-500 font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all"
          >
            Discard Changes
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-3 rounded-xl bg-[#3d2b1f] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#2c1f17] shadow-lg shadow-[#3d2b1f]/20 transition-all active:scale-95"
          >
            {isNew ? 'Register Event' : 'Finalize Update'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Core Logistics Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-[#3d2b1f] mb-8 border-b border-stone-100 pb-4 flex items-center gap-3">
              <i className="fas fa-calendar-day text-[#a67c52]"></i>
              Core Logistics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Client Full Name</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"></i>
                  <input 
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Enter bride/groom names..."
                    className="w-full bg-stone-50 border border-stone-200 p-4 pl-12 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"></i>
                  <input 
                    type="email"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 p-4 pl-12 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"></i>
                  <input 
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 p-4 pl-12 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Event Date</label>
                <input 
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 p-4 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Event Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {[SlotType.DAY, SlotType.NIGHT].map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData(prev => ({ ...prev, slot: s }))}
                      className={`py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        formData.slot === s 
                        ? 'bg-[#a67c52] text-white border-[#a67c52] shadow-md shadow-[#a67c52]/20' 
                        : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-[#a67c52]/30'
                      }`}
                    >
                      <i className={`fas ${s === SlotType.DAY ? 'fa-sun' : 'fa-moon'} mr-2`}></i>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Expected Guests</label>
                <div className="relative">
                  <i className="fas fa-users absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"></i>
                  <input 
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 p-4 pl-12 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Total Amount (RM)</label>
                <div className="relative">
                  <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"></i>
                  <input 
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 p-4 pl-12 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Culinary Customization Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-[#3d2b1f] mb-8 border-b border-stone-100 pb-4 flex items-center gap-3">
              <i className="fas fa-utensils text-[#a67c52]"></i>
              Culinary Experience
            </h3>

            {!formData.isCustomMenu ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Choose Base Package</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menus.map((menu) => (
                      <button
                        key={menu.id}
                        onClick={() => setFormData(prev => ({ ...prev, menuPackageId: menu.id }))}
                        className={`flex flex-col p-6 rounded-2xl border text-left transition-all ${
                          formData.menuPackageId === menu.id 
                          ? 'bg-[#a67c52]/5 border-[#a67c52] ring-1 ring-[#a67c52]' 
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4 w-full">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.menuPackageId === menu.id ? 'bg-[#a67c52] text-white' : 'bg-white text-stone-400 shadow-sm'}`}>
                            <i className={`fas ${menu.icon || 'fa-utensils'}`}></i>
                          </div>
                          <p className="text-xs font-bold text-[#a67c52]">RM{menu.pricePerPax} PP</p>
                        </div>
                        <div>
                          <p className="font-bold text-[#3d2b1f] text-base">{menu.name}</p>
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{menu.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPackage && (
                  <div className="bg-[#fcfaf7] border border-[#a67c52]/10 rounded-3xl p-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a67c52]">Standard Inclusion for {selectedPackage.name}</h4>
                      <button 
                        onClick={customizeCurrentPackage}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#3d2b1f] hover:text-[#a67c52] transition-colors"
                      >
                        <i className="fas fa-pen-nib"></i>
                        Personalize this Menu
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-3 block">Guest Menu Items</span>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedPackage.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-100">
                              <div className="w-1.5 h-1.5 bg-[#a67c52] rounded-full shrink-0"></div>
                              <span className="text-xs font-medium text-stone-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-[9px] font-bold text-[#a67c52] uppercase tracking-widest mb-3 block">Bride's Table (Hidangan Pengantin)</span>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedPackage.brideItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#a67c52]/10">
                              <i className="fas fa-heart text-[#a67c52] text-[10px]"></i>
                              <span className="text-xs font-bold text-[#a67c52]">{item}</span>
                            </div>
                          )) || <p className="text-xs text-stone-400 italic">No specific bride items listed.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Custom Menu Builder</label>
                     <p className="text-xs text-stone-500 mt-1">
                       {selectedPackage ? `Adjusting based on ${selectedPackage.name}` : 'Drafting a bespoke culinary plan'}
                     </p>
                   </div>
                   {selectedPackage && (
                     <button 
                        onClick={() => toggleMenuType(false)}
                        className="text-[10px] font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest"
                     >
                       Revert to defaults
                     </button>
                   )}
                </div>

                {/* Main Guest Menu Builder */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Main Guest Menu</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCustomItem}
                      onChange={(e) => setNewCustomItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                      placeholder="Add a new guest dish..."
                      className="flex-1 bg-stone-50 border border-stone-200 p-4 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                    />
                    <button 
                      onClick={addCustomItem}
                      className="bg-[#3d2b1f] text-white px-6 rounded-xl hover:bg-[#2c1f17] transition-all active:scale-95 shadow-lg shadow-[#3d2b1f]/10"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {(formData.customMenuItems || []).map((item, idx) => (
                      <div key={idx} className="group flex items-center justify-between bg-white border border-stone-200 p-3 rounded-xl hover:border-[#a67c52]/30 transition-all shadow-sm">
                        <span className="text-xs font-medium text-stone-700 flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#a67c52] rounded-full"></span>
                          {item}
                        </span>
                        <button onClick={() => removeCustomItem(idx)} className="text-stone-300 hover:text-rose-500"><i className="fas fa-trash-can text-[10px]"></i></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bride Menu Builder */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-[#a67c52] uppercase tracking-widest ml-1">Bride Menu Items (Hidangan Pengantin)</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newBrideItem}
                      onChange={(e) => setNewBrideItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addBrideItem()}
                      placeholder="Add special dish for bride/groom..."
                      className="flex-1 bg-[#fcfaf7] border border-[#a67c52]/20 p-4 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                    />
                    <button 
                      onClick={addBrideItem}
                      className="bg-[#a67c52] text-white px-6 rounded-xl hover:bg-[#3d2b1f] transition-all active:scale-95 shadow-lg"
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {(formData.customBrideItems || []).map((item, idx) => (
                      <div key={idx} className="group flex items-center justify-between bg-white border border-[#a67c52]/10 p-3 rounded-xl hover:border-[#a67c52] transition-all shadow-sm">
                        <span className="text-xs font-bold text-[#a67c52] flex items-center gap-2">
                          <i className="fas fa-heart text-[8px]"></i>
                          {item}
                        </span>
                        <button onClick={() => removeBrideItem(idx)} className="text-stone-300 hover:text-rose-500"><i className="fas fa-trash-can text-[10px]"></i></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Premium Portfolio Services Selection */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-[#3d2b1f] mb-8 border-b border-stone-100 pb-4 flex items-center gap-3">
              <i className="fas fa-gem text-[#a67c52]"></i>
              Premium Portfolio & Add-ons
            </h3>
            
            <div className="space-y-10">
              {/* Existing Services Selection */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-4 block">Select Registered Services</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addonsPortfolio.map((addon) => {
                    const isSelected = formData.addons?.includes(addon.name);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.name)}
                        className={`flex flex-col p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                          isSelected 
                          ? 'bg-[#a67c52]/5 border-[#a67c52] ring-1 ring-[#a67c52]' 
                          : 'bg-stone-50 border-stone-200 hover:border-[#a67c52]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#a67c52] text-white' : 'bg-white text-stone-400 shadow-sm'}`}>
                             <i className={`fas ${addon.icon} text-xs`}></i>
                           </div>
                           <div className="flex-1">
                             <p className="text-[10px] font-bold text-[#a67c52] uppercase tracking-tighter">{addon.category}</p>
                             <p className="text-xs font-bold text-[#3d2b1f] truncate">{addon.name}</p>
                           </div>
                        </div>
                        <p className="text-sm font-bold text-stone-800">RM{addon.price.toLocaleString()}</p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 text-[#a67c52]">
                            <i className="fas fa-circle-check"></i>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Stalls Selection */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-4 block">Select Live Food Stations</label>
                <div className="flex flex-wrap gap-2">
                  {stallItems.map((stall) => {
                    const isSelected = formData.addons?.includes(stall);
                    return (
                      <button
                        key={stall}
                        onClick={() => toggleAddon(stall)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-3 ${
                          isSelected 
                          ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-md' 
                          : 'bg-white text-stone-500 border-stone-200 hover:border-[#a67c52]'
                        }`}
                      >
                        <i className={`fas ${isSelected ? 'fa-check' : 'fa-store'} text-[10px]`}></i>
                        {stall}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="pt-6 border-t border-stone-100">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-4 block">Other / Special Requests</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newManualAddon}
                    onChange={(e) => setNewManualAddon(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addManualAddon()}
                    placeholder="Enter manual service request..."
                    className="flex-1 bg-stone-50 border border-stone-200 p-4 rounded-xl outline-none focus:border-[#a67c52] transition-all font-medium text-stone-700"
                  />
                  <button 
                    onClick={addManualAddon}
                    className="bg-[#3d2b1f] text-white px-6 rounded-xl hover:bg-[#2c1f17] transition-all active:scale-95 shadow-lg"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Selected List Pills */}
              <div className="flex flex-wrap gap-2">
                {(formData.addons || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#fcfaf7] border border-[#a67c52]/30 px-4 py-2 rounded-xl text-[10px] font-bold text-[#a67c52] uppercase tracking-wider group">
                    <i className="fas fa-star text-[8px]"></i>
                    {item}
                    <button onClick={() => toggleAddon(item)} className="text-stone-300 hover:text-rose-500 transition-colors">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Notes Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-[#3d2b1f] mb-8 border-b border-stone-100 pb-4 flex items-center gap-3">
              <i className="fas fa-clipboard-list text-[#a67c52]"></i>
              Operational Notes
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Internal Remarks</label>
              <textarea 
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={5}
                placeholder="Enter specific requirements, vendor access times, or client preferences..."
                className="w-full bg-stone-50 border border-stone-200 p-6 rounded-[2rem] outline-none focus:border-[#a67c52] transition-all font-medium text-stone-600 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          <div className="bg-[#3d2b1f] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <h4 className="font-serif font-bold text-xl mb-6 border-b border-white/10 pb-4 tracking-wide">Live Summary</h4>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#a67c52] uppercase font-bold tracking-[0.2em]">Revenue Projection</span>
                <span className="text-xl font-bold tracking-tight">RM{formData.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#a67c52] uppercase font-bold tracking-[0.2em]">Occupancy Cost</span>
                <span className="text-sm font-medium">~ RM{(formData.totalAmount / (formData.guests || 1)).toFixed(2)} / Guest</span>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-[#a67c52] rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    <i className="fas fa-calendar-check text-white"></i>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-40 tracking-wider">Confirmed For</p>
                    <p className="text-xs font-bold">{formData.date} • {formData.slot}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <i className="fas fa-utensils text-[#a67c52]"></i>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-40 tracking-wider">Catering Plan</p>
                    <p className="text-xs font-bold truncate max-w-[150px]">
                      {formData.isCustomMenu 
                        ? (selectedPackage ? `Customized: ${selectedPackage.name}` : 'Bespoke Plan')
                        : (selectedPackage?.name || 'Venue Only')}
                    </p>
                  </div>
                </div>

                {formData.addons && formData.addons.length > 0 && (
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <i className="fas fa-plus-circle text-amber-500"></i>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-40 tracking-wider">Premium Selection</p>
                      <p className="text-[10px] font-bold leading-relaxed">
                        {formData.addons.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#fcfaf7] border border-[#a67c52]/20 rounded-[2.5rem] p-8 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#a67c52] mx-auto mb-4 shadow-sm">
              <i className="fas fa-shield-halved"></i>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3d2b1f] mb-2">Audit Trail</p>
            <p className="text-[11px] text-stone-500 font-medium">Last modified by Owner on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingEditor;
