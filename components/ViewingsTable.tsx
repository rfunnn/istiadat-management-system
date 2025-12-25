
import React from 'react';
import { ViewingRequest, BookingStatus } from '../types';

interface ViewingsTableProps {
  viewings: ViewingRequest[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

const ViewingsTable: React.FC<ViewingsTableProps> = ({ viewings, onUpdateStatus }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case BookingStatus.PENDING: return 'bg-amber-50 text-[#a67c52] border-amber-100';
      case BookingStatus.REJECTED: return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-stone-100 text-stone-500 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="p-8 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#3d2b1f]">Scheduled Appointments</h3>
          <p className="text-sm text-stone-400 mt-1">Manage scheduled site tours for potential clients.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-stone-50 text-stone-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-100 transition-all">
            <i className="fas fa-filter mr-2"></i> Filter
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Client Identity</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Appointment Schedule</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {viewings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-stone-400 font-medium italic">No pending appointment requests.</td>
              </tr>
            ) : (
              viewings.map((viewing) => (
                <tr key={viewing.id} className="hover:bg-[#fcfaf7] transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-stone-800 text-base">{viewing.clientName}</p>
                    <p className="text-xs text-stone-400 font-medium">{viewing.contact}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-stone-700">{viewing.date}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-stone-400">
                        <i className="far fa-clock text-[10px]"></i>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{viewing.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(viewing.status)}`}>
                      {viewing.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      {viewing.status === BookingStatus.PENDING && (
                        <button 
                          onClick={() => onUpdateStatus(viewing.id, BookingStatus.APPROVED)}
                          className="px-6 py-2 bg-[#3d2b1f] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#a67c52] shadow-sm transition-all active:scale-95"
                        >
                          Confirm
                        </button>
                      )}
                      <button className="w-9 h-9 flex items-center justify-center bg-stone-50 text-stone-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all shadow-sm active:scale-90">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-stone-50/50 border-t border-stone-100">
        <div className="flex items-center justify-center gap-2 text-stone-300 text-[10px] font-bold uppercase tracking-[0.2em]">
          <i className="fas fa-shield-check"></i>
          Secure Appointment Management
        </div>
      </div>
    </div>
  );
};

export default ViewingsTable;
