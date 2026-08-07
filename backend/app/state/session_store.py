from app.state.interview_state import InterviewState


class SessionStore:

    def __init__(self):
        self.sessions: dict[str, InterviewState] = {}

    def create(self, state: InterviewState):
        self.sessions[state.session_id] = state

    def get(self, session_id: str):
        return self.sessions.get(session_id)

    def update(self, state: InterviewState):
        self.sessions[state.session_id] = state

    def delete(self, session_id: str):
        self.sessions.pop(session_id, None)


session_store = SessionStore()