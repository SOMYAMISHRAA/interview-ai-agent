from pydantic import BaseModel


class CurriculumDay(BaseModel):
    day: int
    title: str
    type: str
    tools: list[str]
    objectives: list[str]
    