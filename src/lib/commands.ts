export interface CommandDefinition {
  name: string;
  description: string;
  usage?: string;
}

export const COMMANDS: CommandDefinition[] = [
  { name: 'help', description: 'List all available terminal commands' },
  { name: 'about', description: 'Navigate to background synopsis' },
  { name: 'projects', description: 'List all engineered systems' },
  { name: 'projects --honey', description: 'Target camera to Honey Chain flagship' },
  { name: 'skills', description: 'Display technical core competency breakdown' },
  { name: 'contact', description: 'Display verified communication channels' },
  { name: 'hash', description: 'Compute browser SHA-256 digest of "Devansh Yadav"' },
  { name: 'sound on|off', description: 'Toggle ambient pentatonic synthesizer' },
  { name: 'clear', description: 'Clear terminal screen' },
  { name: 'exit', description: 'Close console' },
];
