from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Interview AI Agent"
    PROJECT_VERSION: str = "1.0.0"

    OPENAI_API_KEY: str

    DATABASE_URL: str = "sqlite:///./interview_agent.db"

    MODEL_NAME: str = "gpt-5.5"

    class Config:
        env_file = ".env"


settings = Settings()