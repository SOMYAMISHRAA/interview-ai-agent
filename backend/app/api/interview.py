from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.orchestrator.interview_orchestrator import InterviewOrchestrator


router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)

orchestrator = InterviewOrchestrator()


class StartInterviewRequest(BaseModel):
    candidateId: str


class SubmitAnswerRequest(BaseModel):
    sessionId: str
    answer: str


@router.post("/start")
def start_interview(request: StartInterviewRequest):

    try:
        return orchestrator.start_interview(
            candidate_id=request.candidateId
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/answer")
def submit_answer(request: SubmitAnswerRequest):

    try:
        return orchestrator.submit_answer(
            session_id=request.sessionId,
            answer=request.answer,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get("/{session_id}/feedback")
def get_feedback(session_id: str):

    state = orchestrator.session_store.get(session_id)

    if state is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    if not state.interview_complete:
        raise HTTPException(
            status_code=400,
            detail="Interview is not complete yet.",
        )

    return {
        "sessionId": session_id,
        "feedback": state.final_feedback,
    }