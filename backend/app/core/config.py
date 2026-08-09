from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Interview AI Agent"
    PROJECT_VERSION: str = "1.0.0"

    OPENROUTER_API_KEY: str

    DATABASE_URL: str = "sqlite:///./interview_agent.db"

    MODEL_NAME: str = "openrouter/free"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()