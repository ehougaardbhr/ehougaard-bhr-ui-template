import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../components';
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
} from '../../data/settingsData';

interface FilterData {
  departments: string[];
  locations: string[];
}

export function Settings() {
  const [activeNav, setActiveNav] = useState('employee-fields');
  const [activeSubTab, setActiveSubTab] = useState('account-info');
  const [activeFieldTab, setActiveFieldTab] = useState('personal');
  const [draggedGroupIndex, setDraggedGroupIndex] = useState<number | null>(null);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState<{ groupIndex: number; fieldIndex: number } | null>(null);
  const [dragOverGroupIndex, setDragOverGroupIndex] = useState<number | null>(null);
  const [dragOverFieldIndex, setDragOverFieldIndex] = useState<{ groupIndex: number; fieldIndex: number } | null>(null);
  const [openFilterPopover, setOpenFilterPopover] = useState<{ groupIndex: number; fieldIndex: number } | null>(null);
  const [openFilterModal, setOpenFilterModal] = useState<{ groupIndex: number; fieldIndex: number } | null>(null);
  const [openMenuDropdown, setOpenMenuDropdown] = useState<{ groupIndex: number; fieldIndex: number } | null>(null);
  const [openAccessLevelsModal, setOpenAccessLevelsModal] = useState<{ groupIndex: number; fieldIndex: number } | null>(null);
  const [openAccessDropdown, setOpenAccessDropdown] = useState<string | null>(null);
  const [openAddDropdown, setOpenAddDropdown] = useState(false);
  const [openGearDropdown, setOpenGearDropdown] = useState(false);
  const [isCustomizingTabs, setIsCustomizingTabs] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('Department');
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [tabsList, setTabsList] = useState(['Personal', 'Job', 'Emergency', 'Training', 'Assets']);
  const [editingTabIndex, setEditingTabIndex] = useState<number | null>(null);
  const [editingTabName, setEditingTabName] = useState('');
  const [tabScrollPosition, setTabScrollPosition] = useState(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [tempFilters, setTempFilters] = useState<{ departments: string[]; locations: string[] }>({ departments: [], locations: [] });
  const [accessLevels, setAccessLevels] = useState({
    usEmployees: 'View Only',
    usManagers: 'Edit',
    itGuys: 'Edit'
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const addDropdownRef = useRef<HTMLDivElement>(null);
  const gearDropdownRef = useRef<HTMLDivElement>(null);

  // Available filter options
  const availableFilters = {
    departments: ['Customer Support', 'Finance & Accounting', 'IT & Systems', 'Operations', 'Research & Innovation', 'Marketing', 'Training', 'Sales'],
    divisions: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
    jobTitles: ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'Marketing Manager', 'Sales Representative', 'HR Specialist', 'Accountant'],
    locations: ['Chicago Office', 'LA Office', 'New York Office', 'Austin Office', 'Remote'],
    teams: ['Frontend Team', 'Backend Team', 'Mobile Team', 'DevOps Team', 'Design Team', 'Marketing Team', 'Sales Team', 'Support Team']
  };
  const accessLevelOptions = [
    { value: 'No Access', icon: 'lock' },
    { value: 'View Only', icon: 'eye' },
    { value: 'Edit - Approval Required', icon: 'clock' },
    { value: 'Edit', icon: 'pen' },
  ] as const;

  const getAccessLevelOption = (value: string) =>
    accessLevelOptions.find((option) => option.value === value) ?? accessLevelOptions[0];

  // Available fields for Add dropdown
  const availableFieldsBySections = {
    'Basic Information': [
      { id: 'allergies', label: 'Allergies', enabled: false },
      { id: 'dietary-restrictions', label: 'Dietary Restrictions', enabled: true },
      { id: 'birthplace', label: 'Birthplace', enabled: true },
      { id: 'secondary-language', label: 'Secondary Language', enabled: false },
      { id: 'citizenship', label: 'Citizenship', enabled: true },
    ],
    'Social Links': [
      { id: 'x-feed', label: 'X Feed', enabled: false },
      { id: 'facebook-url', label: 'Facebook URL', enabled: true },
      { id: 'linkedin-url', label: 'LinkedIn URL', enabled: false },
    ],
  };

  // Field groups data
  const [fieldGroups, setFieldGroups] = useState([
    {
      id: 'basic-info',
      title: 'Basic Information',
      fields: [
        { label: 'Employee # & Status', type: 'Field Group', badge: null, filters: null },
        { label: 'First Name, Middle Name, Last Name & Preferred Name', type: 'Field Group', badge: null, filters: null },
        { label: 'Birth Date', type: 'Date', badge: null, filters: null },
        {
          label: 'Gender & Marital Status',
          type: 'Field Group',
          badge: 2,
          filters: {
            departments: ['Marketing', 'Training'],
            locations: []
          }
        },
        {
          label: 'SSN',
          type: 'Number',
          badge: 5,
          filters: {
            departments: ['Marketing', 'Training', 'Sales'],
            locations: ['Chicago Office', 'LA Office']
          }
        },
        { label: 'T-Shirt Size', type: 'List: Single Answer', badge: null, filters: null },
      ],
    },
    {
      id: 'address',
      title: 'Address',
      fields: [
        { label: 'Address Line 1, Address Line 2, City, Zip Code, & Country', type: 'Field Group', badge: null, filters: null },
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      fields: [
        { label: 'Work Phone, Work Ext., Mobile Phone, Home Phone, Work Email', type: 'Field Group', badge: null, filters: null },
      ],
    },
    {
      id: 'social-links',
      title: 'Social Links',
      fields: [
        { label: 'Facebook URL', type: 'Short Answer', badge: 3, filters: { departments: ['Marketing', 'Training', 'Sales'], locations: [] } },
        { label: 'LinkedIn URL', type: 'Short Answer', badge: 3, filters: { departments: ['Marketing', 'Training', 'Sales'], locations: [] } },
        { label: 'Instagram URL', type: 'Short Answer', badge: 3, filters: { departments: ['Marketing', 'Training', 'Sales'], locations: [] } },
      ],
    },
  ]);

  // Group drag handlers
  const handleGroupDragStart = (index: number) => {
    setDraggedGroupIndex(index);
  };

  const handleGroupDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedGroupIndex === null || draggedGroupIndex === index) {
      setDragOverGroupIndex(index);
      return;
    }

    setDragOverGroupIndex(index);
    const newGroups = [...fieldGroups];
    const draggedGroup = newGroups[draggedGroupIndex];
    newGroups.splice(draggedGroupIndex, 1);
    newGroups.splice(index, 0, draggedGroup);

    setFieldGroups(newGroups);
    setDraggedGroupIndex(index);
  };

  const handleGroupDragEnd = () => {
    setDraggedGroupIndex(null);
    setDragOverGroupIndex(null);
  };

  // Field drag handlers
  const handleFieldDragStart = (groupIndex: number, fieldIndex: number) => {
    setDraggedFieldIndex({ groupIndex, fieldIndex });
  };

  const handleFieldDragOver = (e: React.DragEvent, groupIndex: number, fieldIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedFieldIndex ||
        (draggedFieldIndex.groupIndex === groupIndex && draggedFieldIndex.fieldIndex === fieldIndex)) {
      setDragOverFieldIndex({ groupIndex, fieldIndex });
      return;
    }

    setDragOverFieldIndex({ groupIndex, fieldIndex });
    const newGroups = [...fieldGroups];

    // Validate that the source field still exists
    if (!newGroups[draggedFieldIndex.groupIndex] ||
        !newGroups[draggedFieldIndex.groupIndex].fields[draggedFieldIndex.fieldIndex]) {
      return;
    }

    // Get the dragged field
    const draggedField = { ...newGroups[draggedFieldIndex.groupIndex].fields[draggedFieldIndex.fieldIndex] };

    // Remove from source group
    newGroups[draggedFieldIndex.groupIndex].fields = newGroups[draggedFieldIndex.groupIndex].fields.filter((_, idx) => idx !== draggedFieldIndex.fieldIndex);

    // Add to target group at the specified position
    newGroups[groupIndex].fields.splice(fieldIndex, 0, draggedField);

    setFieldGroups(newGroups);
    setDraggedFieldIndex({ groupIndex, fieldIndex });
  };

  const handleFieldDragEnd = () => {
    setDraggedFieldIndex(null);
    setDragOverFieldIndex(null);
  };

  // Tab drag handlers
  const handleTabDragStart = (index: number) => {
    setDraggedTabIndex(index);
  };

  const handleTabDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedTabIndex === null || draggedTabIndex === index) return;

    const newTabs = [...tabsList];
    const draggedTab = newTabs[draggedTabIndex];
    newTabs.splice(draggedTabIndex, 1);
    newTabs.splice(index, 0, draggedTab);

    setTabsList(newTabs);
    setDraggedTabIndex(index);
  };

  const handleTabDragEnd = () => {
    setDraggedTabIndex(null);
  };

  // Tab scroll handlers
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsContainerRef.current) return;
    const scrollAmount = 200;
    const newPosition = direction === 'left'
      ? Math.max(0, tabScrollPosition - scrollAmount)
      : tabScrollPosition + scrollAmount;

    tabsContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setTabScrollPosition(newPosition);
  };

  const checkTabsOverflow = () => {
    if (!tabsContainerRef.current) return { canScrollLeft: false, canScrollRight: false };
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
    return {
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft < scrollWidth - clientWidth - 1
    };
  };

  // Handle opening filter modal
  const handleOpenFilterModal = (groupIndex: number, fieldIndex: number) => {
    const field = fieldGroups[groupIndex].fields[fieldIndex];
    if (field.filters) {
      setTempFilters({
        departments: [...field.filters.departments],
        locations: [...field.filters.locations]
      });
    } else {
      setTempFilters({ departments: [], locations: [] });
    }
    setOpenFilterModal({ groupIndex, fieldIndex });
    setOpenFilterPopover(null);
    setExpandedSection('Department');
  };

  // Handle saving filters from modal
  const handleSaveFilters = () => {
    if (!openFilterModal) return;

    const { groupIndex, fieldIndex } = openFilterModal;
    const newGroups = [...fieldGroups];
    const field = newGroups[groupIndex].fields[fieldIndex];

    const totalFilters = tempFilters.departments.length + tempFilters.locations.length;

    if (totalFilters > 0) {
      field.filters = {
        departments: [...tempFilters.departments],
        locations: [...tempFilters.locations]
      };
      field.badge = totalFilters;
    } else {
      field.filters = null;
      field.badge = null;
    }

    setFieldGroups(newGroups);
    setOpenFilterModal(null);
  };

  // Handle toggling a filter option
  const handleToggleFilterOption = (type: 'department' | 'location', value: string) => {
    if (type === 'department') {
      setTempFilters(prev => ({
        ...prev,
        departments: prev.departments.includes(value)
          ? prev.departments.filter(d => d !== value)
          : [...prev.departments, value]
      }));
    } else {
      setTempFilters(prev => ({
        ...prev,
        locations: prev.locations.includes(value)
          ? prev.locations.filter(l => l !== value)
          : [...prev.locations, value]
      }));
    }
  };

  // Handle removing a filter chip
  const handleRemoveFilter = (groupIndex: number, fieldIndex: number, type: 'department' | 'location', filterValue: string) => {
    const newGroups = [...fieldGroups];
    const field = newGroups[groupIndex].fields[fieldIndex];

    if (field.filters) {
      if (type === 'department') {
        field.filters = {
          ...field.filters,
          departments: field.filters.departments.filter(d => d !== filterValue)
        };
      } else {
        field.filters = {
          ...field.filters,
          locations: field.filters.locations.filter(l => l !== filterValue)
        };
      }

      // Update badge count
      const totalFilters = field.filters.departments.length + field.filters.locations.length;
      field.badge = totalFilters > 0 ? totalFilters : null;

      // If no filters left, set filters to null
      if (totalFilters === 0) {
        field.filters = null;
      }
    }

    setFieldGroups(newGroups);
  };

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenFilterPopover(null);
      }
    };

    if (openFilterPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openFilterPopover]);

  // Handle click outside to close menu dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setOpenMenuDropdown(null);
      }
    };

    if (openMenuDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-access-dropdown]')) {
        setOpenAccessDropdown(null);
      }
    };

    if (openAccessDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openAccessDropdown]);

  // Handle click outside to close Add dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setOpenAddDropdown(false);
      }
    };

    if (openAddDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openAddDropdown]);

  // Handle click outside to close Gear dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gearDropdownRef.current && !gearDropdownRef.current.contains(event.target as Node)) {
        setOpenGearDropdown(false);
      }
    };

    if (openGearDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openGearDropdown]);

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <h1
        className="text-[44px] font-bold text-[var(--color-primary-strong)] px-8 pt-8 pb-6"
        style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '52px' }}
      >
        Settings
      </h1>

      <div className="flex min-h-full">
        {/* Left Sidebar Navigation */}
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
                      ? 'bg-[var(--color-primary-strong)] text-white'
                      : 'text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-white)] hover:text-[var(--color-primary-strong)]'
                  }
                `}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  className={isActive ? 'text-white' : 'text-[var(--icon-neutral-strong)] group-hover:text-[var(--color-primary-strong)]'}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

        {/* Main Content Area */}
        <main className="flex-1 px-10 pt-0 pb-10 overflow-y-auto">
          {/* Employee Fields Content */}
          {activeNav === 'employee-fields' && (
            <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-small)] p-8 shadow-[2px_2px_0px_2px_rgba(56,49,47,0.05)]">
              {/* Section Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2
                      className="text-[26px] font-semibold text-[var(--color-primary-strong)] mb-1"
                      style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '34px' }}
                    >
                      Employee Fields
                    </h2>
                    <p className="text-[14px] text-[var(--text-neutral-strong)]">
                      Customize which details are tracked in employee profiles and how they appear.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenAddDropdown(!openAddDropdown)}
                        className="flex items-center gap-2 h-10 pl-3 pr-4 bg-[var(--surface-neutral-white)] border border-[var(--color-primary-strong)] rounded-full text-[var(--color-primary-strong)] text-[15px] font-semibold hover:bg-[var(--surface-neutral-xx-weak)] transition-colors shadow-[1px_1px_0px_1px_rgba(56,49,47,0.04)]"
                      >
                        <Icon name="circle-plus" size={16} />
                        Add
                        <Icon name="chevron-down" size={14} />
                      </button>

                      {/* Add Dropdown */}
                      {openAddDropdown && (
                        <div
                          ref={addDropdownRef}
                          className="absolute top-full left-0 mt-2 w-[240px] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-small)] shadow-[3px_3px_10px_2px_rgba(56,49,47,0.1)] z-50 py-3"
                        >
                          {/* Field sections */}
                          {Object.entries(availableFieldsBySections).map(([sectionName, fields], sectionIdx) => (
                            <div key={sectionName}>
                              {/* Section header */}
                              <div className="px-4 py-2 text-[13px] font-semibold leading-[19px] text-[var(--text-neutral-medium)]">
                                {sectionName}
                              </div>
                              {/* Fields */}
                              {fields.map((field) => (
                                <label
                                  key={field.id}
                                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                                >
                                  <div className="relative flex items-center justify-center">
                                    <input
                                      type="checkbox"
                                      checked={field.enabled}
                                      onChange={() => {
                                        console.log(`Toggle ${field.label}`);
                                      }}
                                      className="appearance-none w-4 h-4 rounded-[var(--radius-xxx-small)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-x-weak)] cursor-pointer checked:bg-[var(--color-primary-strong)] checked:border-[var(--color-primary-strong)] shadow-[inset_1px_1px_0px_1px_rgba(56,49,47,0.05)]"
                                    />
                                    {field.enabled && (
                                      <Icon
                                        name="check"
                                        size={12}
                                        className="absolute text-white pointer-events-none"
                                      />
                                    )}
                                  </div>
                                  <span className="text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)]">
                                    {field.label}
                                  </span>
                                </label>
                              ))}
                              {/* Add spacing after section except last one */}
                              {sectionIdx < Object.entries(availableFieldsBySections).length - 1 && (
                                <div className="h-2" />
                              )}
                            </div>
                          ))}

                          {/* Divider */}
                          <div className="border-t border-[var(--border-neutral-x-weak)] my-2" />

                          {/* Action items */}
                          <button
                            onClick={() => {
                              const newSection = {
                                id: `new-section-${Date.now()}`,
                                title: 'New Section',
                                fields: []
                              };
                              setFieldGroups([...fieldGroups, newSection]);
                              setEditingSectionIndex(fieldGroups.length);
                              setEditingSectionName('New Section');
                              setOpenAddDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                          >
                            <Icon name="grip" size={16} className="text-[var(--icon-neutral-strong)]" />
                            New Section
                          </button>
                          <button
                            onClick={() => {
                              console.log('New Custom Field clicked');
                              setOpenAddDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                          >
                            <Icon name="pen-to-square" size={16} className="text-[var(--icon-neutral-strong)]" />
                            New Custom Field
                          </button>
                          <button
                            onClick={() => {
                              console.log('New Custom Table clicked');
                              setOpenAddDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                          >
                            <Icon name="table-cells" size={16} className="text-[var(--icon-neutral-strong)]" />
                            New Custom Table
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenGearDropdown(!openGearDropdown)}
                        className="flex items-center gap-2 h-10 pl-3 pr-4 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full text-[var(--text-neutral-x-strong)] text-[15px] font-medium hover:bg-[var(--surface-neutral-xx-weak)] transition-colors shadow-[1px_1px_0px_1px_rgba(56,49,47,0.04)]"
                      >
                        <Icon name="gear" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                        <Icon name="chevron-down" size={14} className="text-[var(--icon-neutral-x-strong)]" />
                      </button>

                      {/* Gear Dropdown */}
                      {openGearDropdown && (
                        <div
                          ref={gearDropdownRef}
                          className="absolute top-full right-0 mt-2 w-[224px] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-small)] shadow-[3px_3px_10px_2px_rgba(56,49,47,0.1)] z-50 py-1"
                        >
                          <button
                            onClick={() => {
                              console.log('Restore from Archive clicked');
                              setOpenGearDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                          >
                            <Icon name="archive" size={16} className="text-[var(--icon-neutral-strong)]" />
                            Restore from Archive
                          </button>
                          <button
                            onClick={() => {
                              setIsCustomizingTabs(true);
                              setOpenGearDropdown(false);
                              // Scroll to the right to show the "Add Tab" button
                              setTimeout(() => {
                                if (tabsContainerRef.current) {
                                  tabsContainerRef.current.scrollTo({
                                    left: tabsContainerRef.current.scrollWidth,
                                    behavior: 'smooth'
                                  });
                                }
                              }, 100);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                          >
                            <Icon name="wrench" size={16} className="text-[var(--icon-neutral-strong)]" />
                            Customize Tabs
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-[var(--border-neutral-x-weak)] mb-6">
                <div className="flex items-center gap-2 relative">
                  {/* Left scroll arrow */}
                  {checkTabsOverflow().canScrollLeft && (
                    <button
                      onClick={() => scrollTabs('left')}
                      className="flex items-center justify-center w-8 h-8 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors z-10"
                    >
                      <Icon name="chevron-right" size={16} className="rotate-180 text-[var(--icon-neutral-strong)]" />
                    </button>
                  )}

                  {/* Tabs container with horizontal scroll */}
                  <div
                    ref={tabsContainerRef}
                    className="flex gap-4 items-center flex-1 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={(e) => setTabScrollPosition(e.currentTarget.scrollLeft)}
                  >
                    {tabsList.map((tab, index) => {
                      const tabId = tab.toLowerCase().replace(/\s+/g, '-');
                      const isActive = activeFieldTab === tabId;
                      const isDragging = draggedTabIndex === index;
                      const isEditing = editingTabIndex === index;
                      return (
                        <div
                          key={`${tabId}-${index}`}
                          draggable={isCustomizingTabs && !isEditing}
                          onDragStart={() => handleTabDragStart(index)}
                          onDragOver={(e) => handleTabDragOver(e, index)}
                          onDragEnd={handleTabDragEnd}
                          className={`flex items-center gap-2 shrink-0 ${isDragging ? 'opacity-50' : ''}`}
                        >
                          {isCustomizingTabs && !isEditing && (
                            <Icon
                              name="grip-vertical"
                              size={12}
                              className="text-[var(--icon-neutral-weak)] cursor-grab active:cursor-grabbing"
                            />
                          )}
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingTabName}
                              onChange={(e) => setEditingTabName(e.target.value)}
                              onBlur={() => {
                                const newTabs = [...tabsList];
                                newTabs[index] = editingTabName || tab;
                                setTabsList(newTabs);
                                setEditingTabIndex(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newTabs = [...tabsList];
                                  newTabs[index] = editingTabName || tab;
                                  setTabsList(newTabs);
                                  setEditingTabIndex(null);
                                }
                                if (e.key === 'Escape') {
                                  setEditingTabIndex(null);
                                }
                              }}
                              autoFocus
                              className="px-3 py-2 text-[16px] font-medium text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-x-small)] focus:outline-none focus:border-[var(--color-primary-strong)]"
                            />
                          ) : (
                            <button
                              onClick={() => {
                                if (isCustomizingTabs) {
                                  setEditingTabIndex(index);
                                  setEditingTabName(tab);
                                } else {
                                  setActiveFieldTab(tabId);
                                }
                              }}
                              className={`
                                px-3 py-3 text-[16px] font-medium transition-colors relative whitespace-nowrap
                                ${isCustomizingTabs ? 'cursor-pointer' : ''}
                                ${isActive
                                  ? 'text-[var(--color-primary-strong)] font-bold'
                                  : 'text-[var(--text-neutral-strong)] hover:text-[var(--text-neutral-x-strong)]'
                                }
                              `}
                            >
                              {tab}
                              {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--color-primary-strong)] rounded-t-[var(--radius-xxx-small)]" />
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {isCustomizingTabs && (
                      <button
                        onClick={() => {
                          const newTabName = 'New Tab';
                          const newTabs = [...tabsList, newTabName];
                          setTabsList(newTabs);
                          setEditingTabIndex(newTabs.length - 1);
                          setEditingTabName(newTabName);
                          // Scroll to the right after adding a tab
                          setTimeout(() => {
                            if (tabsContainerRef.current) {
                              tabsContainerRef.current.scrollTo({
                                left: tabsContainerRef.current.scrollWidth,
                                behavior: 'smooth'
                              });
                            }
                          }, 50);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[15px] text-[var(--color-primary-strong)] hover:bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] transition-colors whitespace-nowrap"
                      >
                        <Icon name="circle-plus" size={16} />
                        Add Tab
                      </button>
                    )}
                  </div>

                  {/* Right scroll arrow */}
                  {checkTabsOverflow().canScrollRight && (
                    <button
                      onClick={() => scrollTabs('right')}
                      className="flex items-center justify-center w-8 h-8 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors z-10"
                    >
                      <Icon name="chevron-right" size={16} className="text-[var(--icon-neutral-strong)]" />
                    </button>
                  )}

                  {/* Done button when customizing */}
                  {isCustomizingTabs && (
                    <button
                      onClick={() => {
                        setIsCustomizingTabs(false);
                        setEditingTabIndex(null);
                      }}
                      className="px-5 py-2 bg-[var(--color-primary-strong)] text-white text-[15px] font-semibold rounded-full hover:opacity-90 transition-opacity shrink-0"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>

              {/* Field Groups */}
              <div className={`space-y-3 relative ${isCustomizingTabs ? 'pointer-events-none' : ''}`}>
                {isCustomizingTabs && (
                  <div className="absolute inset-0 bg-[var(--surface-neutral-white)] opacity-60 z-10 rounded-[var(--radius-small)]" />
                )}
                {fieldGroups.map((group, groupIndex) => {
                  const isDropZone = dragOverGroupIndex === groupIndex && draggedGroupIndex !== null && draggedGroupIndex !== groupIndex;
                  return (
                    <div
                      key={group.id}
                      draggable
                      onDragStart={() => handleGroupDragStart(groupIndex)}
                      onDragOver={(e) => handleGroupDragOver(e, groupIndex)}
                      onDragEnd={handleGroupDragEnd}
                      className={`
                        bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] p-5 shadow-[2px_2px_0px_2px_rgba(56,49,47,0.05)] relative
                        group/section
                        ${isDropZone ? '' : ''}
                      `}
                    >
                      {isDropZone && (
                        <div className="absolute inset-0 rounded-[var(--radius-small)] border-2 border-dotted border-[var(--color-link)] pointer-events-none" />
                      )}
                      <div className="flex items-center gap-3 mb-3 cursor-move">
                        <Icon
                          name="grip-vertical"
                          size={12}
                          className="text-[var(--icon-neutral-weak)] cursor-grab active:cursor-grabbing opacity-0 group-hover/section:opacity-100 transition-opacity"
                        />
                        {editingSectionIndex === groupIndex ? (
                          <input
                            type="text"
                            value={editingSectionName}
                            onChange={(e) => setEditingSectionName(e.target.value)}
                            onBlur={() => {
                              const newGroups = [...fieldGroups];
                              newGroups[groupIndex].title = editingSectionName;
                              setFieldGroups(newGroups);
                              setEditingSectionIndex(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const newGroups = [...fieldGroups];
                                newGroups[groupIndex].title = editingSectionName;
                                setFieldGroups(newGroups);
                                setEditingSectionIndex(null);
                              }
                            }}
                            autoFocus
                            className="text-[16px] font-semibold leading-6 text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-x-small)] px-3 py-1 focus:outline-none focus:border-[var(--color-primary-strong)]"
                          />
                        ) : (
                          <h3 className="text-[16px] font-semibold leading-6 text-[var(--text-neutral-x-strong)]">
                            {group.title}
                          </h3>
                        )}
                      </div>
                    <div
                      className="space-y-2"
                      onDragOver={(e) => {
                        if (group.fields.length === 0) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      onDrop={(e) => {
                        if (group.fields.length === 0 && draggedFieldIndex) {
                          e.preventDefault();
                          e.stopPropagation();

                          const newGroups = [...fieldGroups];

                          // Validate source still exists
                          if (!newGroups[draggedFieldIndex.groupIndex] ||
                              !newGroups[draggedFieldIndex.groupIndex].fields[draggedFieldIndex.fieldIndex]) {
                            return;
                          }

                          const draggedField = { ...newGroups[draggedFieldIndex.groupIndex].fields[draggedFieldIndex.fieldIndex] };

                          // Remove from source
                          newGroups[draggedFieldIndex.groupIndex].fields = newGroups[draggedFieldIndex.groupIndex].fields.filter((_, idx) => idx !== draggedFieldIndex.fieldIndex);

                          // Add to empty section
                          newGroups[groupIndex].fields.push(draggedField);

                          setFieldGroups(newGroups);
                          setDraggedFieldIndex(null);
                          setDragOverFieldIndex(null);
                        }
                      }}
                    >
                      {group.fields.length === 0 ? (
                        <div
                          className="bg-[var(--surface-neutral-white)] border border-dashed border-[var(--border-neutral-medium)] rounded-[var(--radius-x-small)] px-5 py-8 text-center hover:border-[var(--color-link)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                        >
                          <p className="text-[15px] leading-[22px] text-[var(--text-neutral-medium)]">
                            Drag fields here from other sections
                          </p>
                        </div>
                      ) : (
                        group.fields.map((field, fieldIndex) => {
                        const isBeingDragged = draggedFieldIndex?.groupIndex === groupIndex && draggedFieldIndex?.fieldIndex === fieldIndex;
                        const isDropZone = dragOverFieldIndex?.groupIndex === groupIndex &&
                                          dragOverFieldIndex?.fieldIndex === fieldIndex &&
                                          draggedFieldIndex !== null &&
                                          !isBeingDragged;

                        // Map field types to icons
                        const typeIconMap: { [key: string]: string } = {
                          'Field Group': 'pen-to-square',
                          'Date': 'calendar',
                          'Number': 'hashtag',
                          'List: Single Answer': 'grip-lines',
                          'Short Answer': 'pen',
                        };

                        return (
                          <div
                            key={fieldIndex}
                            draggable
                            onDragStart={() => handleFieldDragStart(groupIndex, fieldIndex)}
                            onDragOver={(e) => handleFieldDragOver(e, groupIndex, fieldIndex)}
                            onDragEnd={handleFieldDragEnd}
                            className={`
                              bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-x-small)] px-5 h-[46px] shadow-[1px_1px_0px_1px_rgba(56,49,47,0.04)] relative
                              grid items-center grid-cols-[minmax(0,1fr)_320px] gap-2 group/row hover:border-[var(--border-neutral-medium)] transition-colors
                              ${isDropZone ? '' : ''}
                            `}
                          >
                            {isDropZone && (
                              <div className="absolute inset-0 rounded-[var(--radius-x-small)] border-2 border-dotted border-[var(--color-link)] pointer-events-none" />
                            )}
                            {/* Left side: Grip and field label */}
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon
                                name="grip-vertical"
                                size={12}
                                className="text-[var(--icon-neutral-weak)] cursor-grab active:cursor-grabbing shrink-0"
                              />
                              <span className="text-[14px] leading-5 text-[var(--text-neutral-x-strong)] truncate">
                                {field.label}
                              </span>
                            </div>

                            {/* Right side: Field type, badge, and menu */}
                            <div className="flex items-center w-[320px] gap-3">
                              <div className="flex items-center gap-2 text-left text-[14px] leading-5 text-[var(--text-neutral-medium)] flex-1 min-w-0">
                                <Icon
                                  name={typeIconMap[field.type] || 'pen'}
                                  size={14}
                                  className="text-[var(--icon-neutral-medium)] shrink-0"
                                />
                                <span className="whitespace-nowrap">{field.type}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                {field.badge !== null && (
                                  <div className="relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const isOpen = openFilterPopover?.groupIndex === groupIndex && openFilterPopover?.fieldIndex === fieldIndex;
                                        setOpenFilterPopover(isOpen ? null : { groupIndex, fieldIndex });
                                      }}
                                      className="flex items-center gap-1 text-[13px] leading-[19px] text-[var(--color-link)] font-semibold whitespace-nowrap cursor-pointer hover:text-[var(--color-primary-strong)] transition-colors"
                                    >
                                      <Icon name="filter" size={14} className="text-current" />
                                      {field.badge}
                                    </button>

                                    {/* Filter Popover */}
                                    {openFilterPopover?.groupIndex === groupIndex && openFilterPopover?.fieldIndex === fieldIndex && field.filters && (
                                      <div
                                        ref={popoverRef}
                                        className="absolute top-full right-0 mt-2 w-[320px] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-small)] shadow-[3px_3px_10px_2px_rgba(56,49,47,0.1)] z-50"
                                      >
                                        <div className="p-5 space-y-3">
                                          {/* Header */}
                                          <div className="flex items-start justify-between gap-2">
                                            <h3
                                              className="text-[21px] font-semibold leading-[26px] text-[var(--color-primary-strong)]"
                                              style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
                                            >
                                              Applies To...
                                            </h3>
                                            <button
                                              onClick={() => setOpenFilterPopover(null)}
                                              className="w-6 h-6 flex items-center justify-center hover:bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-xxx-small)] transition-colors"
                                            >
                                              <Icon name="xmark" size={14} className="text-[var(--icon-neutral-x-strong)]" />
                                            </button>
                                          </div>

                                          {/* Filter count and Edit button */}
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-[14px] leading-5 text-[var(--text-neutral-x-strong)]">
                                              <Icon name="filter" size={14} className="text-[var(--icon-neutral-x-strong)]" />
                                              <span>{field.badge} Filters</span>
                                            </div>
                                            <button
                                              onClick={() => handleOpenFilterModal(groupIndex, fieldIndex)}
                                              className="text-[15px] leading-[22px] text-[var(--color-link)] font-medium hover:text-[var(--color-primary-strong)] transition-colors"
                                            >
                                              Edit
                                            </button>
                                          </div>

                                          {/* Filter sections */}
                                          <div className="space-y-3">
                                            {field.filters.departments.length > 0 && (
                                              <div className="space-y-2">
                                                <div className="text-[13px] leading-[19px] font-semibold text-[var(--text-neutral-x-strong)]">
                                                  Department
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {field.filters.departments.map((dept, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="flex items-center gap-1 px-3 py-1 bg-[var(--surface-neutral-xx-weak)] border border-[var(--border-neutral-weak)] rounded-full text-[13px] leading-[19px] text-[var(--text-neutral-x-strong)] font-medium"
                                                    >
                                                      {dept}
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleRemoveFilter(groupIndex, fieldIndex, 'department', dept);
                                                        }}
                                                        className="w-4 h-4 flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] rounded-full transition-colors"
                                                      >
                                                        <Icon name="xmark" size={10} className="text-[var(--icon-neutral-strong)]" />
                                                      </button>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {field.filters.locations.length > 0 && (
                                              <div className="space-y-2">
                                                <div className="text-[13px] leading-[19px] font-semibold text-[var(--text-neutral-x-strong)]">
                                                  Location
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {field.filters.locations.map((loc, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="flex items-center gap-1 px-3 py-1 bg-[var(--surface-neutral-xx-weak)] border border-[var(--border-neutral-weak)] rounded-full text-[13px] leading-[19px] text-[var(--text-neutral-x-strong)] font-medium"
                                                    >
                                                      {loc}
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleRemoveFilter(groupIndex, fieldIndex, 'location', loc);
                                                        }}
                                                        className="w-4 h-4 flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] rounded-full transition-colors"
                                                      >
                                                        <Icon name="xmark" size={10} className="text-[var(--icon-neutral-strong)]" />
                                                      </button>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const isOpen = openMenuDropdown?.groupIndex === groupIndex && openMenuDropdown?.fieldIndex === fieldIndex;
                                      setOpenMenuDropdown(isOpen ? null : { groupIndex, fieldIndex });
                                    }}
                                    className="w-6 h-6 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
                                  >
                                    <Icon name="ellipsis" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                                  </button>

                                  {/* Menu Dropdown */}
                                  {openMenuDropdown?.groupIndex === groupIndex && openMenuDropdown?.fieldIndex === fieldIndex && (
                                    <div
                                      ref={menuDropdownRef}
                                      className="absolute top-full right-0 mt-2 w-[224px] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-small)] shadow-[3px_3px_10px_2px_rgba(56,49,47,0.1)] z-50 py-1"
                                    >
                                      <button
                                        onClick={() => {
                                          console.log('Edit clicked');
                                          setOpenMenuDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                                      >
                                        <Icon name="pen" size={16} className="text-[var(--icon-neutral-strong)]" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleOpenFilterModal(groupIndex, fieldIndex);
                                          setOpenMenuDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                                      >
                                        <Icon name="filter" size={16} className="text-[var(--icon-neutral-strong)]" />
                                        Applies To...
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenAccessLevelsModal({ groupIndex, fieldIndex });
                                          setOpenMenuDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                                      >
                                        <Icon name="lock" size={16} className="text-[var(--icon-neutral-strong)]" />
                                        Adjust Access Levels
                                      </button>
                                      <div className="border-t border-[var(--border-neutral-x-weak)] my-1" />
                                      <button
                                        onClick={() => {
                                          console.log('Remove clicked');
                                          setOpenMenuDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] leading-[22px] text-[var(--color-error-medium)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                                      >
                                        <Icon name="circle-minus" size={16} className="text-current" />
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          )}

          {/* Account Card */}
          {activeNav === 'account' && (
          <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] p-8">
            {/* Account Heading */}
            <h2
              className="text-[22px] font-semibold text-[var(--color-primary-strong)] mb-6 pb-6 border-b border-[var(--border-neutral-x-weak)]"
              style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
            >
              Account
            </h2>

            {/* Content Layout - Vertical Tabs + Content */}
            <div className="flex gap-8">
              {/* Vertical Sub-tabs */}
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

              {/* Account Info Content */}
              <div className="flex-1">
                <h3
                  className="text-[22px] font-semibold text-[var(--color-primary-strong)] mb-4"
                  style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
                >
                  Account Info
                </h3>

            {/* Account Info Header */}
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
                    <Icon name="building" size={16} className="text-[var(--icon-neutral-medium)]" />
                    {accountInfo.accountNumber}
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[var(--text-neutral-medium)]">
                    <Icon name="link" size={16} className="text-[var(--icon-neutral-medium)]" />
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
                  <Icon name="caret-down" size={12} className="text-[var(--icon-neutral-medium)]" />
                </div>
              </div>
            </div>

            {/* My Subscription Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4
                  className="text-[18px] font-semibold text-[var(--color-primary-strong)]"
                  style={{ lineHeight: '26px' }}
                >
                  My Subscription
                </h4>
                <button className="px-6 py-2 text-[15px] font-semibold text-[var(--color-primary-strong)] border-2 border-[var(--color-primary-strong)] rounded-[var(--radius-full)] hover:bg-[var(--color-primary-weak)] transition-colors">
                  Manage Subscription
                </button>
              </div>

              {/* Pro Package Card */}
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

              {/* Add-Ons Card */}
              <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] px-6 py-5 mb-6">
                <h5 className="text-[16px] font-medium text-[var(--color-primary-strong)] mb-4">
                  Add-Ons
                </h5>
                <div className="space-y-4">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className="flex items-center justify-between"
                    >
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

              {/* Job Postings & File Storage - Combined Card */}
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

            {/* Available Upgrades Section */}
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

            {/* Supercharge Your Workflow Section */}
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

            {/* Data Section */}
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

      {/* Filter Modal */}
      {openFilterModal && (
        <div className="fixed inset-0 bg-[rgba(103,98,96,0.9)] flex items-center justify-center z-[100]">
          <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-small)] shadow-[2px_2px_0px_2px_rgba(56,49,47,0.05)] w-[608px] flex flex-col p-1">
            {/* Modal Header */}
            <div className="bg-[var(--surface-neutral-xx-weak)] rounded-t-[var(--radius-x-small)] px-5 py-4 flex items-center justify-between">
              <h2
                className="text-[26px] font-semibold leading-[34px] text-[var(--color-primary-strong)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
              >
                Filter Options
              </h2>
              <button
                onClick={() => setOpenFilterModal(null)}
                className="w-8 h-8 flex items-center justify-center bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-x-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors shadow-[1px_1px_0px_1px_rgba(56,49,47,0.04)]"
              >
                <Icon name="xmark" size={14} className="text-[var(--icon-neutral-x-strong)]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="bg-[var(--surface-neutral-white)] px-5 pt-5 pb-1 max-h-[500px] overflow-y-auto">
              <h3 className="text-[18px] font-semibold leading-[26px] text-[var(--text-neutral-x-strong)] mb-4">
                Filter Employees By
              </h3>

              <div className="border-t border-[var(--border-neutral-x-weak)]">
                {/* Department Section */}
                <div className="border-b border-[var(--border-neutral-x-weak)]">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'Department' ? null : 'Department')}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                  >
                    <span className="text-[18px] font-semibold leading-[26px] text-[var(--color-primary-strong)]">
                      Department ({tempFilters.departments.length})
                    </span>
                    <Icon
                      name="chevron-down"
                      size={20}
                      className={`text-[var(--color-primary-strong)] transition-transform ${expandedSection === 'Department' ? 'rotate-0' : '-rotate-90'}`}
                    />
                  </button>
                  {expandedSection === 'Department' && (
                    <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                      {availableFilters.departments.map((dept) => (
                        <label key={dept} className="flex items-center gap-2 cursor-pointer">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={tempFilters.departments.includes(dept)}
                              onChange={() => handleToggleFilterOption('department', dept)}
                              className="appearance-none w-4 h-4 rounded-[var(--radius-xxx-small)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-x-weak)] cursor-pointer checked:bg-[var(--color-primary-strong)] checked:border-[var(--color-primary-strong)] shadow-[inset_1px_1px_0px_1px_rgba(56,49,47,0.05)]"
                            />
                            {tempFilters.departments.includes(dept) && (
                              <Icon
                                name="check"
                                size={12}
                                className="absolute text-white pointer-events-none"
                              />
                            )}
                          </div>
                          <span className="text-[15px] leading-[22px] text-[var(--text-neutral-strong)]">
                            {dept}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Division Section */}
                <div className="border-b border-[var(--border-neutral-x-weak)]">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'Division' ? null : 'Division')}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                  >
                    <span className="text-[18px] font-semibold leading-[26px] text-[var(--text-neutral-x-strong)]">
                      Division ({availableFilters.divisions.length})
                    </span>
                    <Icon
                      name="chevron-right"
                      size={20}
                      className="text-[var(--icon-neutral-weak)]"
                    />
                  </button>
                </div>

                {/* Job Title Section */}
                <div className="border-b border-[var(--border-neutral-x-weak)]">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'Job Title' ? null : 'Job Title')}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                  >
                    <span className="text-[18px] font-semibold leading-[26px] text-[var(--text-neutral-x-strong)]">
                      Job Title ({availableFilters.jobTitles.length})
                    </span>
                    <Icon
                      name="chevron-right"
                      size={20}
                      className="text-[var(--icon-neutral-weak)]"
                    />
                  </button>
                </div>

                {/* Location Section */}
                <div className="border-b border-[var(--border-neutral-x-weak)]">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'Location' ? null : 'Location')}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                  >
                    <span className="text-[18px] font-semibold leading-[26px] text-[var(--text-neutral-x-strong)]">
                      Location ({tempFilters.locations.length})
                    </span>
                    <Icon
                      name="chevron-down"
                      size={20}
                      className={`text-[var(--icon-neutral-weak)] transition-transform ${expandedSection === 'Location' ? 'rotate-0' : '-rotate-90'}`}
                    />
                  </button>
                  {expandedSection === 'Location' && (
                    <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                      {availableFilters.locations.map((loc) => (
                        <label key={loc} className="flex items-center gap-2 cursor-pointer">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={tempFilters.locations.includes(loc)}
                              onChange={() => handleToggleFilterOption('location', loc)}
                              className="appearance-none w-4 h-4 rounded-[var(--radius-xxx-small)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-x-weak)] cursor-pointer checked:bg-[var(--color-primary-strong)] checked:border-[var(--color-primary-strong)] shadow-[inset_1px_1px_0px_1px_rgba(56,49,47,0.05)]"
                            />
                            {tempFilters.locations.includes(loc) && (
                              <Icon
                                name="check"
                                size={12}
                                className="absolute text-white pointer-events-none"
                              />
                            )}
                          </div>
                          <span className="text-[15px] leading-[22px] text-[var(--text-neutral-strong)]">
                            {loc}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Teams Section */}
                <div>
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'Teams' ? null : 'Teams')}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                  >
                    <span className="text-[18px] font-semibold leading-[26px] text-[var(--text-neutral-x-strong)]">
                      Teams ({availableFilters.teams.length})
                    </span>
                    <Icon
                      name="chevron-right"
                      size={20}
                      className="text-[var(--icon-neutral-weak)]"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[var(--surface-neutral-xx-weak)] rounded-b-[var(--radius-x-small)] px-5 py-4 flex items-center justify-end gap-4">
              <button
                onClick={() => setOpenFilterModal(null)}
                className="h-10 px-5 text-[15px] font-semibold leading-[22px] text-[var(--color-link)] hover:opacity-80 transition-opacity rounded-full shadow-[1px_1px_0px_1px_rgba(56,49,47,0.06)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFilters}
                className="h-10 px-5 bg-[var(--color-primary-strong)] text-white text-[15px] font-semibold leading-[22px] rounded-full shadow-[1px_1px_0px_1px_rgba(56,49,47,0.05)] hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Levels Modal */}
      {openAccessLevelsModal && (
        <div className="fixed inset-0 bg-[rgba(103,98,96,0.9)] flex items-center justify-center z-[100]">
          <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] shadow-[2px_2px_0px_2px_rgba(56,49,47,0.05)] w-[900px] max-w-[calc(100%-64px)] border border-[var(--border-neutral-x-weak)] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[var(--surface-neutral-xx-weak)] px-8 py-5 flex items-center justify-between border-b border-[var(--border-neutral-x-weak)]">
              <h2
                className="text-[26px] font-semibold leading-[34px] text-[var(--color-primary-strong)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
              >
                {fieldGroups[openAccessLevelsModal.groupIndex].fields[openAccessLevelsModal.fieldIndex].label}
              </h2>
              <button
                onClick={() => setOpenAccessLevelsModal(null)}
                className="w-10 h-10 flex items-center justify-center bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full hover:bg-[var(--surface-neutral-xx-weak)] transition-colors shadow-[1px_1px_0px_1px_rgba(56,49,47,0.04)]"
              >
                <Icon name="xmark" size={16} className="text-[var(--icon-neutral-x-strong)]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6">
              {/* Info Section */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-[var(--border-neutral-x-weak)]">
                <div className="w-12 h-12 rounded-[var(--radius-small)] bg-[var(--surface-neutral-xx-weak)] flex items-center justify-center shrink-0">
                  <Icon name="lock" size={20} className="text-[var(--color-primary-strong)]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--text-neutral-x-strong)] mb-1">
                    Adjust access levels for this field
                  </h3>
                  <p className="text-[14px] leading-5 text-[var(--text-neutral-medium)]">
                    This is something else that we want to say here if we want...
                  </p>
                </div>
              </div>

              {/* Access Levels Grid */}
              <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-[1fr_360px] gap-6 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] px-4 py-3">
                  <div className="text-[16px] font-semibold leading-[22px] text-[var(--text-neutral-x-strong)]">
                    Access Level
                  </div>
                  <div className="text-[16px] font-semibold leading-[22px] text-[var(--text-neutral-x-strong)]">
                    Access Setting
                  </div>
                </div>

                {/* Employee Access Levels Section */}
                <div className="space-y-3">
                  <div className="text-[15px] font-semibold leading-[22px] text-[var(--text-neutral-medium)] bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] px-4 py-2">
                    Employee Access Levels
                  </div>
                  <div className="grid grid-cols-[1fr_360px] gap-6 items-center py-3 border-b border-[var(--border-neutral-x-weak)]">
                    <div className="text-[16px] leading-[24px] text-[var(--text-neutral-strong)]">
                      US Employees
                    </div>
                    <div className="relative" data-access-dropdown>
                      <button
                        type="button"
                        onClick={() => setOpenAccessDropdown(openAccessDropdown === 'usEmployees' ? null : 'usEmployees')}
                        className="w-full h-11 px-4 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] flex items-center justify-between shadow-[inset_1px_1px_0px_1px_rgba(56,49,47,0.02)] hover:border-[var(--border-neutral-strong)]"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name={getAccessLevelOption(accessLevels.usEmployees).icon} size={16} className="text-[var(--text-neutral-strong)]" />
                          <span>{getAccessLevelOption(accessLevels.usEmployees).value}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-px bg-[var(--border-neutral-medium)]" />
                          <Icon name="chevron-down" size={16} className="text-[var(--icon-neutral-strong)]" />
                        </div>
                      </button>
                      {openAccessDropdown === 'usEmployees' && (
                        <div className="absolute right-0 mt-2 w-full bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-small)] shadow-[3px_3px_10px_2px_rgba(56,49,47,0.1)] z-10">
                          {accessLevelOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setAccessLevels(prev => ({ ...prev, usEmployees: option.value }));
                                setOpenAccessDropdown(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                            >
                              <Icon name={option.icon} size={16} className="text-[var(--text-neutral-strong)]" />
                              <span className="text-[15px] leading-[22px] text-[var(--text-neutral-strong)]">{option.value}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Manager Access Levels Section */}
                <div className="space-y-3">
                  <div className="text-[15px] font-semibold leading-[22px] text-[var(--text-neutral-medium)] bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] px-4 py-2">
                    Manager Access Levels
                  </div>
                  <div className="grid grid-cols-[1fr_360px] gap-6 items-center py-3 border-b border-[var(--border-neutral-x-weak)]">
                    <div className="text-[16px] leading-[24px] text-[var(--text-neutral-strong)]">
                      US Managers
                    </div>
                    <div className="relative" data-access-dropdown>
                      <button
                        type="button"
                        onClick={() => setOpenAccessDropdown(openAccessDropdown === 'usManagers' ? null : 'usManagers')}
                        className="w-full h-11 px-4 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] flex items-center justify-between shadow-[inset_1px_1px_0px_1px_rgba(56,49,47,0.02)] hover:border-[var(--border-neutral-strong)]"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name={getAccessLevelOption(accessLevels.usManagers).icon} size={16} className="text-[var(--text-neutral-strong)]" />
                          <span>{getAccessLevelOption(accessLevels.usManagers).value}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-px bg-[var(--border-neutral-medium)]" />
                          <Icon name="chevron-down" size={16} className="text-[var(--icon-neutral-strong)]" />
                        </div>
                      </button>
                      {openAccessDropdown === 'usManagers' && (
                        <div className="absolute right-0 mt-2 w-full bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-small)] shadow-[3px_3px_10px_2px_rgba(56,49,47,0.1)] z-10">
                          {accessLevelOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setAccessLevels(prev => ({ ...prev, usManagers: option.value }));
                                setOpenAccessDropdown(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                            >
                              <Icon name={option.icon} size={16} className="text-[var(--text-neutral-strong)]" />
                              <span className="text-[15px] leading-[22px] text-[var(--text-neutral-strong)]">{option.value}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Access Levels Section */}
                <div className="space-y-3">
                  <div className="text-[15px] font-semibold leading-[22px] text-[var(--text-neutral-medium)] bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] px-4 py-2">
                    Custom Access Levels
                  </div>
                  <div className="grid grid-cols-[1fr_360px] gap-6 items-center py-3 border-b border-[var(--border-neutral-x-weak)]">
                    <div className="text-[16px] leading-[24px] text-[var(--text-neutral-strong)]">
                      IT Guys
                    </div>
                    <div className="relative" data-access-dropdown>
                      <button
                        type="button"
                        onClick={() => setOpenAccessDropdown(openAccessDropdown === 'itGuys' ? null : 'itGuys')}
                        className="w-full h-11 px-4 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] flex items-center justify-between shadow-[inset_1px_1px_0px_1px_rgba(56,49,47,0.02)] hover:border-[var(--border-neutral-strong)]"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name={getAccessLevelOption(accessLevels.itGuys).icon} size={16} className="text-[var(--text-neutral-strong)]" />
                          <span>{getAccessLevelOption(accessLevels.itGuys).value}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-px bg-[var(--border-neutral-medium)]" />
                          <Icon name="chevron-down" size={16} className="text-[var(--icon-neutral-strong)]" />
                        </div>
                      </button>
                      {openAccessDropdown === 'itGuys' && (
                        <div className="absolute right-0 mt-2 w-full bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-small)] shadow-[3px_3px_10px_2px_rgba(56,49,47,0.1)] z-10">
                          {accessLevelOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setAccessLevels(prev => ({ ...prev, itGuys: option.value }));
                                setOpenAccessDropdown(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                            >
                              <Icon name={option.icon} size={16} className="text-[var(--text-neutral-strong)]" />
                              <span className="text-[15px] leading-[22px] text-[var(--text-neutral-strong)]">{option.value}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[var(--surface-neutral-xx-weak)] px-8 py-5 flex items-center justify-end gap-4 border-t border-[var(--border-neutral-x-weak)]">
              <button
                onClick={() => setOpenAccessLevelsModal(null)}
                className="h-10 px-5 text-[15px] font-semibold leading-[22px] text-[var(--color-link)] hover:opacity-80 transition-opacity rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Access levels saved:', accessLevels);
                  setOpenAccessLevelsModal(null);
                }}
                className="h-10 px-5 bg-[var(--color-primary-strong)] text-white text-[15px] font-semibold leading-[22px] rounded-full shadow-[1px_1px_0px_1px_rgba(56,49,47,0.05)] hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
