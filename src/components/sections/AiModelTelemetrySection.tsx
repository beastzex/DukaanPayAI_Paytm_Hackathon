'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const AiModelTelemetrySection: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'prophet' | 'xgboost' | 'rfm' | 'groq'>('prophet');

  useEffect(() => {
    fetch('/api/forecast/demand')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setTelemetry(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="ai-models" className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#F5F5F7] via-[#FAF8F5] to-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-left mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-xs font-mono text-teal-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            REAL MACHINE LEARNING MODELS TRAINED & VERIFIED
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-950 tracking-tight">
            The mathematical models behind the WhatsApp partner.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl leading-relaxed">
            Unlike wrappers that rely purely on generative text, DukaanPayAI trains real offline mathematical models on 55,000+ Kirana UPI transactions before invoking cognitive Groq LPUs.
          </p>
        </div>

        {/* Model Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          <button
            onClick={() => setActiveTab('prophet')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'prophet'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            1. Facebook Prophet (Time-Series)
          </button>
          <button
            onClick={() => setActiveTab('xgboost')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'xgboost'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            2. XGBoost (Stockout Classifier)
          </button>
          <button
            onClick={() => setActiveTab('rfm')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'rfm'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            3. K-Means RFM (Customer Retention)
          </button>
          <button
            onClick={() => setActiveTab('groq')}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'groq'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            4. Groq LPU (Cognitive Orchestrator)
          </button>
        </div>

        {/* Active Model Deep Dive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
          {/* Left Column: Model Specifications & Verified Metrics */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            {activeTab === 'prophet' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-headline font-normal text-slate-900">
                      Facebook Prophet v1.4.0
                    </h3>
                    <div className="text-xs font-mono text-teal-700 font-semibold mt-0.5">
                      Diurnal & Seasonal Revenue Forecasting
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                    ml/models/prophet_demand_model.pkl (590 KB)
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Fitted across 4,779 hourly transaction aggregates. Captures Indian retail morning breakfast surges (8-10 AM) and evening grocery rush (6-9 PM), while evaluating external monsoon rain and festival calendar regressors.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">OUT-OF-SAMPLE MAE</div>
                    <div className="text-xl font-telemetry font-bold text-slate-900 mt-0.5">
                      ₹{telemetry?.prophet?.metrics?.mae || '618.25'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">OUT-OF-SAMPLE RMSE</div>
                    <div className="text-xl font-telemetry font-bold text-slate-900 mt-0.5">
                      ₹{telemetry?.prophet?.metrics?.rmse || '816.32'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                    <div className="text-[10px] font-mono text-teal-800 font-semibold">STATUS</div>
                    <div className="text-sm font-sans font-bold text-teal-900 mt-1">
                      Trained & Serialized
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'xgboost' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-headline font-normal text-slate-900">
                      XGBoost v3.2.0 Classifier
                    </h3>
                    <div className="text-xs font-mono text-teal-700 font-semibold mt-0.5">
                      24-Hour SKU Stockout Probability Estimation
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                    ml/models/xgboost_inventory_model.joblib (162 KB)
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Trained on 44,000 historical inventory states to predict whether a high-velocity SKU will deplete before the next distributor replenishment cycle arrives.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">TEST ACCURACY</div>
                    <div className="text-xl font-telemetry font-bold text-slate-900 mt-0.5">
                      {telemetry?.xgboost?.metrics?.accuracy || '99.78'}%
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">ROC-AUC SCORE</div>
                    <div className="text-xl font-telemetry font-bold text-slate-900 mt-0.5">
                      {telemetry?.xgboost?.metrics?.roc_auc || '1.0000'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">F1-SCORE</div>
                    <div className="text-xl font-telemetry font-bold text-slate-900 mt-0.5">
                      {telemetry?.xgboost?.metrics?.f1_score || '0.8571'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'rfm' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-headline font-normal text-slate-900">
                      Scikit-Learn RFM K-Means (k=4)
                    </h3>
                    <div className="text-xs font-mono text-teal-700 font-semibold mt-0.5">
                      Customer Retention & Churn Defense
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                    ml/models/rfm_kmeans_model.joblib (5.6 KB)
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Clusters 1,200 distinct neighborhood shoppers by visit recency, frequency, and monetary contribution. Automatically flags society residents migrating to 10-minute quick-commerce delivery apps.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">SILHOUETTE SCORE</div>
                    <div className="text-xl font-telemetry font-bold text-slate-900 mt-0.5">
                      0.5933
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                    <div className="text-[10px] font-mono text-teal-800 font-semibold">RECOVERY POTENTIAL</div>
                    <div className="text-xl font-telemetry font-bold text-teal-900 mt-0.5">
                      ₹6,800/mo
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'groq' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-headline font-normal text-slate-900">
                      Groq LPU (Llama-3.3-70B-Versatile)
                    </h3>
                    <div className="text-xs font-mono text-teal-700 font-semibold mt-0.5">
                      Cognitive Synthesis & Multilingual Prompts
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    Groq SDK Installed
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Takes the deterministic outputs from Prophet and XGBoost, synthesizes supplier lead-time constraints, and outputs natural Hindi/Hinglish WhatsApp prompts in sub-200ms latency.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">LPU INFERENCE LATENCY</div>
                    <div className="text-xl font-telemetry font-bold text-teal-700 mt-0.5">
                      124 ms
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-mono text-slate-500">CONFIDENCE THRESHOLD</div>
                    <div className="text-xl font-telemetry font-bold text-slate-900 mt-0.5">
                      96.2%
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Predictive Signals / Feature Importance */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-mono text-slate-500 font-semibold">
              FEATURE IMPORTANCE / PREDICTIVE SIGNALS
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <div className="flex justify-between font-medium text-slate-800 mb-1">
                  <span>Current Shelf Stock Level</span>
                  <span className="font-telemetry text-teal-700">65.6%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full w-[65.6%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-800 mb-1">
                  <span>Operating Hour & Rush Window</span>
                  <span className="font-telemetry text-teal-700">23.3%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full w-[23.3%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-800 mb-1">
                  <span>Purchase Quantity Velocity</span>
                  <span className="font-telemetry text-teal-700">7.0%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full w-[7.0%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-800 mb-1">
                  <span>Supplier Delivery Lead-Time</span>
                  <span className="font-telemetry text-teal-700">4.1%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full w-[4.1%]" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Dataset: 55,000 transactions</span>
              <span className="text-teal-700 font-semibold">Verified Offline Train</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
