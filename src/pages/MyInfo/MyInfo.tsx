import { useState } from 'react';
import { Icon, Button, TextInput, Tabs } from '../../components';
import { currentEmployee } from '../../data/currentEmployee';

const profileTabs = [
  { id: 'personal', label: 'Personal' },
  { id: 'job', label: 'Job' },
  { id: 'time-off', label: 'Time off' },
  { id: 'documents', label: 'Documents' },
  { id: 'timesheets', label: 'Timesheets' },
  { id: 'performance', label: 'Performance' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'training', label: 'Training' },
  { id: 'more', label: 'More' },
];

export function MyInfo() {
  const [activeTab, setActiveTab] = useState('personal');
  const employee = currentEmployee;

  return (
    <div className="min-h-full">
      {/* Profile Header - Green Banner */}
      <div
        className="relative px-10 pt-8 pb-0 bg-[var(--color-primary-strong)]"
        style={{ borderRadius: '0 0 var(--radius-small) var(--radius-small)' }}
      >
        <div className="flex items-start gap-8">
          {/* Avatar */}
          <img
            src={employee.avatar}
            alt={`${employee.preferredName} ${employee.lastName}`}
            className="w-[128px] h-[128px] rounded-[var(--radius-small)] object-cover shrink-0"
            style={{ boxShadow: 'var(--shadow-300)' }}
          />

          {/* Name and Title */}
          <div className="flex-1 pt-2">
            <h1
              className="text-[40px] leading-[48px] font-bold mb-1"
              style={{ fontFamily: 'Fields, system-ui, sans-serif', color: 'white' }}
            >
              {employee.preferredName} ({employee.firstName}) {employee.lastName}
            </h1>
            <p className="text-white/90 text-[15px] leading-[22px]">
              {employee.pronouns} · {employee.title}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              className="inline-flex items-center gap-2 h-10 px-5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-[var(--radius-full)] text-white text-[15px] font-semibold transition-colors"
            >
              Request a change
              <Icon name="caret-down" size={10} className="text-white" />
            </button>
            <button
              className="inline-flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 border border-white/30 rounded-[var(--radius-full)] text-white transition-colors"
            >
              <Icon name="ellipsis" size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabs - positioned at bottom of header */}
        <div className="mt-6 -mb-px">
          <Tabs
            tabs={profileTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="inverted"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-8 p-10 pt-8">
        {/* Left Sidebar - Vitals */}
        <aside className="w-[200px] shrink-0">
          {/* Vitals Section */}
          <div className="mb-8">
            <h3 className="text-[13px] font-semibold text-[var(--text-neutral-medium)] uppercase tracking-wide mb-4">
              Vitals
            </h3>
            <div className="flex flex-col gap-2">
              <VitalItem icon="building" text={employee.workPhone} />
              <VitalItem icon="mobile" text={employee.mobilePhone} />
              <VitalItem icon="envelope" text={employee.workEmail} />
              <VitalItem icon="linkedin" text={employee.linkedIn} />
              <VitalItem icon="clock" text={employee.localTime} />
              <div className="flex items-center gap-2 text-[13px] text-[var(--text-neutral-medium)] pl-5">
                {employee.location}
              </div>
              <VitalItem icon="wrench" text={employee.department} />
              <div className="flex items-center gap-2 text-[13px] text-[var(--text-neutral-medium)] pl-5">
                Full-time
              </div>
            </div>
          </div>

          {/* Hire Date Section */}
          <div className="mb-8">
            <h3 className="text-[13px] font-semibold text-[var(--text-neutral-medium)] uppercase tracking-wide mb-4">
              Hire Date
            </h3>
            <div className="flex flex-col gap-1">
              <VitalItem icon="calendar" text={employee.hireDate} />
              <div className="text-[13px] text-[var(--text-neutral-weak)] pl-5">
                {employee.tenure}
              </div>
            </div>
          </div>

          {/* Manager Section */}
          <div className="mb-8">
            <h3 className="text-[13px] font-semibold text-[var(--text-neutral-medium)] uppercase tracking-wide mb-4">
              Manager
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={employee.manager.avatar}
                alt={employee.manager.name}
                className="w-10 h-10 rounded-[var(--radius-xx-small)] object-cover"
                style={{ boxShadow: 'var(--shadow-100)' }}
              />
              <div>
                <p className="text-[13px] font-medium text-[var(--text-neutral-strong)]">
                  {employee.manager.name}
                </p>
                <p className="text-[13px] text-[var(--text-neutral-medium)]">
                  {employee.manager.title}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Reports Section */}
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-neutral-medium)] uppercase tracking-wide mb-4">
              Direct Reports
            </h3>
            <div className="flex flex-col gap-2">
              {employee.directReports.map((name) => (
                <VitalItem key={name} icon="circle-user" text={name} />
              ))}
              {employee.moreReportsCount > 0 && (
                <VitalItem icon="circle-user" text={`${employee.moreReportsCount} more...`} />
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Icon name="address-card" size={24} className="text-[var(--color-primary-strong)]" />
              <h2
                className="text-[26px] font-semibold text-[var(--color-primary-strong)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '34px' }}
              >
                Personal
              </h2>
            </div>
            <Button variant="standard" size="small">
              Edit fields
            </Button>
          </div>

          {/* Basic Information Card */}
          <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] p-6 mb-8">
            <h3
              className="text-[22px] font-semibold text-[var(--color-primary-strong)] mb-6"
              style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
            >
              Basic information
            </h3>

            {/* Name Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <TextInput label="Name" value={employee.firstName} />
              <TextInput label="Middle name" value={employee.middleName} placeholder="" />
              <TextInput label="Last name" value={employee.lastName} />
              <TextInput label="Preferred name" value={employee.preferredName} />
            </div>

            {/* Birth Date Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <TextInput label="Birth date" value={employee.birthDate} type="date" />
            </div>

            {/* SSN Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <TextInput label="SSN" value={employee.ssn} />
            </div>

            {/* Gender Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <TextInput label="Gender" value={employee.gender} type="dropdown" />
              <TextInput label="Gender identity" value={employee.genderIdentity} type="dropdown" />
              <TextInput label="Pronouns" value={employee.pronouns} type="dropdown" />
            </div>

            {/* Marital Status Row */}
            <div className="grid grid-cols-4 gap-4">
              <TextInput label="Marital status" value={employee.maritalStatus} type="dropdown" />
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-8">
            <h3
              className="text-[22px] font-semibold text-[var(--color-primary-strong)] mb-6"
              style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
            >
              Contact
            </h3>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <TextInput label="Phone" value={employee.mobilePhone} />
                <TextInput value="Work" className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <TextInput label="Input label" value="Mobile" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-2">
                <TextInput label="Email" value={employee.personalEmail} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-2">
                <TextInput label="Input label" value={employee.workEmail} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <TextInput label="T-shirt size" value={employee.tshirtSize} type="dropdown" />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <TextInput label="Favorite cold cereal" value={employee.favoriteCereal} type="dropdown" />
            </div>
          </div>

          {/* Passport Table Section */}
          <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <h3
                className="text-[22px] font-semibold text-[var(--color-primary-strong)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
              >
                Contact
              </h3>
              <Button variant="standard" size="small">
                Add entry
              </Button>
            </div>

            {/* Table */}
            <div className="px-6 pb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--surface-neutral-xx-weak)]">
                    <th className="px-4 py-4 text-left text-[15px] font-semibold text-[var(--text-neutral-x-strong)] rounded-tl-[8px] rounded-bl-[8px]">
                      Passport number
                    </th>
                    <th className="px-4 py-4 text-left text-[15px] font-semibold text-[var(--text-neutral-x-strong)]">
                      Issued date
                    </th>
                    <th className="px-4 py-4 text-left text-[15px] font-semibold text-[var(--text-neutral-x-strong)]">
                      Expiry date
                    </th>
                    <th className="px-4 py-4 text-left text-[15px] font-semibold text-[var(--text-neutral-x-strong)] rounded-tr-[8px] rounded-br-[8px]">
                      Issuing country
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-neutral-x-weak)]">
                  {employee.passports.map((passport, index) => (
                    <tr key={index} className="hover:bg-[var(--surface-neutral-xx-weak)] transition-colors">
                      <td className="px-4 py-4 text-[15px] text-[var(--text-neutral-x-strong)]">
                        {passport.number}
                      </td>
                      <td className="px-4 py-4 text-[15px] text-[var(--text-neutral-x-strong)]">
                        {passport.issued}
                      </td>
                      <td className="px-4 py-4 text-[15px] text-[var(--text-neutral-x-strong)]">
                        {passport.expiry}
                      </td>
                      <td className="px-4 py-4 text-[15px] text-[var(--text-neutral-x-strong)]">
                        {passport.country}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper component for vital items
function VitalItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={icon as any} size={12} className="text-[var(--icon-neutral-strong)]" />
      <span className="text-[13px] text-[var(--text-neutral-medium)]">{text}</span>
    </div>
  );
}

export default MyInfo;
