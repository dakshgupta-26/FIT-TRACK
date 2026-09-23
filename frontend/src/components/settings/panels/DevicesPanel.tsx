import React, { useState } from 'react';
import { Watch, Battery, RefreshCw, Wifi, WifiOff, Heart, CheckCircle2, Plus } from 'lucide-react';
import { DeviceItem } from '../types';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface DevicesPanelProps {
  devices: DeviceItem[];
  onToggleDevice: (id: string) => void;
}

export const DevicesPanel: React.FC<DevicesPanelProps> = ({ devices, onToggleDevice }) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: 'Bluetooth Scan Complete',
        description: 'No new unpaired ANT+ or BLE fitness sensors detected in vicinity.',
      });
    }, 1500);
  };

  const connectedCount = devices.filter((d) => d.connected).length;

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Watch className="w-4 h-4 text-teal-400" />
            Connected Wearable Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage paired Bluetooth Smart, ANT+, and health kit telemetry sensors.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-teal-500/40 text-xs text-slate-200 hover:text-white transition shrink-0 self-start sm:self-auto active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={cn('w-3.5 h-3.5 text-teal-400', isScanning && 'animate-spin')} />
          <span>{isScanning ? 'Scanning BLE...' : 'Scan New Device'}</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Paired Devices</span>
          <div className="text-sm font-bold text-white font-mono">{devices.length} Total</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Live Telemetry</span>
          <div className="text-sm font-bold text-teal-400 font-mono">{connectedCount} Active</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Protocol</span>
          <div className="text-sm font-bold text-slate-300 font-mono">BLE / HealthKit</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Heart Rate Sync</span>
          <div className="text-sm font-bold text-rose-400 font-mono">Real-time</div>
        </div>
      </div>

      {/* Wearable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => {
          const isConnected = device.connected;

          return (
            <div
              key={device.id}
              className={cn(
                'p-4 rounded-2xl border transition duration-200 flex flex-col justify-between space-y-4',
                isConnected
                  ? 'bg-slate-900/70 border-teal-500/30 hover:border-teal-500/50 shadow-md'
                  : 'bg-slate-950/40 border-white/5 opacity-60 hover:opacity-80'
              )}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">{device.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{device.type}</p>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider',
                      isConnected
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    )}
                  >
                    {isConnected ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              {/* Specs & Metrics */}
              {isConnected && (
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Battery className="w-3.5 h-3.5 text-teal-400" />
                      <span>Battery</span>
                    </span>
                    <span className="font-mono text-slate-200 font-semibold">{device.battery}%</span>
                  </div>

                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        device.battery > 50 ? 'bg-teal-400' : device.battery > 20 ? 'bg-amber-400' : 'bg-rose-500'
                      )}
                      style={{ width: `${device.battery}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span>Pulse Stream:</span>
                    <span className="font-mono text-rose-300 font-bold">{device.pulse}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Last Synced:</span>
                    <span>{device.sync}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => onToggleDevice(device.id)}
                className={cn(
                  'w-full py-2 rounded-xl text-xs font-bold transition duration-150 active:scale-95',
                  isConnected
                    ? 'bg-slate-950 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40'
                    : 'bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25'
                )}
              >
                {isConnected ? 'Disconnect Sensor' : 'Pair & Synchronize'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
