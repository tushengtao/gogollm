from langchain_core.runnables import Runnable


# 结构化输出：1. 将用户的question输出
class GoGoLLMStructuredOutputParser(Runnable):
    def __init__(self, runnable, question):
        self.runnable = runnable
        self.question = question

    def stream(self, inputs, config, **kwargs):
        output = self.runnable.stream(inputs, config)
        # output["question"] = self.question
        return output

    async def astream(self, inputs, config, **kwargs):
        async for output in self.runnable.astream(inputs, config):
            output_with_history = dict(output)
            # output_with_history["question"] = self.question
            yield output_with_history

    def invoke(self, inputs, config, **kwargs):
        output = self.runnable.invoke(inputs, config)
        # output["question"] = self.question
        return output

    def ainvoke(self, inputs, config, **kwargs):
        output = self.runnable.ainvoke(inputs, config)
        # output["question"] = self.question
        return output
