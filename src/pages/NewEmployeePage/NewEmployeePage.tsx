import { useState } from 'react';
import {
  Button,
  FormSectionHeader,
  InfoBanner,
  TextInput,
  Dropdown,
  Checkbox,
} from '../../components';

export default function NewEmployeePage() {
  const [sendPacket, setSendPacket] = useState(false);
  const [formData, setFormData] = useState({
    // Personal
    employeeNumber: '',
    firstName: '',
    lastName: '',
    preferredName: '',
    birthDate: '',
    ssn: '',
    gender: '',
    maritalStatus: '',

    // Address
    street1: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',

    // Compensation
    paySchedule: '',
    payType: '',
    payRate: '',
    payRateType: '',
    payPeriod: '',
    payGrade: '',

    // Contact
    workPhone: '',
    mobilePhone: '',
    homePhone: '',
    workEmail: '',
    homeEmail: '',

    // Job
    hireDate: '',

    // Employment Status
    employmentStatus: '',

    // Job Information
    jobTitle: '',
    reportsTo: '',
    department: '',
    division: '',
    location: '',

    // Dependents
    dependentFirstName: '',
    dependentMiddleName: '',
    dependentLastName: '',
    dependentBirthDate: '',
    dependentSSN: '',
    dependentGender: '',
    dependentRelationship: '',

    // Emergency Contact
    emergencyFirstName: '',
    emergencyLastName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    emergencyEmail: '',
    emergencyStreet1: '',
    emergencyStreet2: '',
    emergencyCity: '',
    emergencyState: '',
    emergencyPostalCode: '',
    emergencyCountry: '',

    // Education
    institution: '',
    degree: '',
    major: '',
    gpa: '',
    startDate: '',
    endDate: '',
    secondaryLanguage: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--surface-neutral-xx-weak)]">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-6 bg-[var(--surface-neutral-white)]">
        <div className="max-w-[1248px] mx-auto">
          <div className="flex items-center justify-between">
            <h1
              className="
                font-bold text-[48px] leading-[58px]
                text-[var(--color-primary-strong)]
              "
              style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
            >
              New Employee
            </h1>
            <Button variant="text">
              Customize Add Employee Form
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-[1248px] mx-auto px-8 py-8 space-y-5">
        {/* New Hire Packet Banner */}
        <InfoBanner
          title="Make everyone's life a little bit easier and send a New Hire Packet."
          description="Your new employee will be able to enter their own personal information, sign paperwork, see their team, and more."
          checkboxLabel="Send this new employee a new hire packet"
          checked={sendPacket}
          onCheckboxChange={setSendPacket}
        />

        {/* Personal Section */}
        <FormSectionHeader title="Personal" icon="circle-user">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Employee #"
                  value={formData.employeeNumber}
                  onChange={(value) => handleInputChange('employeeNumber', value)}
                  placeholder="Employee #"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  placeholder="First Name"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Middle Name"
                  value={formData.preferredName}
                  onChange={(value) => handleInputChange('preferredName', value)}
                  placeholder="Middle Name"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  placeholder="Last Name"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Preferred Name"
                  value={formData.preferredName}
                  onChange={(value) => handleInputChange('preferredName', value)}
                  placeholder="Preferred Name"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Birth Date"
                  value={formData.birthDate}
                  onChange={(value) => handleInputChange('birthDate', value)}
                  type="date"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Gender"
                  value={formData.gender}
                  onChange={(value) => handleInputChange('gender', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Marital Status"
                  value={formData.maritalStatus}
                  onChange={(value) => handleInputChange('maritalStatus', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="SSN"
                  value={formData.ssn}
                  onChange={(value) => handleInputChange('ssn', value)}
                  placeholder="SSN"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Address Section */}
        <FormSectionHeader title="Address" icon="home">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[369px]">
                <TextInput
                  label="Street 1"
                  value={formData.street1}
                  onChange={(value) => handleInputChange('street1', value)}
                  placeholder="Street 1"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[369px]">
                <TextInput
                  label="Street 2"
                  value={formData.street2}
                  onChange={(value) => handleInputChange('street2', value)}
                  placeholder="Street 2"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[180px]">
                <TextInput
                  label="City"
                  value={formData.city}
                  onChange={(value) => handleInputChange('city', value)}
                  placeholder="City"
                />
              </div>
              <div className="w-[180px]">
                <TextInput
                  label="State"
                  value={formData.state}
                  onChange={(value) => handleInputChange('state', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[180px]">
                <TextInput
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(value) => handleInputChange('postalCode', value)}
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Compensation Section */}
        <FormSectionHeader title="Compensation" icon="circle-dollar">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Pay Schedule"
                  value={formData.paySchedule}
                  onChange={(value) => handleInputChange('paySchedule', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Pay Type"
                  value={formData.payType}
                  onChange={(value) => handleInputChange('payType', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Pay Rate"
                  value={formData.payRate}
                  onChange={(value) => handleInputChange('payRate', value)}
                  placeholder="Pay Rate"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Pay Rate Type"
                  value={formData.payRateType}
                  onChange={(value) => handleInputChange('payRateType', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Pay Period"
                  value={formData.payPeriod}
                  onChange={(value) => handleInputChange('payPeriod', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Pay Grade"
                  value={formData.payGrade}
                  onChange={(value) => handleInputChange('payGrade', value)}
                  placeholder="Pay Grade"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Contact Section */}
        <FormSectionHeader title="Contact" icon="phone">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Work Phone"
                  value={formData.workPhone}
                  onChange={(value) => handleInputChange('workPhone', value)}
                  placeholder="Work Phone"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Mobile Phone"
                  value={formData.mobilePhone}
                  onChange={(value) => handleInputChange('mobilePhone', value)}
                  placeholder="Mobile Phone"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[325px]">
                <TextInput
                  label="Home Phone"
                  value={formData.homePhone}
                  onChange={(value) => handleInputChange('homePhone', value)}
                  placeholder="Home Phone"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[369px]">
                <TextInput
                  label="Work Email"
                  value={formData.workEmail}
                  onChange={(value) => handleInputChange('workEmail', value)}
                  placeholder="Work Email"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[369px]">
                <TextInput
                  label="Home Email"
                  value={formData.homeEmail}
                  onChange={(value) => handleInputChange('homeEmail', value)}
                  placeholder="Home Email"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Job Section */}
        <FormSectionHeader title="Job" icon="building">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Hire Date"
                  value={formData.hireDate}
                  onChange={(value) => handleInputChange('hireDate', value)}
                  type="date"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Employment Status Section */}
        <FormSectionHeader title="Employment Status" icon="id-badge">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Employment Status"
                  value={formData.employmentStatus}
                  onChange={(value) => handleInputChange('employmentStatus', value)}
                  type="dropdown"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Job Information Section */}
        <FormSectionHeader title="Job Information" icon="building">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Job Title"
                  value={formData.jobTitle}
                  onChange={(value) => handleInputChange('jobTitle', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Reports To"
                  value={formData.reportsTo}
                  onChange={(value) => handleInputChange('reportsTo', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Department"
                  value={formData.department}
                  onChange={(value) => handleInputChange('department', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Division"
                  value={formData.division}
                  onChange={(value) => handleInputChange('division', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Location"
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  type="dropdown"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Dependents Section */}
        <FormSectionHeader title="Dependents" icon="users">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="First Name"
                  value={formData.dependentFirstName}
                  onChange={(value) => handleInputChange('dependentFirstName', value)}
                  placeholder="First Name"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Middle Name"
                  value={formData.dependentMiddleName}
                  onChange={(value) => handleInputChange('dependentMiddleName', value)}
                  placeholder="Middle Name"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Last Name"
                  value={formData.dependentLastName}
                  onChange={(value) => handleInputChange('dependentLastName', value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Birth Date"
                  value={formData.dependentBirthDate}
                  onChange={(value) => handleInputChange('dependentBirthDate', value)}
                  type="date"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="SSN"
                  value={formData.dependentSSN}
                  onChange={(value) => handleInputChange('dependentSSN', value)}
                  placeholder="SSN"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Gender"
                  value={formData.dependentGender}
                  onChange={(value) => handleInputChange('dependentGender', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Relationship"
                  value={formData.dependentRelationship}
                  onChange={(value) => handleInputChange('dependentRelationship', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="pt-4">
              <Button variant="text" icon="circle-plus">
                Add Dependent
              </Button>
            </div>
          </div>
        </FormSectionHeader>

        {/* Emergency Contact Section */}
        <FormSectionHeader title="Emergency Contact" icon="phone">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="First Name"
                  value={formData.emergencyFirstName}
                  onChange={(value) => handleInputChange('emergencyFirstName', value)}
                  placeholder="First Name"
                />
              </div>
              <div className="w-[248px]">
                <TextInput
                  label="Relationship"
                  value={formData.emergencyRelationship}
                  onChange={(value) => handleInputChange('emergencyRelationship', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Last Name"
                  value={formData.emergencyLastName}
                  onChange={(value) => handleInputChange('emergencyLastName', value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Mobile Phone"
                  value={formData.emergencyPhone}
                  onChange={(value) => handleInputChange('emergencyPhone', value)}
                  placeholder="Mobile Phone"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[325px]">
                <TextInput
                  label="Work Phone"
                  value={formData.emergencyPhone}
                  onChange={(value) => handleInputChange('emergencyPhone', value)}
                  placeholder="Work Phone"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[369px]">
                <TextInput
                  label="Email"
                  value={formData.emergencyEmail}
                  onChange={(value) => handleInputChange('emergencyEmail', value)}
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[369px]">
                <TextInput
                  label="Home Phone"
                  value={formData.emergencyPhone}
                  onChange={(value) => handleInputChange('emergencyPhone', value)}
                  placeholder="Home Phone"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[180px]">
                <TextInput
                  label="City"
                  value={formData.emergencyCity}
                  onChange={(value) => handleInputChange('emergencyCity', value)}
                  placeholder="City"
                />
              </div>
              <div className="w-[180px]">
                <TextInput
                  label="State"
                  value={formData.emergencyState}
                  onChange={(value) => handleInputChange('emergencyState', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[180px]">
                <TextInput
                  label="Postal Code"
                  value={formData.emergencyPostalCode}
                  onChange={(value) => handleInputChange('emergencyPostalCode', value)}
                  placeholder="Postal Code"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[180px]">
                <TextInput
                  label="Country"
                  value={formData.emergencyCountry}
                  onChange={(value) => handleInputChange('emergencyCountry', value)}
                  type="dropdown"
                />
              </div>
            </div>
            <div className="pt-4">
              <Button variant="text" icon="circle-plus">
                Add Contact
              </Button>
            </div>
          </div>
        </FormSectionHeader>

        {/* Education Section */}
        <FormSectionHeader title="Education" icon="graduation-cap">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="College/Institution"
                  value={formData.institution}
                  onChange={(value) => handleInputChange('institution', value)}
                  placeholder="College/Institution"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[180px]">
                <TextInput
                  label="Degree"
                  value={formData.degree}
                  onChange={(value) => handleInputChange('degree', value)}
                  type="dropdown"
                />
              </div>
              <div className="w-[369px]">
                <TextInput
                  label="Major/Specialization"
                  value={formData.major}
                  onChange={(value) => handleInputChange('major', value)}
                  placeholder="Major/Specialization"
                />
              </div>
              <div className="w-[112px]">
                <TextInput
                  label="GPA"
                  value={formData.gpa}
                  onChange={(value) => handleInputChange('gpa', value)}
                  placeholder="GPA"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-[248px]">
                <TextInput
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(value) => handleInputChange('startDate', value)}
                  type="date"
                />
              </div>
              <span className="text-[24px] text-[var(--text-neutral-strong)] pt-6">-</span>
              <div className="w-[248px]">
                <TextInput
                  label="End Date"
                  value={formData.endDate}
                  onChange={(value) => handleInputChange('endDate', value)}
                  type="date"
                />
              </div>
            </div>
            <div className="pt-4">
              <Button variant="text" icon="circle-plus">
                Add Education
              </Button>
            </div>
            <div className="flex gap-4">
              <div className="w-[248px]">
                <TextInput
                  label="Secondary Language"
                  value={formData.secondaryLanguage}
                  onChange={(value) => handleInputChange('secondaryLanguage', value)}
                  placeholder="Secondary Language"
                />
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Self-Service Access Section */}
        <FormSectionHeader title="Self-Service Access" icon="lock">
          <div className="space-y-4">
            <div className="flex gap-6">
              <div
                className="
                  w-[380px] h-[102px]
                  bg-[var(--surface-neutral-white)]
                  border-2 border-[var(--border-neutral-medium)]
                  rounded-[var(--radius-small)]
                  p-4
                  flex items-start gap-3
                  cursor-pointer
                  hover:border-[var(--color-primary-medium)]
                "
              >
                <div className="flex items-center justify-center w-10 h-10 bg-[#E8F5E9] rounded-lg">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[15px] text-[var(--text-neutral-xx-strong)] mb-1">
                    Allow full-profile benefits access
                  </h4>
                  <p className="text-[13px] text-[var(--text-neutral-medium)]">
                    This user can access everything on their own profile. They can edit, approve, and more.
                  </p>
                </div>
              </div>
              <div
                className="
                  w-[380px] h-[102px]
                  bg-[var(--surface-neutral-white)]
                  border-2 border-[var(--border-neutral-medium)]
                  rounded-[var(--radius-small)]
                  p-4
                  flex items-start gap-3
                  cursor-pointer
                  hover:border-[var(--color-primary-medium)]
                "
              >
                <div className="flex items-center justify-center w-10 h-10 bg-[var(--surface-neutral-xx-weak)] rounded-lg">
                  <span className="text-2xl">●</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[15px] text-[var(--text-neutral-xx-strong)] mb-1">
                    No Access
                  </h4>
                  <p className="text-[13px] text-[var(--text-neutral-medium)]">
                    This user cannot sign in until you turn on their access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FormSectionHeader>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="primary">
            Save
          </Button>
          <Button variant="standard">
            Save & Create New Hire Packet
          </Button>
          <Button variant="text">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
