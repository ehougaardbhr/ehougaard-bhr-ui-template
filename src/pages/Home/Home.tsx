import { Avatar, Button, TextHeadline, Gridlet, AutomationsCard, AttentionCard } from '../../components';
import { OrgChartAIInput } from '../../components/OrgChartAIInput';
import { useChat } from '../../contexts/ChatContext';
import { useChatSend } from '../../hooks/useChatSend';
import avatarLarge from '../../assets/images/avatar-large.png';

// Mock user data
const user = {
  name: 'Jess',
  title: 'Director, Demand Generation',
  department: 'Marketing',
  avatar: avatarLarge,
};

export function Home() {
  const { createNewChat, selectConversation, selectedConversation, addMessage } = useChat();
  const { sendMessage } = useChatSend();

  // Pre-built demo conversations mapped by suggestion label
  const demoConversations: Record<string, string> = {
    'Who on my team is a flight risk?': '20',
  };

  const handleSubmit = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    // Check if this matches a pre-built demo conversation
    const demoConvoId = demoConversations[inputValue];
    if (demoConvoId) {
      selectConversation(demoConvoId);
      localStorage.setItem('bhr-chat-panel-open', 'true');
      localStorage.setItem('bhr-chat-expanded', 'true');
      localStorage.setItem('bhr-selected-conversation', demoConvoId);
      return;
    }

    // Create new conversation, select it, open chat, and send message
    const newConversation = createNewChat();
    selectConversation(newConversation.id);
    localStorage.setItem('bhr-chat-panel-open', 'true');
    localStorage.setItem('bhr-chat-expanded', 'false');
    localStorage.setItem('bhr-selected-conversation', newConversation.id);

    // Pass conversation ID directly to avoid timing issues with context state
    await sendMessage(inputValue, newConversation.id);
  };

  return (
    <div className="p-10 relative min-h-full">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-8">
          <Avatar src={user.avatar} size="large" />
          <div className="flex flex-col">
            <TextHeadline size="x-large" color="primary">
              {`Hi, ${user.name}`}
            </TextHeadline>
            <p
              className="font-medium text-[15px] leading-[22px] text-[var(--text-neutral-medium)]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {user.title} in {user.department}
            </p>
          </div>
        </div>
        <Button icon="pen-to-square" variant="standard">
          Edit
        </Button>
      </div>

      {/* AI Input — centered under profile */}
      <div className="max-w-3xl mx-auto mb-8">
        <OrgChartAIInput
          placeholder="Ask me anything..."
          suggestions={[
            { label: 'Who on my team is a flight risk?' },
            { label: 'Prep for my 1:1 with Marcus' },
            { label: 'Summarize open headcount' },
          ]}
          onSubmit={handleSubmit}
          onSuggestionClick={(suggestion) => handleSubmit(suggestion.label)}
        />
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <AutomationsCard />
        <AttentionCard />
      </div>

      {/* Gridlet Dashboard */}
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
          gridTemplateRows: 'auto',
        }}
      >
        {/* Row 1 */}
        <Gridlet title="Timesheet" minHeight={302} />
        <Gridlet
          title="What's happening at BambooHR"
          className="col-span-2 row-span-2"
          minHeight={684}
        />

        {/* Row 2 */}
        <Gridlet title="Time off" minHeight={350} />

        {/* Row 3 */}
        <Gridlet title="Welcome to BambooHR" minHeight={332} />
        <Gridlet title="Celebrations" minHeight={332} />
        <Gridlet title="Who's out" minHeight={332} />

        {/* Row 4 */}
        <Gridlet title="Starting soon" minHeight={332} />
        <Gridlet title="Company links" minHeight={332} />
      </div>
    </div>
  );
}

export default Home;
