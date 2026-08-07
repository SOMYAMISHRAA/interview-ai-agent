import json
from pathlib import Path

from app.models.interview_profile import InterviewProfile


class CandidateService:

    def __init__(self):
        self.data_path = Path("data/candidates.json")

        with open(self.data_path, "r", encoding="utf-8") as file:
            self.data = json.load(file)["candidates"]

    def get_candidate(self, candidate_id: str):

        for candidate in self.data:
            if candidate["member"]["id"] == candidate_id:
                return candidate

        return None

    # ---------- STEP 3 ----------
    def build_interview_profile(self, candidate_id: str):

        candidate = self.get_candidate(candidate_id)

        if candidate is None:
            return None

        member = candidate["member"]
        missions = candidate["missions"]
        signals = candidate["signals"]

        completed_days = []
        skipped_days = []
        failed_days = []

        strong_days = []
        weak_days = []

        for mission in missions:

            if mission.get("passed") is True:
                completed_days.append(mission["day"])

                if mission.get("attempts", 0) == 1:
                    strong_days.append(mission["title"])

                elif mission.get("attempts", 0) >= 4:
                    weak_days.append(mission["title"])

            elif mission.get("passed") is False:
                failed_days.append(mission["day"])
                weak_days.append(mission["title"])

            elif mission.get("skipped"):
                skipped_days.append(mission["day"])
                weak_days.append(mission["title"])

        difficulty = self._calculate_difficulty(
            member["yearsExperience"],
            signals["missionsCompleted"],
            signals["missionsFirstTry"],
        )

        return InterviewProfile(
            candidate_id=member["id"],
            candidate_name=member["name"],
            job_role=member["jobRole"],
            years_experience=member["yearsExperience"],
            education=member["education"],
            completed_days=completed_days,
            skipped_days=skipped_days,
            failed_days=failed_days,
            strong_days=strong_days,
            weak_days=weak_days,
            difficulty=difficulty,
            commit_days=signals["commitDays"],
            missions_completed=signals["missionsCompleted"],
            first_try_success=signals["missionsFirstTry"],
        )

    # ---------- STEP 4 ----------
    def _calculate_difficulty(
        self,
        experience: int,
        completed: int,
        first_try: int,
    ) -> str:

        score = 0

        if experience >= 5:
            score += 2

        if completed >= 28:
            score += 2

        if first_try >= 20:
            score += 2

        if score >= 5:
            return "hard"

        if score >= 3:
            return "medium"

        return "easy"