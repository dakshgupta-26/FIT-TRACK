import React from 'react';
import { CreditCard, Sparkles, Check, Download, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const BillingPanel: React.FC = () => {
  const { toast } = useToast();

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: 'Invoice Downloaded',
      description: `Receipt for ${invoiceId} downloaded as PDF.`,
    });
  };

  const invoices = [
    { id: 'INV-2026-08', date: 'Aug 01, 2026', amount: '$19.00', status: 'Paid' },
    { id: 'INV-2026-07', date: 'Jul 01, 2026', amount: '$19.00', status: 'Paid' },
    { id: 'INV-2026-06', date: 'Jun 01, 2026', amount: '$19.00', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-teal-400" />
          Billing & Subscription Plan
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your membership tier, default payment instruments, and past billing receipts.
        </p>
      </div>

      {/* Current Plan Overview Card (Linear / Stripe level) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-teal-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ACTIVE SUBSCRIPTION
              </span>
              <span className="text-[10px] font-mono text-emerald-400">• AUTO-RENEWS OCT 01, 2026</span>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              Pro AI Athlete Membership
            </h3>
            <p className="text-xs text-slate-400">
              Unlimited generative AI coaching, continuous telemetry models, and priority cloud pipelines.
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-white font-mono">$19.00</div>
            <div className="text-[10px] text-slate-400 font-mono">per month (Billed monthly)</div>
          </div>
        </div>

        {/* Feature Checkmarks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-white/5">
          {[
            'Unlimited Neural AI Workouts',
            'Full BLE / HealthKit Sensor Sync',
            'Predictive CNS Fatigue Tracking',
            'Automated Macro & Meal Planning',
            'Priority Cloud Backup Pipeline',
            'HIPAA Encrypted Export Archive',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method & Invoices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Payment Method */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Payment Instrument
            </h3>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-widest font-mono">VISA</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  DEFAULT
                </span>
              </div>
              <div className="font-mono text-sm text-slate-200">
                •••• •••• •••• <span className="font-bold text-white">4242</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Expires 08/2028</span>
                <span>Daksh Gupta</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast({ title: 'Payment Update', description: 'Stripe customer portal opened in modal.' })}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition active:scale-95"
          >
            Update Payment Method
          </button>
        </div>

        {/* Invoice Receipts Table */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Billing History & Receipts
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Stripe Invoicing</span>
          </div>

          <div className="divide-y divide-white/5 space-y-2">
            {invoices.map((inv) => (
              <div key={inv.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-mono font-bold text-white">{inv.id}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{inv.date}</div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-200 font-semibold">{inv.amount}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {inv.status}
                  </span>
                  <button
                    onClick={() => handleDownloadInvoice(inv.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                    title="Download PDF Receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
