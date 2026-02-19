import { useState } from 'react';
import { Button, Icon } from '../../components';
import {
  settingsNavItems,
  accountSubTabs,
  accountInfo,
  subscription,
  addOns,
  jobPostings,
  fileStorage,
  upgrades,
  dataCenter,
  timeOffSidebarSections,
  timeOffCategoryCards,
  timeTrackingSidebarItems,
  timeTrackingGroups,
  timeTrackingEmployees,
} from '../../data/settingsData';

export function Settings() {
  const [activeNav, setActiveNav] = useState('time-tracking');
  const [activeSubTab, setActiveSubTab] = useState('account-info');
  const [activeTimeOffSection, setActiveTimeOffSection] = useState('overview');
  const [activeTimeTrackingTab, setActiveTimeTrackingTab] = useState('employees');
  const [activeTimeTrackingGroup, setActiveTimeTrackingGroup] = useState('default');

  const selectedTimeOffSection =
    timeOffSidebarSections.find((section) => section.id === activeTimeOffSection) ?? timeOffSidebarSections[0];

  return (
    <div className="min-h-full">
      <h1
        className="text-[44px] font-bold text-[var(--color-primary-strong)] px-8 pt-8 pb-6"
        style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '52px' }}
      >
        Settings
      </h1>

      <div className="flex min-h-full">
        <div className="w-[280px] pl-8 pr-6 pb-8 overflow-y-auto flex-shrink-0">
          <nav className="space-y-1">
            {settingsNavItems.map((item) => {
              const isActive = item.id === activeNav;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`
                    group flex items-center gap-3 px-4 py-3 w-full rounded-[var(--radius-small)]
                    text-[15px] font-medium transition-colors text-left
                    ${
                      isActive
                        ? 'bg-[var(--surface-neutral-white)] text-[var(--color-primary-strong)] border border-[var(--border-neutral-x-weak)]'
                        : 'text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-white)] hover:text-[var(--color-primary-strong)]'
                    }
                  `}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    className={isActive ? 'text-[var(--color-primary-strong)]' : 'text-[var(--icon-neutral-strong)] group-hover:text-[var(--color-primary-strong)]'}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 px-10 pt-0 pb-10 overflow-y-auto">
          {activeNav === 'time-off' ? (
            <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] p-8">
              <h2
                className="text-[36px] font-bold text-[var(--color-primary-strong)] mb-6 pb-6 border-b border-[var(--border-neutral-x-weak)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '40px' }}
              >
                Time Off
              </h2>

              <div className="flex flex-col xl:flex-row gap-6">
                <aside className="w-full xl:w-[290px] shrink-0">
                  <nav>
                    {timeOffSidebarSections.map((section) => {
                      const isActive = section.id === activeTimeOffSection;

                      return (
                        <div key={section.id} className="pb-4 mb-4 border-b border-[var(--border-neutral-x-weak)] last:border-0 last:mb-0 last:pb-0">
                          <button
                            onClick={() => setActiveTimeOffSection(section.id)}
                            className={`
                              w-full text-left flex items-center gap-2 px-3 py-2 rounded-[var(--radius-xx-small)]
                              text-[15px] font-semibold transition-colors
                              ${
                                isActive
                                  ? 'bg-[var(--surface-neutral-xx-weak)] text-[var(--color-primary-strong)]'
                                  : 'text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)]'
                              }
                            `}
                          >
                            <Icon name={section.icon} size={13} className={isActive ? 'text-[var(--color-primary-strong)]' : 'text-[var(--icon-neutral-strong)]'} />
                            <span>{section.label}</span>
                          </button>

                          {section.policies && (
                            <div className="mt-2 space-y-2 px-3">
                              {section.policies.map((policy) => (
                                <p key={policy} className="text-[14px] leading-[20px] text-[var(--text-neutral-medium)]">
                                  {policy}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </aside>

                <section className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-[34px] font-bold text-[var(--color-primary-strong)]"
                      style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '38px' }}
                    >
                      {selectedTimeOffSection.label}
                    </h3>

                    <button className="h-9 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] flex items-center gap-2">
                      <Icon name="gear" variant="regular" size={14} />
                      <Icon name="caret-down" size={10} />
                    </button>
                  </div>

                  <div className="mb-5">
                    <Button
                      variant="outlined"
                      size="small"
                      icon="circle-plus-lined"
                      className="!h-8 !px-3 !text-[13px]"
                    >
                      New Policy
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {timeOffCategoryCards.map((category) => (
                      <div
                        key={category.id}
                        className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4 min-h-[174px] flex flex-col"
                      >
                        <div className="w-11 h-11 rounded-[var(--radius-x-small)] bg-[var(--surface-neutral-xx-weak)] flex items-center justify-center mb-4">
                          <Icon name={category.icon} size={18} className="text-[var(--color-primary-strong)]" />
                        </div>

                        <h4 className="text-[25px] font-bold text-[var(--color-primary-strong)] mb-1" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}>
                          {category.title}
                        </h4>

                        {category.subtitle && (
                          <p className="text-[15px] text-[var(--text-neutral-medium)]">{category.subtitle}</p>
                        )}

                        {!category.isAddNew && (
                          <div className="mt-auto pt-4 flex items-center gap-2">
                            <Button variant="outlined" size="small" className="!h-8 !px-3 !text-[13px]">
                              Add Policy
                            </Button>
                            <button className="h-8 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] flex items-center gap-2">
                              <Icon name="gear" variant="regular" size={13} />
                              <Icon name="caret-down" size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : activeNav === 'time-tracking' ? (
            <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] p-8">
              <h2
                className="text-[36px] font-bold text-[var(--color-primary-strong)] mb-6 pb-6 border-b border-[var(--border-neutral-x-weak)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '40px' }}
              >
                Time Tracking
              </h2>

              <div className="flex flex-col xl:flex-row gap-6">
                <aside className="w-full xl:w-[290px] shrink-0">
                  <nav className="space-y-2">
                    {timeTrackingSidebarItems.map((item) => {
                      const isActive = item.id === activeTimeTrackingTab;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTimeTrackingTab(item.id)}
                          className={`
                            w-full text-left px-3 py-2 rounded-[var(--radius-xx-small)]
                            text-[15px] font-semibold transition-colors
                            ${
                              isActive
                                ? 'bg-[var(--surface-neutral-xx-weak)] text-[var(--color-primary-strong)]'
                                : 'text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)]'
                            }
                          `}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="mt-5 pt-5 border-t border-[var(--border-neutral-x-weak)]">
                    <div className="flex items-center justify-between px-3 mb-3">
                      <h4 className="text-[15px] font-semibold text-[var(--text-neutral-strong)]">Groups</h4>
                      <button className="text-[var(--icon-neutral-strong)] hover:text-[var(--color-primary-strong)]">
                        <Icon name="circle-plus-lined" size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {timeTrackingGroups.map((group) => {
                        const isActive = group.id === activeTimeTrackingGroup;
                        return (
                          <button
                            key={group.id}
                            onClick={() => setActiveTimeTrackingGroup(group.id)}
                            className={`
                              w-full text-left px-3 py-1.5 rounded-[var(--radius-xx-small)]
                              text-[14px] transition-colors
                              ${
                                isActive
                                  ? 'bg-[var(--surface-neutral-xx-weak)] text-[var(--text-neutral-x-strong)]'
                                  : 'text-[var(--text-neutral-medium)] hover:bg-[var(--surface-neutral-xx-weak)]'
                              }
                            `}
                          >
                            {group.label} ({group.count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <section className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className="text-[34px] font-bold text-[var(--color-primary-strong)]"
                      style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '38px' }}
                    >
                      Employees
                    </h3>

                    <div className="flex items-center gap-2">
                      <Button variant="standard" size="small" className="!h-9 !px-4 !text-[14px]">
                        Create Group
                      </Button>
                      <button className="h-9 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] flex items-center gap-2">
                        <Icon name="gear" variant="regular" size={14} />
                        <Icon name="caret-down" size={10} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Button variant="outlined" size="small" icon="circle-plus-lined" showCaret className="!h-8 !px-3 !text-[13px]">
                      Add Employees
                    </Button>
                  </div>

                  <div className="border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-x-small)] overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[var(--surface-neutral-xx-weak)]">
                          <th className="text-left px-4 py-2 text-[14px] font-semibold text-[var(--text-neutral-strong)]">
                            <span className="inline-flex items-center gap-1">
                              Name
                              <Icon name="chevron-up" size={9} className="text-[var(--icon-neutral-strong)]" />
                            </span>
                          </th>
                          <th className="text-left px-4 py-2 text-[14px] font-semibold text-[var(--text-neutral-strong)]">Group</th>
                          <th className="text-left px-4 py-2 text-[14px] font-semibold text-[var(--text-neutral-strong)]">Overtime State</th>
                          <th className="text-left px-4 py-2 text-[14px] font-semibold text-[var(--text-neutral-strong)]">Pay Schedule</th>
                          <th className="w-8" />
                        </tr>
                      </thead>
                      <tbody>
                        {timeTrackingEmployees.map((employee) => {
                          const showDelete = employee.id === 'andy-graves';
                          return (
                            <tr
                              key={employee.id}
                              className={`${showDelete ? 'bg-[var(--surface-neutral-xx-weak)]' : 'bg-[var(--surface-neutral-white)]'} border-t border-[var(--border-neutral-xx-weak)]`}
                            >
                              <td className="px-4 py-3 text-[15px] font-semibold text-[var(--color-link)]">{employee.name}</td>
                              <td className="px-4 py-3 text-[15px] text-[var(--text-neutral-strong)]">{employee.group}</td>
                              <td className="px-4 py-3 text-[15px] text-[var(--text-neutral-strong)]">{employee.overtimeState}</td>
                              <td className="px-4 py-3 text-[15px] text-[var(--text-neutral-strong)]">{employee.paySchedule}</td>
                              <td className="px-3 py-3 text-right">
                                {showDelete && <Icon name="trash-can" size={13} className="text-[var(--icon-neutral-strong)]" />}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] p-8">
              <h2
                className="text-[22px] font-semibold text-[var(--color-primary-strong)] mb-6 pb-6 border-b border-[var(--border-neutral-x-weak)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
              >
                Account
              </h2>

              <div className="flex gap-8">
                <div className="w-[160px] shrink-0">
                  <nav className="flex flex-col">
                    {accountSubTabs.map((tab) => {
                      const isActive = tab.id === activeSubTab;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSubTab(tab.id)}
                          className={`
                            text-left px-3 py-2 text-[15px] transition-colors rounded-[var(--radius-small)]
                            ${
                              isActive
                                ? 'text-[var(--color-primary-strong)] font-semibold bg-[var(--surface-neutral-xx-weak)]'
                                : 'text-[var(--text-neutral-medium)] hover:text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)]'
                            }
                          `}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex-1">
                  <h3
                    className="text-[22px] font-semibold text-[var(--color-primary-strong)] mb-4"
                    style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
                  >
                    Account Info
                  </h3>

                  <div className="mb-8">
                    <h4
                      className="text-[28px] font-bold text-[var(--text-neutral-x-strong)] mb-3"
                      style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '36px' }}
                    >
                      {accountInfo.companyName}
                    </h4>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[15px] text-[var(--text-neutral-medium)]">
                          <Icon name="building" size={16} className="text-[var(--icon-neutral-strong)]" />
                          {accountInfo.accountNumber}
                        </div>
                        <div className="flex items-center gap-2 text-[15px] text-[var(--text-neutral-medium)]">
                          <Icon name="link" size={16} className="text-[var(--icon-neutral-strong)]" />
                          {accountInfo.url}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={accountInfo.owner.avatar}
                          alt={accountInfo.owner.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[16px] font-semibold text-[var(--text-neutral-x-strong)]">
                            {accountInfo.owner.name}
                          </p>
                          <p className="text-[14px] text-[var(--text-neutral-medium)]">
                            {accountInfo.owner.role}
                          </p>
                        </div>
                        <Icon name="caret-down" size={12} className="text-[var(--icon-neutral-strong)]" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="text-[18px] font-semibold text-[var(--color-primary-strong)]"
                        style={{ lineHeight: '26px' }}
                      >
                        My Subscription
                      </h4>
                      <button className="px-6 py-2 text-[15px] font-semibold text-[var(--color-primary-strong)] border-2 border-[var(--color-primary-strong)] rounded-[var(--radius-full)] hover:bg-[var(--color-primary-strong)]/5 transition-colors">
                        Manage Subscription
                      </button>
                    </div>

                    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] px-6 py-5 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] flex items-center justify-center">
                            <Icon name="shield" size={24} className="text-[var(--color-primary-strong)]" />
                          </div>
                          <div>
                            <h5 className="text-[18px] font-bold text-[var(--text-neutral-x-strong)]">
                              {subscription.plan}
                            </h5>
                            <p className="text-[15px] text-[var(--text-neutral-medium)]">
                              {subscription.packageType}
                            </p>
                          </div>
                        </div>
                        <p className="text-[16px] text-[var(--text-neutral-medium)]">
                          {subscription.employees} Employees
                        </p>
                      </div>
                    </div>

                    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] px-6 py-5 mb-6">
                      <h5 className="text-[16px] font-medium text-[var(--color-primary-strong)] mb-4">
                        Add-Ons
                      </h5>
                      <div className="space-y-4">
                        {addOns.map((addOn) => (
                          <div key={addOn.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] flex items-center justify-center">
                                <Icon name={addOn.icon} size={24} className="text-[var(--color-primary-strong)]" />
                              </div>
                              <span className="text-[17px] font-medium text-[var(--text-neutral-x-strong)]">
                                {addOn.title}
                              </span>
                            </div>
                            {addOn.employees && (
                              <span className="text-[16px] text-[var(--text-neutral-medium)]">
                                {addOn.employees}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] px-6 py-5">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] flex items-center justify-center">
                              <Icon name="id-badge" size={24} className="text-[var(--color-primary-strong)]" />
                            </div>
                            <span className="text-[17px] font-medium text-[var(--text-neutral-x-strong)]">
                              Job Postings
                            </span>
                          </div>
                          <p className="text-[16px] text-[var(--text-neutral-medium)]">
                            {jobPostings.current} of {jobPostings.max}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] flex items-center justify-center">
                              <Icon name="file" size={24} className="text-[var(--color-primary-strong)]" />
                            </div>
                            <span className="text-[17px] font-medium text-[var(--text-neutral-x-strong)]">
                              File Storage
                            </span>
                          </div>
                          <p className="text-[16px] text-[var(--text-neutral-medium)]">
                            {fileStorage.used} {fileStorage.unit} of {fileStorage.total} {fileStorage.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4
                      className="text-[18px] font-semibold text-[var(--color-primary-strong)] mb-4"
                      style={{ lineHeight: '26px' }}
                    >
                      Available Upgrades
                    </h4>
                    <div className="space-y-4">
                      {upgrades.map((upgrade) => (
                        <div
                          key={upgrade.id}
                          className="flex items-center justify-between bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] px-6 py-5"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] flex items-center justify-center">
                              <Icon name={upgrade.icon} size={28} className="text-[var(--color-primary-strong)]" />
                            </div>
                            <div>
                              <h5 className="text-[18px] font-bold text-[var(--text-neutral-x-strong)]">
                                {upgrade.title}
                              </h5>
                              <p className="text-[15px] text-[var(--text-neutral-medium)]">
                                {upgrade.subtitle}
                              </p>
                            </div>
                          </div>
                          <button className="text-[16px] font-medium text-[var(--color-primary-strong)] hover:underline">
                            Learn More
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] p-6">
                      <h4
                        className="text-[18px] font-bold text-[var(--text-neutral-x-strong)] mb-2"
                        style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '26px' }}
                      >
                        Supercharge Your Workflow
                      </h4>
                      <p className="text-[14px] text-[var(--text-neutral-medium)] mb-4">
                        Explore our growing library of integrations to help you work smarter and faster.
                      </p>
                      <button className="px-4 py-2 text-[14px] font-semibold text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] hover:bg-[var(--surface-neutral-x-weak)] transition-colors">
                        Explore Apps
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4
                      className="text-[18px] font-semibold text-[var(--color-primary-strong)] mb-3"
                      style={{ lineHeight: '26px' }}
                    >
                      Data
                    </h4>
                    <p className="text-[14px] text-[var(--text-neutral-medium)] mb-1">
                      Data Center Location
                    </p>
                    <div className="flex items-center gap-2">
                      <Icon name="location-dot" size={14} className="text-[var(--color-primary-strong)]" />
                      <span className="text-[15px] font-medium text-[var(--text-neutral-x-strong)]">
                        {dataCenter.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;
