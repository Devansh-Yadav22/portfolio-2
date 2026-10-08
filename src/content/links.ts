export interface LinksConfig {
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  resume: string;
  baarishUrl?: string;
}

// Dev must fill these; any empty string will be hidden automatically
export const links: LinksConfig = {
  email: '',
  github: '',
  linkedin: '',
  instagram: '',
  resume: '',
  baarishUrl: '',
};
