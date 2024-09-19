from __future__ import annotations

import inspect
from typing import (
    TYPE_CHECKING,
    Any,
    Callable,
    Dict,
    List,
    Optional,
    Sequence,
    Type,
    Union,
)

from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.load.load import load
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.runnables.base import Runnable, RunnableBindingBase, RunnableLambda
from langchain_core.runnables.passthrough import RunnablePassthrough
from langchain_core.runnables.utils import (
    ConfigurableFieldSpec,
    create_model,
    get_unique_config_specs,
)

if TYPE_CHECKING:
    from langchain_core.language_models import LanguageModelLike
    from langchain_core.messages import BaseMessage
    from langchain_core.runnables.config import RunnableConfig
    from langchain_core.tracers.schemas import Run


MessagesOrDictWithMessages = Union[Sequence["BaseMessage"], Dict[str, Any]]
GetSessionHistoryCallable = Callable[..., BaseChatMessageHistory]


class RunnableWithMessageHistory(RunnableBindingBase):
    get_session_history: GetSessionHistoryCallable
    input_messages_key: Optional[str] = None
    output_messages_key: Optional[str] = None
    history_messages_key: Optional[str] = None
    is_react_agent_type: Optional[bool] = False
    history_factory_config: Sequence[ConfigurableFieldSpec]

    @classmethod
    def get_lc_namespace(cls) -> List[str]:
        """Get the namespace of the langchain object."""
        return ["langchain", "schema", "runnable"]

    def __init__(
            self,
            runnable: Union[
                Runnable[
                    Union[MessagesOrDictWithMessages],
                    Union[str, BaseMessage, MessagesOrDictWithMessages],
                ],
                LanguageModelLike,
            ],
            get_session_history: GetSessionHistoryCallable,
            *,
            input_messages_key: Optional[str] = None,
            output_messages_key: Optional[str] = None,
            history_messages_key: Optional[str] = None,
            history_factory_config: Optional[Sequence[ConfigurableFieldSpec]] = None,
            is_react_agent_type: Optional[bool] = False,
            **kwargs: Any,
    ) -> None:
        """Initialize RunnableWithMessageHistory.

        Args:
            runnable: The base Runnable to be wrapped. Must take as input one of:
                1. A sequence of BaseMessages
                2. A dict with one key for all messages
                3. A dict with one key for the current input string/message(s) and
                    a separate key for historical messages. If the input key points
                    to a string, it will be treated as a HumanMessage in history.

                Must return as output one of:
                1. A string which can be treated as an AIMessage
                2. A BaseMessage or sequence of BaseMessages
                3. A dict with a key for a BaseMessage or sequence of BaseMessages

            get_session_history: Function that returns a new BaseChatMessageHistory.
                This function should either take a single positional argument
                `session_id` of type string and return a corresponding
                chat message history instance.
                .. code-block:: python

                    def get_session_history(
                        session_id: str,
                        *,
                        user_id: Optional[str]=None
                    ) -> BaseChatMessageHistory:
                      ...

                Or it should take keyword arguments that match the keys of
                `session_history_config_specs` and return a corresponding
                chat message history instance.

                .. code-block:: python

                    def get_session_history(
                        *,
                        user_id: str,
                        thread_id: str,
                    ) -> BaseChatMessageHistory:
                        ...

            input_messages_key: Must be specified if the base runnable accepts a dict
                as input.
            output_messages_key: Must be specified if the base runnable returns a dict
                as output.
            history_messages_key: Must be specified if the base runnable accepts a dict
                as input and expects a separate key for historical messages.
            history_factory_config: Configure fields that should be passed to the
                chat history factory. See ``ConfigurableFieldSpec`` for more details.
                Specifying these allows you to pass multiple config keys
                into the get_session_history factory.
            **kwargs: Arbitrary additional kwargs to pass to parent class
                ``RunnableBindingBase`` init.
        """
        history_chain: Runnable = RunnableLambda(
            self._enter_history, self._aenter_history
        ).with_config(run_name="load_history")
        messages_key = history_messages_key or input_messages_key
        if messages_key:
            history_chain = RunnablePassthrough.assign(
                **{messages_key: history_chain}
            ).with_config(run_name="insert_history")
        bound = (
                history_chain | runnable.with_listeners(on_end=self._exit_history)
        ).with_config(run_name="RunnableWithMessageHistory")

        if history_factory_config:
            _config_specs = history_factory_config
        else:
            # If not provided, then we'll use the default session_id field
            _config_specs = [
                ConfigurableFieldSpec(
                    id="session_id",
                    annotation=str,
                    name="Session ID",
                    description="Unique identifier for a session.",
                    default="",
                    is_shared=True,
                ),
            ]
        super().__init__(
            get_session_history=get_session_history,
            input_messages_key=input_messages_key,
            output_messages_key=output_messages_key,
            bound=bound,
            history_messages_key=history_messages_key,
            history_factory_config=_config_specs,
            **kwargs,
        )
        self.is_react_agent_type=is_react_agent_type


    @property
    def config_specs(self) -> List[ConfigurableFieldSpec]:
        return get_unique_config_specs(
            super().config_specs + list(self.history_factory_config)
        )

    def get_input_schema(
            self, config: Optional[RunnableConfig] = None
    ) -> Type[BaseModel]:
        super_schema = super().get_input_schema(config)
        if super_schema.__custom_root_type__ or not super_schema.schema().get(
                "properties"
        ):
            from langchain_core.messages import BaseMessage

            fields: Dict = {}
            if self.input_messages_key and self.history_messages_key:
                fields[self.input_messages_key] = (
                    Union[str, BaseMessage, Sequence[BaseMessage]],
                    ...,
                )
            elif self.input_messages_key:
                fields[self.input_messages_key] = (Sequence[BaseMessage], ...)
            else:
                fields["__root__"] = (Sequence[BaseMessage], ...)
            return create_model(  # type: ignore[call-overload]
                "RunnableWithChatHistoryInput",
                **fields,
            )
        else:
            return super_schema

    def _get_input_messages(
            self, input_val: Union[str, BaseMessage, Sequence[BaseMessage], dict]
    ) -> List[BaseMessage]:
        from langchain_core.messages import BaseMessage

        # If dictionary, try to pluck the single key representing messages
        if isinstance(input_val, dict):
            if self.input_messages_key:
                key = self.input_messages_key
            elif len(input_val) == 1:
                key = list(input_val.keys())[0]
            else:
                key = "input"
            input_val = input_val[key]

        # If value is a string, convert to a human message
        if isinstance(input_val, str):
            from langchain_core.messages import HumanMessage

            return [HumanMessage(content=input_val)]
        # If value is a single message, convert to a list
        elif isinstance(input_val, BaseMessage):
            return [input_val]
        # If value is a list or tuple...
        elif isinstance(input_val, (list, tuple)):
            # Handle empty case
            if len(input_val) == 0:
                return list(input_val)
            # If is a list of list, then return the first value
            # This occurs for chat models - since we batch inputs
            if isinstance(input_val[0], list):
                if len(input_val) != 1:
                    raise ValueError()
                return input_val[0]
            return list(input_val)
        else:
            raise ValueError(
                f"Expected str, BaseMessage, List[BaseMessage], or Tuple[BaseMessage]. "
                f"Got {input_val}."
            )

    def _get_output_messages(
            self, output_val: Union[str, BaseMessage, Sequence[BaseMessage], dict]
    ) -> List[BaseMessage]:
        from langchain_core.messages import BaseMessage

        # If dictionary, try to pluck the single key representing messages
        if isinstance(output_val, dict):
            if self.output_messages_key:
                key = self.output_messages_key
            elif len(output_val) == 1:
                key = list(output_val.keys())[0]
            else:
                key = "output"
            # If you are wrapping a chat model directly
            # The output is actually this weird generations object
            if key not in output_val and "generations" in output_val:
                output_val = output_val["generations"][0][0]["message"]
            else:
                #  自定义修改 output_val = output_val[key]
                output_val = output_val.get(key, output_val)

        if isinstance(output_val, str):
            from langchain_core.messages import AIMessage

            return [AIMessage(content=output_val)]
        # If value is a single message, convert to a list
        elif isinstance(output_val, BaseMessage):
            return [output_val]
        elif isinstance(output_val, (list, tuple)):
            return list(output_val)
        else:
            output_val = output_val

    def _enter_history(self, input: Any, config: RunnableConfig) -> List[BaseMessage]:
        hist: BaseChatMessageHistory = config["configurable"]["message_history"]
        messages = hist.messages.copy()

        if not self.history_messages_key:
            # return all messages
            input_val = (
                input if not self.input_messages_key else input[self.input_messages_key]
            )
            messages += self._get_input_messages(input_val)
        return messages

    async def _aenter_history(
            self, input: Dict[str, Any], config: RunnableConfig
    ) -> List[BaseMessage]:
        hist: BaseChatMessageHistory = config["configurable"]["message_history"]
        if self.is_react_agent_type:
            messages = hist.get_messages()
        else:
            messages = hist.get_messages().copy()

        if not self.history_messages_key:
            # return all messages
            input_val = (
                input if not self.input_messages_key else input[self.input_messages_key]
            )
            messages += self._get_input_messages(input_val)

        return messages

    def _exit_history(self, run: Run, config: RunnableConfig) -> None:
        hist: BaseChatMessageHistory = config["configurable"]["message_history"]

        # Get the input messages
        inputs = load(run.inputs)
        input_messages = self._get_input_messages(inputs)
        # If historic messages were prepended to the input messages, remove them to
        # avoid adding duplicate messages to history.
        if not self.history_messages_key:
            historic_messages = config["configurable"]["message_history"].messages
            input_messages = input_messages[len(historic_messages) :]

        # Get the output messages
        output_val = load(run.outputs)
        output_messages = self._get_output_messages(output_val)
        if output_messages is not None:
            hist.add_messages(input_messages + output_messages)

    def _merge_configs(self, *configs: Optional[RunnableConfig]) -> RunnableConfig:
        config = super()._merge_configs(*configs)
        expected_keys = [field_spec.id for field_spec in self.history_factory_config]

        configurable = config.get("configurable", {})

        missing_keys = set(expected_keys) - set(configurable.keys())

        if missing_keys:
            example_input = {self.input_messages_key: "foo"}
            example_configurable = {
                missing_key: "[your-value-here]" for missing_key in missing_keys
            }
            example_config = {"configurable": example_configurable}
            raise ValueError(
                f"Missing keys {sorted(missing_keys)} in config['configurable'] "
                f"Expected keys are {sorted(expected_keys)}."
                f"When using via .invoke() or .stream(), pass in a config; "
                f"e.g., chain.invoke({example_input}, {example_config})"
            )

        parameter_names = _get_parameter_names(self.get_session_history)

        if len(expected_keys) == 1:
            # If arity = 1, then invoke function by positional arguments
            message_history = self.get_session_history(configurable[expected_keys[0]])
        else:
            # otherwise verify that names of keys patch and invoke by named arguments
            if set(expected_keys) != set(parameter_names):
                raise ValueError(
                    f"Expected keys {sorted(expected_keys)} do not match parameter "
                    f"names {sorted(parameter_names)} of get_session_history."
                )

            message_history = self.get_session_history(
                **{key: configurable[key] for key in expected_keys}
            )
        config["configurable"]["message_history"] = message_history
        return config


def _get_parameter_names(callable_: GetSessionHistoryCallable) -> List[str]:
    """Get the parameter names of the callable."""
    sig = inspect.signature(callable_)
    return list(sig.parameters.keys())
