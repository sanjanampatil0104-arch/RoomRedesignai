import React, { useState, useEffect } from 'react';
import { X, Key, Server, CheckCircle2, AlertCircle, RefreshCw, Cpu } from 'lucide-react';
import { fetchHealth } from '../api/client';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [serverHealth, setServerHealth] = useState<{
    status: string;
    project: string;
    active_model: string;
    has_hf_key: boolean;
    default_provider: string;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  useEffect(() => {
    setTempKey(apiKey);
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen, apiKey]);

  const checkStatus = async () => {
    setIsChecking(true);
    setCheckError(null);
    try {
      const data = await fetchHealth();
      setServerHealth(data);
    } catch (err: any) {
      setCheckError(err.message || 'Cannot reach backend server');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(tempKey.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E1D5] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6D756C] hover:bg-[#EFE9DF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#3D5A45]/10 text-[#3D5A45] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1E1B]">AI Engine & Settings</h3>
            <p className="text-xs text-[#6D756C]">Configure inference provider and Hugging Face API</p>
          </div>
        </div>

        {/* Server Status Indicator */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E8E1D5] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#3D5A45]" />
              <span className="text-xs font-semibold text-[#1C1E1B]">Backend API Status</span>
            </div>
            <button
              onClick={checkStatus}
              disabled={isChecking}
              className="text-xs text-[#3D5A45] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              Check
            </button>
          </div>

          {serverHealth ? (
            <div className="text-xs text-[#4B514A] space-y-1 bg-[#F5F2EB] p-3 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Connected to {serverHealth.project}</span>
              </div>
              <div className="text-[11px] text-[#6D756C]">
                Active Model: <code className="bg-white px-1.5 py-0.5 rounded text-[#1C1E1B]">{serverHealth.active_model}</code>
              </div>
              <div className="text-[11px] text-[#6D756C]">
                Backend HF Key Configured: <span className="font-semibold">{serverHealth.has_hf_key ? 'Yes (Live)' : 'No (Using Offline Resilient Engine)'}</span>
              </div>
            </div>
          ) : checkError ? (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{checkError}</span>
            </div>
          ) : (
            <div className="text-xs text-[#6D756C]">Checking server connection...</div>
          )}
        </div>

        {/* Custom Hugging Face Token input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1E1B] mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#3D5A45]" />
              Hugging Face User Access Token (Optional)
            </label>
            <input
              type="password"
              placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5CABE] bg-white text-xs text-[#1C1E1B] placeholder-[#9EA69D] focus:outline-none focus:ring-2 focus:ring-[#3D5A45]"
            />
            <p className="mt-1 text-[11px] text-[#6D756C]">
              You can get a free token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-[#3D5A45] underline">huggingface.co/settings/tokens</a>. If left blank, the app operates using the built-in intelligent architectural fallback engine.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EAF1EB]/70 border border-[#C2D4C6] text-xs text-[#2D4433] leading-relaxed">
            <span className="font-semibold">Resilient Micro-Project Architecture:</span> Both the live Hugging Face Inference API and the built-in high-fidelity local engine are fully supported. During viva or college presentation, the platform will never fail or show a blank screen!
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#6D756C] hover:bg-[#EFE9DF]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#3D5A45] text-white text-xs font-medium hover:bg-[#324B39] shadow-xs cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
