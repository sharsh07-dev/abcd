import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import InputPanel from './components/InputPanel';
import ScorePanel from './components/ScorePanel';
import FixTable from './components/FixTable';
import Timeline from './components/Timeline';
import RunHistoryPanel from './components/RunHistoryPanel';
import { BrainCircuit, ShieldCheck, Zap, Activity, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

function App() {
    const { currentResult, runId, startPolling, fetchRuns, isLoading, error } = useStore();

    useEffect(() => {
        fetchRuns();
        if (runId) startPolling();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const isActive = !!(currentResult && ['PENDING', 'QUEUED', 'IN_PROGRESS', 'RUNNING'].includes(currentResult.ci_status));
    const isFinal = !!(currentResult && ['PASSED', 'FAILED', 'PARTIAL'].includes(currentResult.ci_status));

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">

            {/* ───── Premium Dark Header ───── */}
            <header className="border-b border-slate-800/80 bg-[#020817]/90 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all">
                    <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">

                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/20 shrink-0">
                            <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>

                        <div className="text-center sm:text-left flex flex-col justify-center">
                            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                Autonomous CI/CD Healing Core
                            </h1>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5 text-[9px] sm:text-[10px] font-black text-slate-500 tracking-widest uppercase mt-1">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" /> Multi-Agent</span>
                                <span className="flex items-center gap-1.5 text-slate-700 font-black">•</span>
                                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500/80" /> LangGraph</span>
                                <span className="flex items-center gap-1.5 text-slate-700 font-black">•</span>
                                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-500/80" /> Self-Healing</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Chip Removed per request */}
                </div>
            </header>

            {/* ───── Main Grid ───── */}
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">

                {/* Left panel (1/4) */}
                <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-[76px]">
                    <InputPanel />
                    <RunHistoryPanel />

                    <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 text-xs text-slate-500 space-y-2 leading-relaxed">
                        <p className="font-bold text-slate-400 text-[11px] uppercase tracking-widest">⚙ Agent Specs</p>
                        <p>Each run: isolated sandbox · AST analysis · dynamic test execution · up to <strong className="text-slate-300">5 retry iterations</strong> · LangGraph multi-agent orchestration.</p>
                        <p>Branch naming: <code className="text-blue-300/70 bg-slate-800 px-1 rounded text-[10px]">TEAM_NAME_LEADER_NAME_AI_Fix</code></p>
                        <p>Commits are prefixed with <code className="text-blue-300/70 bg-slate-800 px-1 rounded text-[10px]">[AI-AGENT]</code>.</p>
                    </div>
                </div>

                {/* Right panel (3/4) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Mission identifier banner */}
                    {currentResult ? (
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border shadow-2xl backdrop-blur-sm transition-all gap-4 sm:gap-0 ${isActive ? 'bg-blue-950/30 border-blue-700/40 border-l-4 border-l-blue-500' :
                            currentResult.ci_status === 'PASSED' ? 'bg-emerald-950/20 border-emerald-700/40 border-l-4 border-l-emerald-500' :
                                currentResult.ci_status === 'PARTIAL' ? 'bg-amber-950/20 border-amber-700/40 border-l-4 border-l-amber-500' :
                                    'bg-red-950/20 border-red-700/40 border-l-4 border-l-red-500'
                            }`}>
                            <div className="min-w-0 flex-1 w-full sm:w-auto">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Mission Identifier</p>
                                <p className="text-base sm:text-lg font-black text-slate-100 font-mono text-wrap break-all sm:truncate tracking-tight" title={currentResult.run_id}>
                                    {currentResult.run_id}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate w-full">
                                    Target: <span className="text-slate-400">{currentResult.repo_url}</span>
                                </p>
                            </div>
                            <div className="sm:pl-4 flex-shrink-0 w-full sm:w-auto flex sm:block">
                                <span className={`w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black border uppercase tracking-widest shadow-lg ${currentResult.ci_status === 'PASSED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' :
                                    currentResult.ci_status === 'PARTIAL' ? 'bg-amber-500/10 text-amber-400 border-amber-500/40' :
                                        currentResult.ci_status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/40' :
                                            ['PENDING', 'QUEUED'].includes(currentResult.ci_status) ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 animate-pulse' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/40 animate-pulse'
                                    }`}>
                                    {isActive && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {currentResult.ci_status === 'PASSED' && <CheckCircle2 className="w-3 h-3" />}
                                    {currentResult.ci_status === 'PARTIAL' && <CheckCircle2 className="w-3 h-3 opacity-70" />}
                                    {currentResult.ci_status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        !isLoading && (
                            <div className="h-56 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/60 rounded-2xl bg-slate-900/20 group hover:bg-slate-900/30 transition-all">
                                <div className="bg-slate-800/50 p-6 rounded-full mb-5 border border-slate-700 group-hover:scale-105 transition-transform duration-500">
                                    <Activity className="w-12 h-12 text-slate-600 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <h3 className="text-slate-300 font-black mb-2 text-xl tracking-tight">Intelligence Core Idle</h3>
                                <p className="text-slate-500 text-sm text-center max-w-sm px-8 leading-relaxed">
                                    Enter a GitHub repository URL, team name, and leader name —<br />
                                    then click <span className="text-blue-400 font-bold">Run Healing Agent</span> to begin.
                                </p>
                            </div>
                        )
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Content panels */}
                    {currentResult && (
                        <>
                            <ScorePanel />
                            <FixTable />
                            <Timeline />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
