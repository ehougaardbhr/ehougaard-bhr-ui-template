import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CoverageByDayCard, { demoDays, getCoverageStatus } from '../src/components/CoverageByDayCard';

const testDays = [
  { id: 'mon', label: 'Mon', subLabel: 'Feb 23' },
  { id: 'tue', label: 'Tue', subLabel: 'Feb 24' },
  { id: 'sat', label: 'Sat', subLabel: 'Feb 28' },
];

const shifts = [
  { id: 'm1', dayId: 'mon', rowId: 'a', hours: 8 },
  { id: 'm2', dayId: 'mon', rowId: 'b', hours: 8 },
  { id: 't1', dayId: 'tue', rowId: 'c', hours: 8 },
  { id: 't2', dayId: 'tue', rowId: 'd', hours: 8 },
  { id: 't3', dayId: 'tue', rowId: 'e', hours: 8 },
  { id: 't4', dayId: 'tue', rowId: 'f', hours: 8 },
  { id: 't5', dayId: 'tue', rowId: 'g', hours: 8 },
  { id: 't6', dayId: 'tue', rowId: 'h', hours: 8 },
  { id: 't7', dayId: 'tue', rowId: 'i', hours: 8 },
  { id: 't8', dayId: 'tue', rowId: 'j', hours: 8 },
  { id: 't9', dayId: 'tue', rowId: 'k', hours: 8 },
  { id: 's1', dayId: 'sat', rowId: 'l', hours: 8 },
  { id: 's2', dayId: 'sat', rowId: 'm', hours: 8 },
  { id: 's3', dayId: 'sat', rowId: 'n', hours: 8 },
  { id: 's4', dayId: 'sat', rowId: 'o', hours: 8 },
];

describe('CoverageByDayCard', () => {
  test('renders compact rows with status-first content and two CTAs', () => {
    render(<CoverageByDayCard days={testDays} shifts={shifts} />);

    expect(screen.getByText('Coverage by Day')).not.toBeNull();
    expect(screen.getAllByText('View Day').length).toBe(3);
    expect(screen.getAllByText('Fill Open Shift').length).toBe(3);
    expect(screen.getByTestId('coverage-status-mon').textContent).toMatch(/Understaffed/);
  });

  test('clicking a row expands only that row and shows three count metrics', () => {
    render(<CoverageByDayCard days={testDays} shifts={shifts} />);

    fireEvent.click(screen.getByTestId('coverage-row-toggle-mon'));
    expect(screen.getByTestId('coverage-row-panel-mon')).not.toBeNull();
    expect(screen.queryByTestId('coverage-row-panel-tue')).toBeNull();

    expect(screen.getByText(/Open shifts:/)).not.toBeNull();
    expect(screen.getByText(/PTO\/call-outs:/)).not.toBeNull();
    expect(screen.getByText(/Approaching OT:/)).not.toBeNull();

    fireEvent.click(screen.getByTestId('coverage-row-toggle-tue'));
    expect(screen.queryByTestId('coverage-row-panel-mon')).toBeNull();
    expect(screen.getByTestId('coverage-row-panel-tue')).not.toBeNull();
  });

  test('clicking Fill Open Shift executes provided callback', () => {
    const onFillOpenShift = jest.fn();
    render(<CoverageByDayCard days={testDays} shifts={shifts} onFillOpenShift={onFillOpenShift} />);

    fireEvent.click(screen.getAllByText('Fill Open Shift')[0]);
    expect(onFillOpenShift).toHaveBeenCalledWith('mon');
  });

  test('status mapping returns correct compact state', () => {
    expect(getCoverageStatus(10, 10).text).toBe('Fully covered');
    expect(getCoverageStatus(9, 10).text).toContain('At risk');
    expect(getCoverageStatus(6, 10).text).toBe('Understaffed — 4 gaps');
    expect(getCoverageStatus(12, 10).text).toBe('Overstaffed — 2 extra');
  });

  test('demoDays provides preview defaults', () => {
    expect(Array.isArray(demoDays)).toBe(true);
    expect(demoDays.length).toBeGreaterThan(0);
  });
});
