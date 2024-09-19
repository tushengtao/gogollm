from sqlalchemy import String, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column
from backend.common.msd.model import Base, id_key


class ChatHistory(Base):
    """聊天历史表"""

    __tablename__ = 'ggl_chat_history'

    id: Mapped[id_key] = mapped_column(init=False)
    session_id: Mapped[str] = mapped_column(String(64), nullable=False, comment='会话ID')
    app_id: Mapped[int] = mapped_column(Integer, nullable=False, comment='应用ID')
    user_id: Mapped[str] = mapped_column(String(50), nullable=False, comment='用户ID')
    message: Mapped[dict] = mapped_column(JSON, nullable=False, comment='消息内容')
