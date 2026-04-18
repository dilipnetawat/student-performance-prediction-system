// Google Identity Services types
interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      width?: number;
      shape?: string;
      text?: string;
      logo_alignment?: string;
    }
  ) => void;
  prompt: () => void;
}

interface Google {
  accounts: {
    id: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    google: Google;
  }
}

export {};
