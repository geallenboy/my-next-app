import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/generate-text">Generate Text(生成文本)</Link>
      <Link href="/generate-image">Generate Image(生成图片)</Link>
      <Link href="/stream-text">Stream Text(流文本)</Link>
      <Link href="/stream-image">Stream Image(流文本与图像)</Link>
      <Link href="/chat-pdf">Chat PDF(PDF聊天)</Link>
      <Link href="/markdown-chatbot">Markdown Chatbot(Markdown聊天机器人)</Link>
      <Link href="/generate-object">Generate Object(生成对象)</Link>
      <Link href="/stream-object">Stream Object(流对象)</Link>
      <Link href="/generate-object-form">Generate Object Form(表单生成文件对象)</Link>
      <Link href="/call-tools">Call Tools(调用工具)</Link>
      <Link href="/stream-tools">Call Tools in Parallel(并行调用工具)</Link>
      <Link href="/stream-tools-in-order">Call Tools in Multiple Steps(在多个步骤中调用工具)</Link>
    </div>
  );
}
