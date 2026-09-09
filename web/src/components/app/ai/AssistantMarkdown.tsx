import Markdown from 'react-markdown'

export function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="assistant-md text-sm leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:ml-4 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1">
      <Markdown>{content}</Markdown>
    </div>
  )
}
