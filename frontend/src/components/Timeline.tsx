import React from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, XCircle, Clock, Loader2, Activity } from 'lucide-react';

const formatTime = (ts: string | number | null | undefined) => {
    if (!ts) return '';
    // If it's a unix timestamp in seconds, convert to MS
    const timeMs = typeof ts === 'number' && ts < 20000000000 ? ts * 1000 : ts;
    return new Date(timeMs).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const Timeline = () => {
    const { currentResult } = useStore();

    if (!currentResult) return null;

    const events: any[] = Array.isArray(currentResult.ci_timeline) ? currentResult.ci_timeline : [];
    if (events.length === 0) return null;

    const isFinal = ['PASSED', 'FAILED', 'PARTIAL'].includes(currentResult.ci_status);
    const isResolved = currentResult.ci_status === 'PASSED';
    const isPartial = currentResult.ci_status === 'PARTIAL';

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl mt-6">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    Execution Timeline
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">{events.length} events</span>
            </div>

            <div className="px-4 sm:px-6 py-4">
                <div className="relative border-l-2 border-slate-700 ml-2 space-y-4">
                    {events.map((rawEvent, idx) => {
                        const isObject = typeof rawEvent === 'object' && rawEvent !== null;
                        const event = isObject ? rawEvent : { description: rawEvent };

                        const desc = event.description || '';
                        const ts = event.timestamp;
                        const iter = event.iteration || 0;
                        const maxRetries = event.max_retries || 5;

                        const isLast = idx === events.length - 1;
                        const isErr = desc.toLowerCase().includes('error') || desc.toLowerCase().includes('fail') || desc.toLowerCase().includes('reject');
                        const isOk = desc.toLowerCase().includes('pass') || desc.toLowerCase().includes('success') || desc.toLowerCase().includes('resolv') || desc.toLowerCase().includes('accept');

                        return (
                            <div key={idx} className="relative pl-8">
                                {/* dot */}
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center
                                    ${isErr ? 'bg-red-900 border-red-500' : isOk ? 'bg-emerald-900 border-emerald-500' : isLast && !isFinal ? 'bg-blue-900 border-blue-500' : 'bg-slate-800 border-slate-600'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isLast && !isFinal ? 'animate-ping bg-blue-400' : isErr ? 'bg-red-400' : isOk ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                                </div>

                                <div className={`bg-slate-900/50 p-3 rounded-xl border ${isErr ? 'border-red-900/40' : isOk ? 'border-emerald-900/40' : 'border-slate-700/50'} hover:border-slate-600/60 transition-colors`}>
                                    <div className="flex items-start justify-between gap-3 mb-1.5 border-b border-slate-700/30 pb-1.5">
                                        <div className="flex items-center gap-2">
                                            {/* Iteration Badge */}
                                            <span className="bg-slate-800 text-slate-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-600">
                                                {iter + 1}/{maxRetries}
                                            </span>
                                            {/* Pass/Fail Match */}
                                            {isErr && <span className="text-[9px] uppercase font-black tracking-widest text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded border border-red-800/50">Failed</span>}
                                            {isOk && <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-800/50">Passed</span>}
                                            {!isErr && !isOk && <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">INFO</span>}
                                        </div>
                                        {/* Timestamp */}
                                        {ts && (
                                            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-mono">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(ts)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <p className={`text-xs leading-relaxed ${isErr ? 'text-red-300' : isOk ? 'text-emerald-300' : 'text-slate-300'}`}>
                                            {desc}
                                        </p>
                                        {isLast && !isFinal && (
                                            <Loader2 className="w-3 h-3 text-blue-400 animate-spin flex-shrink-0 ml-auto" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Terminal status */}
                    {isFinal && (
                        <div className="relative pl-8">
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isResolved ? 'bg-emerald-900 border-emerald-500' :
                                isPartial ? 'bg-amber-900 border-amber-500' :
                                    'bg-red-900 border-red-500'
                                }`}>
                                {isResolved && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                                {isPartial && <CheckCircle2 className="w-2.5 h-2.5 text-amber-400 opacity-80" />}
                                {!isResolved && !isPartial && <XCircle className="w-2.5 h-2.5 text-red-400" />}
                            </div>
                            <div className={`p-3 rounded-xl border font-black text-sm text-center uppercase tracking-widest ${isResolved ? 'border-emerald-700/50 bg-emerald-900/20 text-emerald-400' :
                                isPartial ? 'border-amber-700/50 bg-amber-900/20 text-amber-400' :
                                    'border-red-700/50 bg-red-900/20 text-red-400'
                                }`}>
                                {isResolved ? '✅ All Tests Passed — CI PASSED' :
                                    isPartial ? '⚡ Partial Fix Applied — Static Issues Addressed' :
                                        '❌ Agent Exhausted Retries — CI FAILED'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
