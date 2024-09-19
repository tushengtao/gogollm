from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from backend.common.msd.model import Base, id_key


class ChatSession(Base):
    """聊天会话表"""

    __tablename__ = 'ggl_chat_session'

    id: Mapped[id_key] = mapped_column(init=False)
    session_id: Mapped[str] = mapped_column(String(50), nullable=False, comment='会话ID')
    app_id: Mapped[int] = mapped_column(Integer, nullable=False, comment='应用ID')
    user_id: Mapped[str] = mapped_column(String(50), nullable=False, comment='用户 uuid')
    session_name: Mapped[str] = mapped_column(String(200), default='', comment='会话name')
    del_flag: Mapped[bool] = mapped_column(default=False, comment='删除标志')


