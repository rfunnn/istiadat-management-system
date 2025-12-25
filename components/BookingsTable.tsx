
import React, { useRef } from 'react';
import { WeddingBooking, BookingStatus, SlotType, MenuPackage } from '../types';

interface BookingsTableProps {
  bookings: WeddingBooking[];
  menus: MenuPackage[];
  isCateringEnabled: boolean;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onEdit: (booking: WeddingBooking) => void;
  onAddNew: () => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings, menus, isCateringEnabled, onUpdateStatus, onEdit, onAddNew }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case BookingStatus.PENDING: return 'bg-amber-50 text-[#a67c52] border-amber-100';
      case BookingStatus.REJECTED: return 'bg-rose-50 text-rose-700 border-rose-100';
      case BookingStatus.CANCELLED: return 'bg-stone-100 text-stone-500 border-stone-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const downloadPDF = (booking: WeddingBooking) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Resolve specific menu items based on selection
    let menuItems: string[] = [];
    let brideItems: string[] = [];
    let packageName = 'N/A';
    
    if (booking.isCustomMenu) {
      menuItems = booking.customMenuItems || [];
      brideItems = booking.customBrideItems || [];
      packageName = 'Custom Bespoke Menu';
    } else if (booking.menuPackageId) {
      const pkg = menus.find(m => m.id === booking.menuPackageId);
      menuItems = pkg?.items || [];
      brideItems = pkg?.brideItems || [];
      packageName = pkg?.name || booking.menuPackageId;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Event Report - ${booking.clientName}</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #3d2b1f; }
            h1, h2 { font-family: 'Playfair Display', serif; }
            .header { border-bottom: 2px solid #a67c52; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #a67c52; font-weight: 700; margin-bottom: 10px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .info-box { background: #fcfaf7; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
            .label { font-size: 9px; text-transform: uppercase; color: #999; font-weight: 700; margin-bottom: 4px; }
            .value { font-size: 14px; font-weight: 600; }
            .menu-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 12px; }
            .dot { width: 6px; height: 6px; background: #a67c52; border-radius: 50%; }
            .bride-dot { width: 6px; height: 6px; background: #3d2b1f; border-radius: 50%; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; border: 1px solid #ddd; }
            .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 10px; color: #aaa; text-align: center; }
            .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin: 0;">ISTIADAT</h1>
              <p style="margin: 5px 0 0; font-size: 10px; letter-spacing: 3px; color: #a67c52;">OFFICIAL EVENT REPORT</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: 700;">ID: ${booking.id}</p>
              <p style="margin: 5px 0 0; font-size: 10px; color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="grid">
              <div class="info-box">
                <div class="label">Client Name</div>
                <div class="value">${booking.clientName}</div>
              </div>
              <div class="info-box">
                <div class="label">Contact Details</div>
                <div class="value">${booking.contact}</div>
                <div class="value" style="font-size: 12px; color: #a67c52; margin-top: 4px;">${booking.phoneNumber}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Schedule & Status</div>
            <div class="grid">
              <div class="info-box">
                <div class="label">Event Date</div>
                <div class="value">${booking.date} (${booking.slot})</div>
              </div>
              <div class="info-box">
                <div class="label">Booking Status</div>
                <div class="status-badge">${booking.status}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Catering & Guest Details</div>
            <div class="grid">
              <div class="info-box">
                <div class="label">Guest Count</div>
                <div class="value">${booking.guests} Pax</div>
              </div>
              <div class="info-box">
                <div class="label">Total Amount</div>
                <div class="value">RM ${booking.totalAmount.toLocaleString()}</div>
              </div>
            </div>
            
            <div class="info-box" style="margin-top: 20px;">
              <div class="label">Selected Package</div>
              <div class="value" style="color: #a67c52; margin-bottom: 12px;">${packageName}</div>
              
              <div style="margin-bottom: 20px;">
                <div class="label">Core Guest Menu Items</div>
                <div class="menu-grid">
                  ${menuItems.length > 0 
                    ? menuItems.map(item => `<div class="menu-item"><div class="dot"></div>${item}</div>`).join('')
                    : '<div class="menu-item" style="color: #999;">No specific items listed</div>'
                  }
                </div>
              </div>

              <div>
                <div class="label">Bride's Table Special Menu</div>
                <div class="menu-grid">
                  ${brideItems.length > 0 
                    ? brideItems.map(item => `<div class="menu-item"><div class="bride-dot"></div><span style="font-weight:600">${item}</span></div>`).join('')
                    : '<div class="menu-item" style="color: #999;">No bride-specific items listed</div>'
                  }
                </div>
              </div>
            </div>
          </div>

          ${booking.notes ? `
          <div class="section">
            <div class="section-title">Operational Remarks</div>
            <div class="info-box">
              <div class="value" style="font-size: 12px; font-weight: 400; font-style: italic; line-height: 1.6;">${booking.notes}</div>
            </div>
          </div>
          ` : ''}

          <div class="footer">
            Istiadat Wedding Company & Events • Corporate HQ Office • This is a computer-generated document.
          </div>

          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-serif font-bold text-[#3d2b1f]">Event Registry</h3>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
            <input 
              type="text" 
              placeholder="Search by client name..." 
              className="pl-12 pr-6 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition-all w-full md:w-72"
            />
          </div>
          <button 
            onClick={onAddNew}
            className="px-6 py-2.5 bg-[#3d2b1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#a67c52] transition-all flex items-center gap-2 shadow-lg shadow-stone-200 active:scale-95"
          >
            <i className="fas fa-plus"></i>
            Register New Event
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Client Details</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Schedule</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Catering Plan</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Attendance</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Valuation</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-16 text-center text-stone-400 font-medium italic">No active event registrations found.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#fcfaf7] transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-stone-800 text-base">{booking.clientName || 'Unnamed Client'}</p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <p className="text-[11px] text-stone-400 font-medium flex items-center gap-1.5">
                        <i className="fas fa-envelope text-[9px] w-3"></i>
                        {booking.contact || 'No email provided'}
                      </p>
                      <p className="text-[11px] text-[#a67c52] font-bold flex items-center gap-1.5">
                        <i className="fas fa-phone text-[9px] w-3"></i>
                        {booking.phoneNumber || 'No phone provided'}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-stone-700">{booking.date}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <i className={`fas ${booking.slot === SlotType.NIGHT ? 'fa-moon text-[#a67c52]' : 'fa-sun text-amber-500'} text-[10px]`}></i>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-500">{booking.slot} Slot</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {!isCateringEnabled ? (
                      <span className="text-[11px] text-stone-400 font-bold uppercase border border-stone-100 px-2 py-1 rounded">Venue Only</span>
                    ) : booking.isCustomMenu ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-50 text-[#a67c52] rounded-lg flex items-center justify-center border border-amber-100">
                          <i className="fas fa-magic text-xs"></i>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#a67c52] uppercase">Custom Order</span>
                          <span className="text-xs text-stone-500 font-medium">Bespoke Menu</span>
                        </div>
                      </div>
                    ) : booking.menuPackageId ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-stone-50 text-stone-600 rounded-lg flex items-center justify-center border border-stone-200">
                          <i className="fas fa-utensils text-xs"></i>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-stone-400 uppercase">Package</span>
                          <span className="text-xs text-stone-700 font-bold">{menus.find(m => m.id === booking.menuPackageId)?.name || booking.menuPackageId}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">No Catering</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-stone-600 bg-stone-50 px-3 py-1 rounded-lg">{booking.guests} Guests</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-base font-bold text-[#3d2b1f]">RM{booking.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => downloadPDF(booking)}
                        className="w-9 h-9 flex items-center justify-center bg-stone-50 text-stone-400 hover:bg-[#3d2b1f] hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                        title="Download PDF Report"
                      >
                        <i className="fas fa-file-pdf text-xs"></i>
                      </button>

                      {booking.status === BookingStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(booking.id, BookingStatus.APPROVED)}
                            className="w-9 h-9 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                            title="Approve"
                          >
                            <i className="fas fa-check text-xs"></i>
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(booking.id, BookingStatus.REJECTED)}
                            className="w-9 h-9 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                            title="Reject"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => onEdit(booking)}
                        className="w-9 h-9 flex items-center justify-center bg-stone-50 text-stone-400 hover:bg-[#a67c52] hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                        title="Edit Details"
                      >
                        <i className="fas fa-pen-to-square text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
