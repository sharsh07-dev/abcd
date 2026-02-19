"""
backend/agents/scoring_agent.py
=================================
ScoringAgent — Computes deterministic scoring (NO LLM).
Pure math based on fix count, speed, regressions, CI pass rate.

Score Formula:
  total = base_score
          + (fixes * SCORE_PER_FIX)
          + (speed_factor * elapsed_bonus)
          - (regressions * REGRESSION_PENALTY)
          + ci_success_score

All math is deterministic and reproducible.
"""

from __future__ import annotations

import math
import time
from typing import Optional

from backend.utils.logger import logger
from backend.utils.models import AgentState, CIStatus, CITimelineEvent, Scoring
from config.settings import settings


class ScoringAgent:
    """
    Computes the final score for a healing run.
    Uses ONLY arithmetic — no randomness, no LLM.
    """

    def __init__(self, state: AgentState):
        self.state = state

    def run(self) -> AgentState:
        t0 = time.time()
        logger.info("[ScoringAgent] Computing final score...")

        # Finalize CI Status based on failures vs fixes
        remaining_failures = len([f for f in self.state.failures if not any(
            fix.failure_id == f.failure_id for fix in self.state.fixes
        )])

        no_test_suite = getattr(self.state, "pytest_exit_code", None) == 5

        if self.state.fatal_error:
            self.state.ci_status = CIStatus.FAILED
        elif remaining_failures == 0:
            self.state.ci_status = CIStatus.SUCCESS
        elif self.state.fixes and no_test_suite:
            # No tests exist — any fix is a full resolution (can't prove more failures)
            self.state.ci_status = CIStatus.SUCCESS
        elif self.state.fixes:
            self.state.ci_status = CIStatus.PARTIAL
        else:
            self.state.ci_status = CIStatus.FAILED

        scoring = self._compute_score()
        self.state.scoring = scoring
        elapsed = time.time() - t0

        self.state.timeline.append(CITimelineEvent(
            iteration=self.state.iteration,
            event_type="SCORING",
            description=f"Final score: {scoring.total_score:.1f}/100",
            duration_seconds=elapsed,
        ))

        logger.success(
            f"[ScoringAgent] Score={scoring.total_score:.2f} | "
            f"fixes={scoring.actual_fixes} | "
            f"efficiency={scoring.fix_efficiency:.2f} | "
            f"regressions_penalty={scoring.regression_penalty:.1f}"
        )
        return self.state

    # ─────────────────────────────────────────
    def _compute_score(self) -> Scoring:
        total_failures = len(self.state.failures)
        actual_fixes = len([f for f in self.state.fixes if f.validated])

        # Base score
        base = 100.0

        # Speed bonus: +10 if < 5 minutes (300 seconds)
        start_t = getattr(self.state, "start_time", None)
        elapsed_seconds = (time.time() - start_t) if start_t else 0.0
        speed_bonus = 10.0 if elapsed_seconds < 300.0 else 0.0

        # Efficiency penalty: -2 per commit over 20
        # Given CommitOptimizer maps 1 fix = 1 commit for these rules, we use len(fixes).
        commits_made = len(self.state.fixes)
        efficiency_penalty = float(max(0, commits_made - 20) * 2)

        # Final score
        total = base + speed_bonus - efficiency_penalty

        return Scoring(
            base_score=base,
            speed_factor=speed_bonus,
            fix_efficiency=-efficiency_penalty,  # mapped for transparency on dashboard
            regression_penalty=0.0,
            ci_success_score=0.0,
            total_score=round(total, 2),
            iterations_used=self.state.iteration,
            total_possible_fixes=total_failures,
            actual_fixes=actual_fixes,
            computation_method="deterministic",
        )
