from __future__ import annotations
import logging
from typing import List, Optional, Sequence
from sqlalchemy import select, delete, exists
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage, message_to_dict, messages_from_dict
from backend.app.ggl.model.ggl_chat_history import ChatHistory
from backend.app.ggl.model.ggl_chat_session import ChatSession
from backend.app.ggl.util import id_util

logger = logging.getLogger(__name__)


class PostgresChatMessageHistory(BaseChatMessageHistory):
    def __init__(
            self,
            session_id: str,
            app_id: int,
            user_id: str,
            question: str,
            msg_history_count: int = 0,
            sync_session: Optional[Session] = None,
            async_session: Optional[AsyncSession] = None,
            save_current_conversation: bool = True,
            only_carry_human_history_msg: bool = False,
            is_react_agent_type: bool = False
    ) -> None:
        if not sync_session and not async_session:
            raise ValueError("Must provide sync_session or async_session")

        self._sync_session = sync_session
        self._async_session = async_session
        self._session_id = session_id
        self._app_id = app_id
        self._user_id = user_id
        self._question = question
        self.msg_history_count = msg_history_count
        self.save_current_conversation = save_current_conversation
        self.only_carry_human_history_msg = only_carry_human_history_msg
        self.is_react_agent_type = is_react_agent_type

    def session_exists(self) -> bool:
        stmt = exists(ChatSession).where(ChatSession.session_id == self._session_id).select()
        result = self._sync_session.execute(stmt)
        return result.scalar()

    def add_messages(self, messages: Sequence[BaseMessage]) -> None:
        if self._sync_session is None:
            raise ValueError(
                "Please initialize the PostgresChatMessageHistory "
                "with a sync session or use the aadd_messages method instead."
            )

        with self._sync_session.begin():
            exit = self.session_exists()
            if not exit:
                self._sync_session.add(
                    ChatSession(
                        session_id=self._session_id,
                        app_id=self._app_id,
                        user_id=self._user_id,
                        session_name=self._question[:50]
                    )
                )
            if self.save_current_conversation:
                for message in messages:
                    message.additional_kwargs["id"] = id_util.generate_msg_id()
                    if message.type == "human":
                        message.content = self._question
                    self._sync_session.add(
                        ChatHistory(
                            session_id=self._session_id,
                            app_id=self._app_id,
                            user_id=self._user_id,
                            message=message_to_dict(message)
                        )
                    )

    async def aadd_messages(self, messages: Sequence[BaseMessage]) -> None:
        if self._async_session is None:
            raise ValueError(
                "Please initialize the PostgresChatMessageHistory "
                "with an async session or use the sync add_messages method instead."
            )

        async with self._async_session.begin():
            for message in messages:
                self._async_session.add(
                    ChatHistory(
                        session_id=self._session_id,
                        app_id=self._app_id,
                        user_id=self._user_id,
                        message=message_to_dict(message)
                    )
                )

    def get_messages(self) -> List[BaseMessage]:
        if self._sync_session is None:
            raise ValueError(
                "Please initialize the PostgresChatMessageHistory "
                "with a sync session or use the async aget_messages method instead."
            )
        messages = []
        if self.msg_history_count > 0:
            with self._sync_session.begin():
                result = self._sync_session.execute(
                    select(ChatHistory.message).where(
                        ChatHistory.session_id == self._session_id,
                        ChatHistory.app_id == self._app_id,
                        ChatHistory.user_id == self._user_id
                    ).order_by(ChatHistory.id)
                )
                items = [record[0] for record in result.fetchall()]

            messages = messages_from_dict(items)
            messages = messages[-self.msg_history_count * 2:] if self.msg_history_count > 0 else []

        if len(messages) > 0 and self.only_carry_human_history_msg:
            messages = [message for message in messages if message.type == "human"]
        #   react agent的历史记录是携带在提示词里，因此需要特殊处理
        react_agent_chat_history = ""
        if self.is_react_agent_type:
            for message in messages:
                react_agent_chat_history += f"\n{message.type}: {message.content}\n"
            messages = react_agent_chat_history
        return messages

    async def aget_messages(self) -> List[BaseMessage]:
        if self._async_session is None:
            raise ValueError(
                "Please initialize the PostgresChatMessageHistory "
                "with an async session or use the sync get_messages method instead."
            )

        messages = []
        if self.msg_history_count > 0:
            async with self._async_session.begin():
                result = await self._async_session.execute(
                    select(ChatHistory.message).where(
                        ChatHistory.session_id == self._session_id,
                        ChatHistory.app_id == self._app_id,
                        ChatHistory.user_id == self._user_id
                    ).order_by(ChatHistory.id)
                )
                items = [record[0] for record in result.fetchall()]
                messages = messages_from_dict(items)
                messages = messages[-self.msg_history_count * 2:] if self.msg_history_count > 0 else []

        if len(messages) > 0 and self.only_carry_human_history_msg:
            messages = [message for message in messages if message.type == "human"]
        return messages

    @property  # type: ignore[override]
    def messages(self) -> List[BaseMessage]:
        return self.get_messages()

    def clear(self) -> None:
        if self._sync_session is None:
            raise ValueError(
                "Please initialize the PostgresChatMessageHistory "
                "with a sync session or use the async clear method instead."
            )

        with self._sync_session.begin():
            self._sync_session.execute(
                delete(ChatHistory).where(
                    ChatHistory.session_id == self._session_id
                )
            )

    async def aclear(self) -> None:
        if self._async_session is None:
            raise ValueError(
                "Please initialize the PostgresChatMessageHistory "
                "with an async session or use the sync clear method instead."
            )

        async with self._async_session.begin():
            await self._async_session.execute(
                delete(ChatHistory).where(
                    ChatHistory.session_id == self._session_id
                )
            )
