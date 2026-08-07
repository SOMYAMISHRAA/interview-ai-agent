import json
from pathlib import Path


class CurriculumRetriever:

    def __init__(self):
        self.data_path = Path("data/curriculum.json")

        with open(self.data_path, "r", encoding="utf-8") as file:
            self.curriculum = json.load(file)

        self.days = self.curriculum["days"]

    def get_day(self, day: int):

        for item in self.days:

            if item["day"] == day:
                return item

        return None

    def get_multiple_days(self, days: list[int]):

        results = []

        for day in days:

            lesson = self.get_day(day)

            if lesson:
                results.append(lesson)

        return results

    def get_context(self, days: list[int]):

        context = []

        lessons = self.get_multiple_days(days)

        for lesson in lessons:

            context.append(
                {
                    "day": lesson["day"],
                    "title": lesson["title"],
                    "type": lesson["type"],
                    "tools": lesson["tools"],
                    "objectives": lesson["objectives"],
                }
            )

        return context