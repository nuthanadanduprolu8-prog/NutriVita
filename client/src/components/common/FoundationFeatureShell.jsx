import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';

const FoundationFeatureShell = ({
  title,
  subtitle,
  icon: Icon = Activity,
  stageNumber,
  description,
  features = [],
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Dashboard</span>
          </Button>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-semibold text-slate-500">{title}</span>
      </div>

      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-8 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" className="bg-emerald-700/80 text-emerald-200 border-none">
                Stage {stageNumber} Architecture
              </Badge>
              <span className="text-xs text-emerald-200">• Preventive Healthcare</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{title}</h1>
            <p className="text-xs sm:text-sm text-emerald-100">{subtitle}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </div>

      <Card className="space-y-6 p-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Architecture & Implementation Scope</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
        </div>

        {features.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Module Key Capabilities:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feat, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-slate-700">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Foundation scaffold complete. Database models and API contracts defined.
          </p>
          <Link to="/dashboard">
            <Button variant="primary" size="sm">
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default FoundationFeatureShell;
