import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LaborRiskSnapshotCard, { demoData } from '../src/components/LaborRiskSnapshotCard';

describe('LaborRiskSnapshotCard', () => {
  test('renders all core labor/risk metrics', () => {
    render(<LaborRiskSnapshotCard />);

    expect(screen.getByText('Labor & Risk Snapshot')).not.toBeNull();
    expect(screen.getByText(`${demoData.inOvertime} in OT`)).not.toBeNull();
    expect(screen.getByText(`${demoData.approachingOvertime} at 38+ hrs`)).not.toBeNull();
    expect(screen.getByText(/Projected OT:/)).not.toBeNull();
    expect(screen.getByText(new RegExp(`Late rate ↑ ${demoData.lateRateDeltaPercent}% vs avg`))).not.toBeNull();
    expect(screen.getByText(demoData.complianceFlag)).not.toBeNull();
  });

  test('fires optional callback when View Details is clicked', () => {
    const onViewLaborDetails = jest.fn();
    render(<LaborRiskSnapshotCard onViewLaborDetails={onViewLaborDetails} />);

    fireEvent.click(screen.getByText('View Details'));
    expect(onViewLaborDetails).toHaveBeenCalledTimes(1);
  });

  test('opens details modal with risk actions when View Details is clicked', () => {
    render(<LaborRiskSnapshotCard />);

    fireEvent.click(screen.getByText('View Details'));
    expect(screen.getByText('Labor & Risk Details')).not.toBeNull();
    expect(screen.getByText(/Action:/)).not.toBeNull();
    expect(screen.getByText(/employees already in overtime/i)).not.toBeNull();
  });
});
