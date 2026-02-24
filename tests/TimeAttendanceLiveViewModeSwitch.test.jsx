import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { TimeAttendance } from '../src/pages/TimeAttendance/TimeAttendance';

function renderLiveView(schedulingEnabled) {
  render(
    <MemoryRouter>
      <TimeAttendance schedulingEnabled={schedulingEnabled} />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByText('Live View'));
}

describe('TimeAttendance live view mode switch', () => {
  test('renders CoverageByDayCard when scheduling is enabled', () => {
    renderLiveView(true);

    expect(screen.getByText('Coverage by Day')).not.toBeNull();
    expect(screen.getByText('Mode: Schedule')).not.toBeNull();
    expect(screen.getAllByText('Fill Open Shift').length).toBeGreaterThan(0);
  });

  test('renders AttendanceHealthCard when scheduling is disabled', () => {
    renderLiveView(false);

    expect(screen.getByText('Attendance Health')).not.toBeNull();
    expect(screen.getByText('Mode: No Schedule')).not.toBeNull();
    expect(screen.getByText('View Day')).not.toBeNull();
    expect(screen.queryByText('Fill Open Shift')).toBeNull();
  });

  test('allows manual toggle between coverage and attendance modes', () => {
    renderLiveView(false);

    expect(screen.getByText('Attendance Health')).not.toBeNull();
    fireEvent.click(screen.getByTestId('mode-toggle-schedule'));
    expect(screen.getByText('Coverage by Day')).not.toBeNull();
    expect(screen.getAllByText('Fill Open Shift').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTestId('mode-toggle-no-schedule'));
    expect(screen.getByText('Attendance Health')).not.toBeNull();
  });
});
