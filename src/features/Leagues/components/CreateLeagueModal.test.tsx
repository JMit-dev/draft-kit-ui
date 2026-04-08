import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import UpsertLeagueModal from './UpsertLeagueModal';

// mock hook
const mutateAsyncMock = vi.fn();

vi.mock('../hooks/useUpsertLeague', () => ({
  useUpsertLeague: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    isError: false,
    reset: vi.fn(),
  }),
}));

function renderModal() {
  render(
    <ChakraProvider>
      <UpsertLeagueModal isOpen={true} onClose={vi.fn()} />
    </ChakraProvider>,
  );
}

describe('UpsertLeagueModal (create)', () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
  });

  it('renders modal fields', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: /create league/i })).toBeTruthy();
    expect(screen.getByLabelText(/league name/i)).toBeTruthy();
    expect(screen.getByLabelText(/# of teams/i)).toBeTruthy();
    expect(screen.getByLabelText(/draft type/i)).toBeTruthy();
    expect(screen.getByLabelText(/starting budget/i)).toBeTruthy();
  });

  it('shows default values', () => {
    renderModal();

    const teamsInput = screen.getByLabelText(/# of teams/i) as HTMLInputElement;
    expect(teamsInput.value).toBe('12');

    const budgetInput = screen.getByLabelText(
      /starting budget/i,
    ) as HTMLInputElement;
    expect(budgetInput.value).toBe('260');

    const cInput = screen.getByLabelText(/^C$/i) as HTMLInputElement;
    expect(cInput.value).toBe('1');
  });

  it('submit button disabled when league name empty', () => {
    renderModal();

    const button = screen.getByRole('button', {
      name: 'Create League',
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('submit button enabled when league name entered', () => {
    renderModal();

    const nameInput = screen.getByLabelText(/league name/i);
    fireEvent.change(nameInput, { target: { value: 'My League' } });

    const button = screen.getByRole('button', {
      name: 'Create League',
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it('submits correct payload', async () => {
    mutateAsyncMock.mockResolvedValue({});

    renderModal();

    const nameInput = screen.getByLabelText(/league name/i);
    fireEvent.change(nameInput, { target: { value: 'Test League' } });

    const button = screen.getByRole('button', { name: 'Create League' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    const args = mutateAsyncMock.mock.calls[0][0];
    const payload = args.input;

    expect(payload.name).toBe('Test League');
    expect(payload.teams).toBe(12);
    expect(payload.draftType).toBe('auction');
    expect(payload.totalBudget).toBe(260);

    await waitFor(() => {
      const updatedNameInput = screen.getByLabelText(
        /league name/i,
      ) as HTMLInputElement;
      expect(updatedNameInput.value).toBe('');
    });
  });

  it('does not auto-fill roster inputs while editing', () => {
    renderModal();

    const cInput = screen.getByLabelText(/^C$/i) as HTMLInputElement;
    expect(cInput.value).toBe('1');

    fireEvent.change(cInput, { target: { value: '' } });

    expect(cInput.value).toBe('');
  });

  it('submits an updated starting budget', async () => {
    mutateAsyncMock.mockResolvedValue({});

    renderModal();

    fireEvent.change(screen.getByLabelText(/league name/i), {
      target: { value: 'Budget League' },
    });
    fireEvent.change(screen.getByLabelText(/starting budget/i), {
      target: { value: '300' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create League' }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    expect(mutateAsyncMock.mock.calls[0][0].input.totalBudget).toBe(300);
  });
});
