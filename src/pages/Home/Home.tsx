import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Icon, TextHeadline, Gridlet } from '../../components';
import avatarLarge from '../../assets/images/avatar-large.png';

// Mock user data
const user = {
  name: 'Jess',
  title: 'Director, Demand Generation',
  department: 'Marketing',
  avatar: avatarLarge,
};


export function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
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

      {/* Account Setup Banner */}
      <section
        className="
          mb-5
          flex
          items-stretch
          justify-between
          gap-6
          rounded-[var(--radius-small)]
          border border-[var(--border-neutral-x-weak)]
          bg-[var(--surface-neutral-white)]
          p-4
        "
        style={{ boxShadow: 'var(--shadow-300)' }}
      >
        <div className="flex min-h-[154px] flex-1 flex-col justify-between px-4 py-5">
          <div className="flex flex-col gap-2">
            <h2
              className="text-[45px] font-semibold leading-[48px] text-[var(--color-primary-strong)]"
              style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
            >
              Let&apos;s continue setting up your account
            </h2>
            <p className="text-[20px] leading-[24px] text-[var(--text-neutral-medium)]">
              You&apos;re making great progress!
            </p>
          </div>
          <div className="pt-4">
            <Button
              variant="primary"
              size="medium"
              className="h-12 px-8 text-[18px] leading-[26px]"
              onClick={() => navigate('/setup-account')}
            >
              Continue Setup
            </Button>
          </div>
        </div>

        <div
          className="
            flex
            w-[430px]
            items-center
            justify-between
            rounded-[var(--radius-xx-small)]
            bg-[var(--surface-neutral-xx-weak)]
            px-7
            py-6
          "
        >
          <div className="flex flex-col gap-1">
            <span className="text-[15px] leading-[22px] text-[var(--text-neutral-medium)]">
              Currently setting up
            </span>
            <span
              className="text-[40px] font-semibold leading-[48px] text-[var(--text-neutral-x-strong)]"
              style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
            >
              Employee Data
            </span>
          </div>
          <div className="relative h-[116px] w-[116px] shrink-0">
            <div className="absolute inset-1 rounded-full bg-[var(--border-neutral-x-weak)]/60" />
            <div className="absolute inset-4 rounded-[var(--radius-xx-small)] border-[4px] border-[#69bdd2] bg-[#9fe8ff]" />
            <div className="absolute left-0 top-[15px] rounded-[10px] border-[4px] border-[#676260] bg-[#e6f8ff] px-3 py-2">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#69bdd2]">
                  <Icon name="circle-user" size={20} className="text-[#4f4a47]" />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <span className="h-[4px] w-7 rounded-full bg-[#676260]" />
                  <span className="h-[4px] w-6 rounded-full bg-[#676260]" />
                  <span className="h-[4px] w-5 rounded-full bg-[#676260]" />
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <span className="h-[4px] w-9 rounded-full bg-[#676260]" />
                <span className="h-[4px] w-6 rounded-full bg-[#676260]" />
              </div>
            </div>
          </div>
        </div>
      </section>

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
        <Gridlet title="Gender breakdown" minHeight={332} />
      </div>
    </div>
  );
}

export default Home;
