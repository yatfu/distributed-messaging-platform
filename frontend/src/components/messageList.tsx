import type { Message } from '../lib/types';

type MessageListProps = {
  messages: Message[];
}
export default function MessageList({ messages }: MessageListProps) {
  return (
    <div id="message-list" key={messages[0].id}>
      <div className="message">
        <p className="message-time"> Sept. 09 2026 8:13 P.M.</p>
        <p className="message-name"> Keanu</p>
        <p className="message-text">Hi!</p>
      </div>
      <div className="message">
        <p className="message-time"> Sept. 09 2026 8:15 P.M.</p>
        <p className="message-name"> Hannah</p>
        <p className="message-content">Hi :D</p>
      </div>
    </div>
  );
}