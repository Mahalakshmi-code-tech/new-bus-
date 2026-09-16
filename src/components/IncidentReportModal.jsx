import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Send, 
  CheckCircle2, 
  Upload, 
  Bus, 
  MapPin, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';

export default function IncidentReportModal({ defaultBusNumber = 'Bus 21A' }) {
  const { isIncidentModalOpen, setIsIncidentModalOpen, submitIncidentReport } = useTransit();

  const [issueType, setIssueType] = useState('Bus Delay');
  const [busNumber, setBusNumber] = useState(defaultBusNumber);
  const [location, setLocation] = useState('Central Bus Stand / Saidapet');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isIncidentModalOpen) return null;

  const issueTypes = [
    'Bus Delay',
    'Breakdown',
    'Overcrowding',
    'Stop Issue',
    'Route Problem',
    'Other'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReport = submitIncidentReport({
        issueType,
        busNumber,
        location,
        description,
        image: imagePreview,
        severity: issueType === 'Breakdown' ? 'High' : 'Medium'
      });

      setSubmittedTicket(newReport);
      setIsSubmitting(false);
    }, 450);
  };

  const handleClose = () => {
    setIsIncidentModalOpen(false);
    setSubmittedTicket(null);
    setDescription('');
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-slate-750 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Report Transport Issue"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/30 dark:border-slate-800 flex items-center justify-between bg-surface-container-low/60 dark:bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-tertiary-fixed dark:bg-amber-950/60 text-tertiary dark:text-amber-400 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                Report Transport Issue
              </h3>
              <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                Dispatch operations & fleet maintenance desk
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Form or Success */}
        {submittedTicket ? (
          <div className="p-6 sm:p-8 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-headline font-black text-xl text-on-surface dark:text-slate-100">
                Report submitted successfully
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Your incident ticket has been logged and assigned to the Fleet Dispatch Center for real-time resolution.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant dark:text-slate-400 font-label uppercase">Ticket ID:</span>
                <span className="font-mono font-bold text-primary dark:text-cyan-400">{submittedTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant dark:text-slate-400 font-label uppercase">Issue Type:</span>
                <span className="font-bold text-on-surface dark:text-slate-100">{submittedTicket.issueType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant dark:text-slate-400 font-label uppercase">Bus / Node:</span>
                <span className="font-bold text-on-surface dark:text-slate-100">{submittedTicket.busNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant dark:text-slate-400 font-label uppercase">Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full text-[10px]">
                  {submittedTicket.status}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="btn-primary w-full py-3 rounded-full font-bold text-sm shadow-md shadow-primary/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh] hide-scrollbar">
            {/* Issue Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-300">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 outline-none"
              >
                {issueTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Bus Number & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                  Bus Number
                </label>
                <input
                  type="text"
                  required
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  placeholder="e.g. Bus 21A, Bus 101"
                  className="w-full bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                  Location / Stop
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Saidapet Junction"
                  className="w-full bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-300">
                Detailed Description
              </label>
              <textarea
                required
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred (delay time, vehicle condition, overcrowding severity)..."
                className="w-full bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl p-4 text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 outline-none resize-none"
              ></textarea>
            </div>

            {/* Optional Image Attachment */}
            <div className="space-y-1.5">
              <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                Optional Image Evidence
              </label>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-750 text-xs font-semibold text-primary dark:text-cyan-400 border border-outline-variant/30 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-primary/30">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-full border border-outline-variant dark:border-slate-700 text-xs sm:text-sm font-semibold text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="btn-primary px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Incident'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
